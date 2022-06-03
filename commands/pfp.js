const got = require("got");

module.exports = {
    name: "pfp",
    aliases: [],
    cooldown: 3000,
    description:"Grabs user's Twitch profile picture",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });

        const pfp = userData.logo;
        if (message.senderUsername == process.env.NUMBER_ONE) {
            client.privmsg(message.channelName, `.me ${message.senderUsername}, ${pfp} BatChest`)
        } else {
            return {
                text: `${message.senderUsername}, ${pfp} BatChest`,
            };
        }
    },
};