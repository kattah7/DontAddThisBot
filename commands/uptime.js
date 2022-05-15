const got = require("got");
const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "uptime",
    aliases: [],
    cooldown: 3000,
    description:"Uptime of channel",
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: data, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(data)
        
        const uid = data.login;
        const { data: data2, statusCode2 } = await got(`https://api.twitch.tv/helix/streams?user_login=${uid}`, {
            headers: {
                "Client-ID": process.env.CLIENT_ID,
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
            },
        }).json();

        console.log(data2)
        if (data2[0] == null) {
            return {
                text: `${targetUser} is currently not live.`
            }
        } else {
            const ms = new Date().getTime() - Date.parse(data2[0].started_at.split("T")[0]);
        return {
            text: `${data2[0].user_name} went live ${humanizeDuration(ms)} ago, Playing ${data2[0].game_name} with ${data2[0].viewer_count} viewers. Title: ${data2[0].title}`
        }
        }

    },
};
