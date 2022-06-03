const got = require("got");

module.exports = {
    name: "bot",
    aliases: [],
    cooldown: 3000,
    description:"Check if user is a verified bot",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData)

        const bot = userData.bot
        if (message.senderUsername == process.env.NUMBER_ONE) {
            return client.privmsg(message.channelName, `.me ${message.senderUsername}, BOT: ${bot} MrDestructoid`)
        } else {
            return {
                text: `${message.senderUsername}, BOT: ${bot} MrDestructoid`
            }
        }
    },
}