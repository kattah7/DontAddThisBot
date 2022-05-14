const got = require("got");

module.exports = {
    name: "log",
    aliases: [],
    cooldown: 3000,
    description: "test command",
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://recent-messages.robotty.de/api/v2/recent-messages/kattah?limit=5`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData)
    }
};