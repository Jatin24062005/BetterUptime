import { xBulkAdd } from "redisStream";
import { prismaClient } from "store";

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
}, 3 * 1000);

main();
