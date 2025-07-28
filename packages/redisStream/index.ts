import { createClient } from "redis";

const client = await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

type Website = {
    id: string,
    url: string
}

const STREAM_NAME ="betteruptime:website"

const xAdd = async ({id, url}: Website) => {
    const res = await client.xAdd(STREAM_NAME, '*', {
        url: url,
        id: id
    })
    console.log(res);
}


export const xBulkAdd = async (websites: Website[]) => {
    if (websites.length === 0) return;
    for (let i = 0; i < websites.length; i++) {
        await xAdd(
            {
                id: websites[i]!.id,
                url: websites[i]!.url
            })
    }
}


export const xReadGroup = async (consumerGroup: string, worker: string) => {  
    const res = await client.xReadGroup( consumerGroup, worker, {
        key: STREAM_NAME,
        id: '>'
    },{
        COUNT: 1,
    })

    console.log(res);
   // @ts-ignore
    const messages: any[] = Array.isArray(res) && res[0]?.messages ? res[0].messages : [];
    return messages;
}

export const xAck = async (consumerGroup: string,id: string) => {
    const res = await client.xAck(STREAM_NAME, consumerGroup, id)
    console.log(res);
    return res;
}




