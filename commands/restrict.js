const got = require("got");

module.exports = {
    name: "test2",
    aliases: [],
    cooldown: 3000,
    description:"Gets the top clip of the channel",
    execute: async (message, args) => {
        const targetChannel = args[0] ?? message.channelName;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetChannel}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        const uid = userData.id;

        const { data } = await got(`https://api.twitch.tv/helix/schedule?broadcaster_id=${uid}`, {
            headers: {
                "Client-ID": process.env.CLIENT_ID,
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
            },
        }).json();
        console.log(data)

    },
};
