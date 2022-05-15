const got = require("got");

module.exports = {
    name: "bored",
    aliases: [],
    cooldown: 3000,
    description:"Check if user is a verified bot",
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://www.boredapi.com/api/activity?participants=1`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData)

        return {
            text: `${targetUser}, ${userData.activity}`
        }
    },
}