const fetch = require("../node_modules/node-fetch")

module.exports = {
    name: "stats",
    aliases: [],
    cooldown: 3000,
    description:"check streamer rank in the past 30 days",
    execute: async (message, args) => {
        const targetChannel = args[0] ?? message.channelName
        const response = await fetch('https://twitchtracker.com/api/channels/summary/xqc');
        const body = await response.json();

        console.log(body); 
        return {
            text: `${body.rank}`
        }

       
    },
};