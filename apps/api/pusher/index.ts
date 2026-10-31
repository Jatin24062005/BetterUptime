import { xBulkAdd } from "redisStream";
import { prismaClient } from "store";
import express from "express"
const app = express();
const PORT = process.env.PORT || 3000;


type Website = {
  id: string,
  url: string
}

const main = async () => {
  console.log("Hello via Bun!");
  let websites = await prismaClient.website.findMany({
    select: {
      url: true,
      id: true,
    },
  });

  
  await xBulkAdd(websites);
  console.log(websites);
};

setInterval(() => {
  main();
},  60* 1000);

main();
