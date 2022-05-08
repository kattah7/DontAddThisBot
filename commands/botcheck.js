const got = require("got");

module.exports = {
    name: "bot",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData)

        const bot = userData.bot
        return {
            text: `${message.senderUsername}, BOT: ${bot} MrDestructoid`
        }
    },
}