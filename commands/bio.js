const got = require("got");

module.exports = {
    name: "bio",
    aliases: [],
    cooldown: 3000,
    description: "Check user's bio",
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });

        const bio = userData.bio;
        return {
            text: `${message.senderUsername}, ${bio} PogBones`,
        };
    },
};