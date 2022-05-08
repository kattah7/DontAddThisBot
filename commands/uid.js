const got = require("got");

module.exports = {
    name: "uid",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData) 
        if (userData.banned == true) {
            return { text: `${targetUser} does not exist PoroSad` };
        }

        const uid = userData.id;
        return {
            text: `${message.senderUsername}, ${uid} BatChest`,
        };
    },
};