const got = require("got");
const humanizeDuration = require("../humanizeDuration");

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

    },
};
