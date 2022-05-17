const got = require("got");

module.exports = {
    name: "color",
    aliases: [],
    cooldown: 3000,
    description:"Gets user's chat color",
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData)
        const color = userData.chatColor;

        if (color == null) {
            return {
                text: `${message.senderUsername}, ${targetUser} has never changed their name color WutFace`
            }
        } else {
            return {
                text: `${message.senderUsername}, ${color} KappaPride`
            }
        }
    },
};