const got = require("got");

module.exports = {
    name: "pfp",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });

        const pfp = userData.logo;
        return {
            text: `${message.senderUsername}, ${pfp} BatChest`,
        };
    },
};