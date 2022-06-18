const got = require("got");
const humanizeDuration = require("../humanizeDuration");
const regex = require('../util/regex.js');

module.exports = {
    name: "uptime",
    aliases: [],
    cooldown: 3000,
    description:"Uptime of channel",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: data, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        
        const uid = data.login;
        const { data: data2, statusCode2 } = await got(`https://api.twitch.tv/helix/streams?user_login=${uid}`, {
            headers: {
                "Client-ID": process.env.CLIENT_ID,
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
            },
        }).json();

        let { body: userData, statusCode3 } = await got(`https://api.ivr.fi/v2/twitch/user?login=${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData)

        if (!regex.racism.test(data2[0].title)) {
        if (data2[0] == null) {
            const ms2 = new Date().getTime() - Date.parse(userData[0].lastBroadcast.startedAt)
            return {
                text: `${targetUser} has been offline for ${humanizeDuration(ms2)}, Title: ${userData[0].lastBroadcast.title}`
            }
        } else {
            const ms = new Date().getTime() - Date.parse(data2[0].started_at);
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me ${data2[0].user_name} went live ${humanizeDuration(ms)} ago, Playing ${data2[0].game_name} with ${data2[0].viewer_count} viewers. Title: ${data2[0].title}`)
            } else {
                return {
                    text: `${data2[0].user_name} went live ${humanizeDuration(ms)} ago, Playing ${data2[0].game_name} with ${data2[0].viewer_count} viewers. Title: ${data2[0].title}`
                }
            }
        }
    }
    else {
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
