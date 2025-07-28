import axios from "axios";
import { xAck, xReadGroup } from "redisStream";
import { prismaClient } from "store";

const WORKER_ID = process.env.WORKER_ID || "india-2";
const REGION_ID = process.env.REGION_ID || "india";

async function main() {

    while(1){
  try {
const response = await xReadGroup(REGION_ID, WORKER_ID);
    console.log("response ReadGroup from worker:", response);

    if (!response || response.length === 0) {
      console.log("No new messages");
      return;
    }

    await Promise.all(
      response.map(async ({ id, message }: any) => {
        try {
          const url: string = message?.url;
          const websiteId: string = message?.id;
          const startTime = Date.now();

          const status = await axios.get(url);
          const endTime = Date.now();

          await prismaClient.websiteTick.create({
            data: {
              responseTime: endTime - startTime,
              status: "UP",
              regionId: REGION_ID,
              websiteId: websiteId,
            },
          });

          console.log(`✅ Website ${status} is UP!`);
        } catch (err) {
          console.error("❌ Failed to reach website:", err);
        }
      })
    );

    await xAck(REGION_ID, response.map(({id})=>id));
  } catch (err) {
    console.error("❌ Error in main function:", err);
  }
}};

main();
