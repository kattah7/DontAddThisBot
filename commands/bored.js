const got = require("got");

module.exports = {
    name: "bored",
    aliases: [],
    cooldown: 3000,
    description:"Get stuff to do every 12 hours",
    execute: async (message, args) => {
        await bot.Redis.set(`cookie:${message.senderUsername}`, Date.now());
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://www.boredapi.com/api/activity?participants=1`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData)

        if (await bot.Redis.set(`cookie:${message.senderUsername}`, Date.now() < 12*60*60)) {
            return {
                text: `${targetUser}, ${userData.activity}`
            } 
        } else if (await bot.Redis.set(`cookie:${message.senderUsername}`, Date.now() > 12*60*60)) {
            return {
                text: `wait 12 hours`
            }
        }
    },
}