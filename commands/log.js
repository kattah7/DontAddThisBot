const got = require("got");

module.exports = {
    name: "log",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;

        const { data } = await got(`https://supinic.com/api/test/auth`, {
            headers: {
                Authorization: `Basic 1878360:${process.env.SUPINIC_API_KEY}`,
            },
        }).json();
        console.log(data)
        let { body: userData, statusCode } = await got(`https://supinic.com/api/bot/afk/check/137199626`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        
    },
};