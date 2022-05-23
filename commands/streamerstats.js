const got = require("got")

module.exports = {
    name: "stats",
    aliases: [],
    cooldown: 3000,
    description:"check streamer rank in the past 30 days",
    execute: async (message, args) => {
        const targetChannel = args[0] ?? message.channelName
        const { body: pogger, statusCode2 } = await got.get(`https://twitchtracker.com/api/channels/summary/xqc`, {
            throwHttpErrors: false,
            responseType: 'json',
        })
        console.log(pogger)
        return {
            text: `${pogger.rank}`
        }
    },
};