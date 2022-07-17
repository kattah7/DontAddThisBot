const got = require("got");
const utils = require("../util/utils.js");

module.exports = {
    name: "topclip",
    aliases: ["tc"],
    cooldown: 3000,
    description:"Gets the top clip of the channel",
    execute: async (message, args, client) => {
        const targetChannel = args[0] ?? message.channelName;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetChannel}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        const uid = userData.id;

        const { data } = await got(`https://api.twitch.tv/helix/clips?broadcaster_id=${uid}`, {
            headers: {
                "Client-ID": process.env.CLIENT_ID,
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
            },
        }).json();

        const clip = (data[0].url)
        const name = (data[0].broadcaster_name)
        const views = (data[0].view_count)
        const by = (data[0].creator_name)
        if (message.senderUsername == await utils.PoroNumberOne()) {
            return client.privmsg(message.channelName, `.me ${name}'s all time top clip with ${views} views by ${by} at ${(data[0].created_at.split("T")[0])} ${clip}`)
        } else {
            return {
                text: `${name}'s all time top clip with ${views} views by ${by} at ${(data[0].created_at.split("T")[0])} ${clip}`
            }
        }
    },
};
