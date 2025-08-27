import axios from "axios";
import { xAck, xReadGroup } from "redisStream";
import { prismaClient } from "store";
import { WebsiteStatus } from "store/generated/prisma/client";

const WORKER_ID = process.env.WORKER_ID || "india-2";
const REGION_ID = process.env.REGION_ID || "2005";



async function main() {

    while(1){
  try {
   const response = await xReadGroup(REGION_ID, WORKER_ID);
    console.log("response ReadGroup from worker:", response);

   
    await Promise.all(
      response.map(async ({ id, message }: any) => {
        try {
          const url: string = message?.url;
          const websiteId: string = message?.id;
          const startTime = Date.now();

          const status = await axios.get(url);
          const endTime = Date.now();




          await prismaClient.region.upsert({
            where: { id: REGION_ID },
            update: {},
            create: { id: REGION_ID, name: "us" },
          });


        
              const prismares =   await prismaClient.websiteTick.create({
            data: {
              responseTime: endTime - startTime,
              status: WebsiteStatus.UP,
              regionId: REGION_ID,
              websiteId: websiteId,
            },
          });

     
          

          console.log(`✅ Website  is UP!`,prismares);

        } catch (err: any) {
          if (err instanceof Error) {
            console.error("❌ Website processing error:", {
              message: err.message,
              stack: err.stack,
              prismaError: err,
            });
          } else {
            console.error("❌ Non-standard error:", err);
          }
        }
        
      })
    );

    // Acknowledge each message individually
    for (let { id } of response) {

      await xAck(REGION_ID.toString(), id.toString() );
    }



  } catch (err) {
    console.error("❌ Error in main function:", err);
  }
  await new Promise((resolve) => setTimeout(resolve, 3000));

}
};

main();
