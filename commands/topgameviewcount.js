const got = require("got");
const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "stats",
    aliases: [],
    cooldown: 3000,
    description:"check streamer rank in the past 30 days",
    execute: async (message, args) => {
        const targetChannel = args[0] ?? message.channelName
        let { body: userData, statusCode } = await got(`https://twitchtracker.com/api/channels/summary/${targetChannel.toLowerCase()}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData)

       return {
        text: `Data for ${targetChannel} in 30 Days, RANK: ${userData.rank} | Streamed: ${userData.minutes_streamed} minutes | Hours Watched: ${userData.hours_watched} Hours | AVG: ${userData.avg_viewers} PEAK: ${userData.max_viewers} Viewers`
       }
    },
};

