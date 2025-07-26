// mongoose
import { createClient } from "redis";
import {prismaClient} from "store";

async function main() {
    let websites: {url: string, id: string}[] = prismaClient.website.find();

    const client = await createClient()
        .on("error", (err) => console.log("Redis Client Error", err))
        .connect();
    
    const res = await client.xAdd('betteruptime:website', '*', websites.map(website => ({
        url: website.url,
        id: website.id
    })))
    console.log(res);
    client.destroy()
}

setInterval(main, 3 * 60 * 1000)