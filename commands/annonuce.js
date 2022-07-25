const got = require('got')
const regex = require('../util/regex.js')

module.exports = {
    name: 'announce',
    description: 'annoucement in chat (Requires Mod)',
    cooldown: 3000,
    permission: 1,
    aliases: ['ann'],
    botPerms: 'mod',
    async execute(message, args) {
        if (args[0] == '.me') {
            return {
                text: `kekw`
            }
        }
        if (!regex.racism.test(args)) {
        const query = []
            query.push({
                "operationName": "SendAnnouncementMessage",
                "variables": {
                    "input": {
                        "channelID": `${message.channelID}`,
                        "message": `${args.join(" ")}`,
                        "color": "PRIMARY",
                    }
                },
                "extensions": {
                    "persistedQuery": {
                        "version": 1,
                        "sha256Hash": "f9e37b572ceaca1475d8d50805ae64d6eb388faf758556b2719f44d64e5ba791"
                    }
                }
            })

        got.post('https://gql.twitch.tv/gql', {
            throwHttpErrors: false,
            responseType: 'json',
            headers: {
                'Authorization': `OAuth ${process.env.TWITCH_GQL_OAUTH_KEKW}`,
                'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`,
            },
            json: query
        })
    } else {
        const XD = 'https://discord.com/api/webhooks/987735146297962497/Kvhez5MjG5Y-XiYQo9EUGbhiVd6UODyOf58WjkAZwRQMglOX_cpiW436mXZLLD8T7oFA'
        const msg2 = {
            embeds: [{
                color: 0x0099ff,
                title: `Sent by ${message.senderUsername}(UID:${message.senderUserID}) in #${message.channelName}`,
                author: {
                    name: 'racist detected',
                    icon_url: 'https://i.nuuls.com/g8l2r.png',
                },
                description: `${args.join(" ")}`,
                timestamp: new Date(),
                footer: {
                    text: 'Pulled time',
                    icon_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/89049925-b020-436f-bf9e-6262c0bc6419-profile_image-600x600.png ',
                }
            }]
        }
        fetch(XD + "?wait=true", 
        {"method":"POST", 
        "headers": {"content-type": "application/json"},
        "body": JSON.stringify(msg2)})
        .then(a=>a.json()).then(console.log)
        return {
            text: "That message violates the terms of service."
        }
    }
    },
};