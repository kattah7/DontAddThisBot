const utils = require("../util/utils.js");

module.exports = {
    name: "test",
    cooldown: 3000,
    description: "Check 7tv emote info",
    level: 3,
    execute: async(message, args, client) => {
        const topTen = await utils.PoroNumberOne(message.senderUsername)
        if (topTen) {
            return {
                text: `${message.senderUsername} is number one!`
            }
        } else {
            return {
                text: `${message.senderUsername} is not number one!`
            }
        }
    }
}