

export default async (message: any, embeds: any) => {
    let that = {
        "id": process.env.discordid,
        "type": 0,
        "content": message || null,
        "channel_id": process.env.discordid,
        "author": {
            "bot": true,
            "id": process.env.discordid,
            "username": "database",
            "avatar": "76f63eb129f3c44321041be72c2fd8cc",
            "discriminator": "0000"
        }, 
        "attachments": [],
        "embeds": embeds ? embeds : [],
        "mentions": [],
        "mention_roles": [],
        "pinned": false,
        "mention_everyone": false,
        "tts": false,
        "timestamp": Date.now(),
        "edited_timestamp": null,
        "flags": 0,
        "components": [],
        "webhook_id": process.env.discordid
    }

   var real = await fetch(process.env['webhook'] as any, {
        method: "post",
        body: JSON.stringify(that),
        headers: {"Content-Type": "application/json"}
    })
}