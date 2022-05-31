const got = require("got");
const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "bored",
    aliases: [],
    cooldown: 3000,
    description: "Get stuff to do every 12 hours",
    execute: async (message, args) => {
        const lastUsage = await bot.Redis.get(`test:${message.senderUsername}`);
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`http://www.boredapi.com/api/activity?participants=1`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData);

        if (lastUsage) {
            if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 12) {
                const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 12;
                return {
                    text: `This command can only be used every 12hours. Please wait ${humanizeDuration(ms)}.`,
                };
            }
        }
        await bot.Redis.set(`test:${message.senderUsername}`, Date.now(), 0);
        return {
            text: `${targetUser}, ${userData.activity} `,
        };
    },
};