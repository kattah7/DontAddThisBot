const got = require("got")

module.exports = {
    name: "stats",
    aliases: [],
    cooldown: 3000,
    description:"check streamer rank in the past 30 days",
    execute: async (message, args) => {
        const targetChannel = args[0] ?? message.channelName
        let { body: userData, statusCode } = await got(`https://twitchtracker.com/api/channels/summary/xqc`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        const myArr = JSON.parse(JSON.stringify(userData))

        console.log(myArr)

       return {
           text: `${myArr.rank}`
       }
    },
};