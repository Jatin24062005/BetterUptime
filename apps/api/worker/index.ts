
import axios from "axios";
import { xAck, xReadGroup } from "redisStream";
import { prismaClient } from "store";
import {
  WebsiteStatus,
  NotificationType,
  NotificationStatus,
} from "store/generated/prisma/client";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const WORKER_ID = process.env.WORKER_ID || "worker-1";
const REGION_ID = process.env.REGION_ID || "region-1";

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.get("/", (_, res) => {
  res.send("Worker is alive 🚀");
});

app.listen(PORT, () => {
  console.log(`Worker running on port ${PORT}`);
});

// ------------------------------------
// FAST2SMS
// ------------------------------------

async function sendSMS(mobile: string, message: string) {
  const apiKey = process.env.FAST2SMS_API_KEY;

  if (!apiKey) {
    throw new Error("FAST2SMS_API_KEY is missing");
  }

  const response = await axios.post(
    "https://www.fast2sms.com/dev/bulkV2",
    {
      message,
      language: "english",
      route: "q",
      numbers: mobile,
    },
    {
      headers: {
        authorization: apiKey,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    }
  );

  if (response.data?.return === false) {
    throw new Error(
      response.data?.message || "Fast2SMS rejected the message"
    );
  }

  return response.data;
}

// ------------------------------------
// NOTIFICATION PROCESSOR
// ------------------------------------

async function processPendingNotifications() {
  const notifications = await prismaClient.notification.findMany({
    where: {
      status: NotificationStatus.PENDING,
    },
    include: {
      incident: {
        include: {
          website: {
            include: {
              user: true,
            },
          },
          region: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 20,
  });

  for (const notification of notifications) {
    const mobile = notification.recipient;

    try {
      if (!mobile) {
        throw new Error("User mobile number is missing");
      }

      await sendSMS(mobile, notification.message);

      await prismaClient.notification.update({
        where: {
          id: notification.id,
        },
        data: {
          status: NotificationStatus.SENT,
          sentAt: new Date(),
          attempts: {
            increment: 1,
          },
          error: null,
        },
      });

      console.log("SMS successfully sent:", notification.id);
    } catch (error: any) {
      console.error("Fast2SMS error:", error.response?.data || error.message);

      await prismaClient.notification.update({
        where: {
          id: notification.id,
        },
        data: {
          attempts: {
            increment: 1,
          },
          error: error.response?.data
            ? JSON.stringify(error.response.data)
            : error.message,
          // Keep PENDING so the next worker cycle retries it.
          status: NotificationStatus.PENDING,
        },
      });
    }
  }
}

// ------------------------------------
// PROCESS WEBSITE CHECK
// ------------------------------------

async function processWebsite(
  websiteId: string,
  url: string
) {
  const startTime = Date.now();

  let status = WebsiteStatus.UP;
  let responseTime: number | null = null;
  let errorMessage: string | null = null;

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    responseTime = Date.now() - startTime;

    if (response.status >= 400) {
      status = WebsiteStatus.DOWN;
    }
  } catch (error: any) {
    status = WebsiteStatus.DOWN;

    errorMessage =
      error.code === "ECONNABORTED"
        ? "Request timeout"
        : error.message || "Website request failed";
  }

  const now = new Date();

  // Make sure region exists.
  await prismaClient.region.upsert({
    where: {
      id: REGION_ID,
    },
    update: {},
    create: {
      id: REGION_ID,
      name: "us",
    },
  });

  // Make sure state exists.
  await prismaClient.websiteRegionState.upsert({
    where: {
      websiteId_regionId: {
        websiteId,
        regionId: REGION_ID,
      },
    },
    update: {},
    create: {
      websiteId,
      regionId: REGION_ID,
      currentStatus: WebsiteStatus.UNKNOWN,
    },
  });

  // Persist the tick and process the status transition.
  await prismaClient.$transaction(async (tx) => {
    await tx.websiteTick.create({
      data: {
        websiteId,
        regionId: REGION_ID,
        status,
        responseTime,
        errorMessage,
      },
    });

    if (status === WebsiteStatus.DOWN) {
      // Atomic transition guard:
      // Only the first DOWN check can create an incident.
      const transition = await tx.websiteRegionState.updateMany({
        where: {
          websiteId,
          regionId: REGION_ID,
          currentStatus: {
            not: WebsiteStatus.DOWN,
          },
        },
        data: {
          currentStatus: WebsiteStatus.DOWN,
          outageStartedAt: now,
          lastCheckedAt: now,
        },
      });

      if (transition.count === 1) {
        const website = await tx.website.findUnique({
          where: {
            id: websiteId,
          },
          include: {
            user: true,
          },
        });

        if (!website) {
          throw new Error("Website not found");
        }

        const incident = await tx.incident.create({
          data: {
            websiteId,
            regionId: REGION_ID,
            startedAt: now,
          },
        });

        if (website.user.mobile) {
          await tx.notification.create({
            data: {
              incidentId: incident.id,
              type: NotificationType.DOWN,
              recipient: website.user.mobile,
              message:
                `BetterUptime Alert: ${website.name} is DOWN. ` +
                `Time: ${now.toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}. ` +
                `Do not share this alert with anyone.`,
            },
          });
        }

        console.log("🚨 New incident created:", incident.id);
      } else {
        await tx.websiteRegionState.update({
          where: {
            websiteId_regionId: {
              websiteId,
              regionId: REGION_ID,
            },
          },
          data: {
            lastCheckedAt: now,
          },
        });

        console.log("Website is still DOWN:", websiteId);
      }
    } else {
      // Website is UP.
      const previousState = await tx.websiteRegionState.findUnique({
        where: {
          websiteId_regionId: {
            websiteId,
            regionId: REGION_ID,
          },
        },
      });

      await tx.websiteRegionState.update({
        where: {
          websiteId_regionId: {
            websiteId,
            regionId: REGION_ID,
          },
        },
        data: {
          currentStatus: WebsiteStatus.UP,
          outageStartedAt: null,
          lastCheckedAt: now,
        },
      });

      if (previousState?.currentStatus === WebsiteStatus.DOWN) {
        const incident = await tx.incident.findFirst({
          where: {
            websiteId,
            regionId: REGION_ID,
            resolvedAt: null,
          },
          orderBy: {
            startedAt: "desc",
          },
        });

        if (incident) {
          const duration = Math.floor(
            (now.getTime() - incident.startedAt.getTime()) / 1000
          );

          await tx.incident.update({
            where: {
              id: incident.id,
            },
            data: {
              resolvedAt: now,
              duration,
            },
          });

          const website = await tx.website.findUnique({
            where: {
              id: websiteId,
            },
            include: {
              user: true,
            },
          });

          if (website?.user.mobile) {
            await tx.notification.create({
              data: {
                incidentId: incident.id,
                type: NotificationType.RECOVERY,
                recipient: website.user.mobile,
                message:
                  `BetterUptime Recovery: ${website.name} is UP again. ` +
                  `Downtime: ${Math.floor(duration / 60)} minutes.`,
              },
            });
          }

          console.log("✅ Incident resolved:", incident.id);
        }
      }
    }
  });

  console.log(
    `Website ${websiteId}: ${status}, response: ${responseTime}ms`
  );
}

// ------------------------------------
// REDIS WORKER
// ------------------------------------

async function main() {
  while (true) {
    try {
      // Retry pending SMS notifications.
      await processPendingNotifications();   

      const response = await xReadGroup(REGION_ID, WORKER_ID);

      if (!response || response.length === 0) {
        continue;
      }

      for (const { id, message } of response as any[]) {
        try {
          const websiteId = message?.id;
          const url = message?.url;

          if (!websiteId || !url) {
            throw new Error("Invalid Redis message");
          }

          await processWebsite(websiteId, url);

          // ACK only after the DB transaction succeeds.
          await xAck(REGION_ID, id);
        } catch (error: any) {
          console.error("Website processing failed:", {
            redisId: id,
            message: error.message,
          });

          // Do not ACK failed messages.
          // Ensure your Redis implementation has a pending-message
          // reclaim mechanism so failed messages can be retried.
        }
      }
    } catch (error: any) {
      console.error("Worker loop error:", error.message);

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

main().catch(console.error);
