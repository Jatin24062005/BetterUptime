import express from "express";
import dotenv from "dotenv";
import { prismaClient } from "store";
import { AuthInput } from "./types";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middlware/middleware";
import { ExitStatus } from "typescript";
import { startTransition } from "react";
import { safeParse } from "zod";
import cors from "cors"


dotenv.config();

const app = express();
app.use(express.json())
app.use(cors())


import { z } from "zod";




const MobileInput = z.object({
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
});

app.patch("/user/mobile", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized",
      });
    }

    const parsed = MobileInput.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: "failed",
        message: parsed.error.issues[0].message,
      });
    }

    const { mobile } = parsed.data;

    const user = await prismaClient.user.update({
      where: {
        id: userId,
      },
      data: {
        mobile,
      },
      select: {
        id: true,
        username: true,
        mobile: true,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Mobile number registered successfully",
      user,
      requiresMobileSetup: false,
    });
  } catch (error) {
    console.error("Mobile registration error:", error);

    return res.status(500).json({
      status: "failed",
      message: "Unable to register mobile number",
    });
  }
});



app.get("/user/me", authMiddleware, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized",
      });
    }

    const user = await prismaClient.user.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        username: true,
        mobile: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      user,
      requiresMobileSetup: !user.mobile,
    });
  } catch (error) {
    console.error("User profile error:", error);

    return res.status(500).json({
      status: "failed",
      message: "Unable to fetch profile",
    });
  }
});



app.post("/website", authMiddleware, async (req, res) => {
  if(!req.body.url){
    res.status(400).json({
      status:"Missing Url"
    })
  }

  const website = await prismaClient.website.create({
    data: { url: req.body.url, timeAdded: new Date(), userId : req.userId!, name: req.body.name || req.body.url},
  });
  res.status(201).json({
    message: "Website created successfully",
    id: website.id,
  });
});


app.get("/websites", authMiddleware, async (req,res )=>{
  const userId = req.userId;
  if(!userId){
    res.status(400).json({
      status:"failed",
      message:"User Not found!"
    })
  }



const websites = await prismaClient.website.findMany({
  where: {
    userId,
  },
  include: {
    states: true,

    ticks: {
      orderBy: {
        createdAt: "desc",
      },
      take: 36,
    },

    incidents: {
      where: {
        resolvedAt: null,
      },
      orderBy: {
        startedAt: "desc",
      },
    },
  },
});


  if (!websites || websites.length === 0) {
    res.status(404).json({
      status: "failed",
      message: "No websites found for the user!"
    });
    return;
  }

  // Format createdAt fields in ticks
  const formattedWebsites = websites.map(site => ({
    ...site,
    ticks: site.ticks.map(tick => ({
      ...tick,
      createdAt: tick.createdAt ? new Date(tick.createdAt).toISOString() : null
    }))
  }));

  res.status(200).json({
    status: "success",
    message: "Websites found for the user successfully!",
    websites: formattedWebsites
  });
})




app.get("/status/:websiteId", authMiddleware, async (req, res) => {
  try {
    const { websiteId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized",
      });
    }

    const website = await prismaClient.website.findFirst({
      where: {
        id: websiteId,
        userId,
      },
      include: {
        states: true,
        ticks: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
        incidents: {
          where: {
            resolvedAt: null,
          },
          orderBy: {
            startedAt: "desc",
          },
        },
      },
    });

    if (!website) {
      return res.status(404).json({
        status: "failed",
        message: "Website not found",
      });
    }

    return res.status(200).json({
      status: "success",
      website: {
        id: website.id,
        name: website.name,
        url: website.url,
        currentStatus: website.states,
        latestTick: website.ticks[0] || null,
        activeIncidents: website.incidents,
      },
    });
  } catch (error) {
    console.error("Status fetch error:", error);

    return res.status(500).json({
      status: "failed",
      message: "Unable to fetch website status",
    });
  }
});

app.post("/user/signup", async (req, res) => {
  const data = AuthInput.safeParse(req.body);

  if (!data.success) {
    return res.status(400).json({
      status: "failed",
      message: "Credentials required!",
    });
  }

  const { username, password } = data.data;

  try {
    const user = await prismaClient.user.findFirst({
      where: { username },
    });

    if (user) {
      return res.status(409).json({
        status: "failed",
        message: "User already exists!",
      });
    }

    const newUser = await prismaClient.user.create({
      data: {
        username,
        password, // 🔐 hash this in real apps
      },
    });
    const token = jwt.sign(
    { id: newUser.id, username: newUser.username },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );
    return res.status(201).json({
      status: "success",
      message: "User created!",
      user: newUser,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
});


app.post("/user/signin", async (req, res) => {
  try {
    const data = AuthInput.safeParse(req.body);

    if (!data.success) {
      return res.status(400).json({
        status: "failed",
        message: "Valid credentials are required",
      });
    }

    const { username, password } = data.data;

    const user = await prismaClient.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "User does not exist",
      });
    }

    // Retaining your existing password comparison.
    // Replace with bcrypt.compare when password hashing is implemented.
    if (user.password !== password) {
      return res.status(401).json({
        status: "failed",
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token,

      user: {
        id: user.id,
        username: user.username,
        mobile: user.mobile,
      },

      requiresMobileSetup: !user.mobile,
    });
  } catch (error) {
    console.error("Signin error:", error);

    return res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
});


app.get("/", (req, res) => {
  res.send("Hello from Express!");
});




app.get("/notifications", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized",
      });
    }

    const notifications = await prismaClient.notification.findMany({
      where: {
        incident: {
          website: {
            userId,
          },
        },
      },
      include: {
        incident: {
          include: {
            website: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
            region: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return res.status(200).json({
      status: "success",
      notifications,
    });
  } catch (error) {
    console.error("Notification fetch error:", error);

    return res.status(500).json({
      status: "failed",
      message: "Unable to fetch notifications",
    });
  }
});


app.get(
  "/websites/:websiteId/ticks",
  authMiddleware,
  async (req, res) => {
    try {
      const { websiteId } = req.params;
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          status: "failed",
          message: "Unauthorized",
        });
      }

      const range = req.query.range || "24h";

      const rangeInMs: Record<string, number> = {
        "24h": 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
      };

      if (
        typeof range !== "string" ||
        !rangeInMs[range]
      ) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid range. Use 24h or 7d.",
        });
      }

      const website = await prismaClient.website.findFirst({
        where: {
          id: websiteId,
          userId,
        },
        select: {
          id: true,
          name: true,
          url: true,
        },
      });

      if (!website) {
        return res.status(404).json({
          status: "failed",
          message: "Website not found",
        });
      }

      const from = new Date(Date.now() - rangeInMs[range]);

      const ticks = await prismaClient.websiteTick.findMany({
        where: {
          websiteId,
          createdAt: {
            gte: from,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return res.status(200).json({
        status: "success",
        website,
        range,
        from,
        to: new Date(),
        totalTicks: ticks.length,
        ticks,
      });
    } catch (error) {
      console.error("Historical tick error:", error);

      return res.status(500).json({
        status: "failed",
        message: "Unable to fetch website history",
      });
    }
  }
);


app.get(
  "/websites/:websiteId/incidents",
  authMiddleware,
  async (req, res) => {
    try {
      const { websiteId } = req.params;
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          status: "failed",
          message: "Unauthorized",
        });
      }

      const website = await prismaClient.website.findFirst({
        where: {
          id: websiteId,
          userId,
        },
      });

      if (!website) {
        return res.status(404).json({
          status: "failed",
          message: "Website not found",
        });
      }

      const incidents = await prismaClient.incident.findMany({
        where: {
          websiteId,
        },
        include: {
          region: true,
          notifications: true,
        },
        orderBy: {
          startedAt: "desc",
        },
      });

      return res.status(200).json({
        status: "success",
        totalIncidents: incidents.length,
        incidents,
      });
    } catch (error) {
      console.error("Incident fetch error:", error);

      return res.status(500).json({
        status: "failed",
        message: "Unable to fetch incidents",
      });
    }
  }
);

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT || 5000}`
  );
});