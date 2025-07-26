import {createClient} from "redis";

async function main() {
    while(1) {
        const client = await createClient()
        .on("error", (err) => console.log("Redis Client Error", err))
        .connect();

        const res = await client.xReadGroup('usa', 'us-1', {
            key: 'betteruptime:website',
            id: '>'
        }, {
            COUNT: 2
        })

        if (!res) {
            return;
        }

        let websitesToTrack = res[0].messages;
        websitesToTrack.forEach(website => {
            let startTime = Date.now()
            axios.get(website.url)
                .then(() => {
                    prismaClient.WebsiteTick.create({
                        status: "GOOD",
                        response_time_ms: Date.now() - startTime,
                        region_id: "india",
                        website_id: website.id
                    })
                })
                .catch(() => {

                })
        })

    }
}

main();