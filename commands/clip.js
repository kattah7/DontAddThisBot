const got = require("got");

module.exports = {
    name: "topclip",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        const targetChannel = args[0] ?? message.channelName;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetChannel}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        const uid = userData.id;

        const { data } = await got(`https://api.twitch.tv/helix/clips?broadcaster_id=${uid}`, {
            headers: {
                "Client-ID": process.env.CLIENT_ID,
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
            },
        }).json();
        console.log(data)

        const clip = (data[0].url)
        const name = (data[0].broadcaster_name)
        const views = (data[0].view_count)
        const by = (data[0].creator_name)
            return {
                text: `${name}'s all time top clip with ${views} views by ${by} at ${(data[0].created_at.split("T")[0])} ${clip}`
            }
    },
};
