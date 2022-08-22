const utils = require("../util/utils.js");

module.exports = {
    name: "poroshop",
    cooldown: 5000,
    description: "poro shop information to use poro meat",
    aliases: ["shop"],
    poro: true,
    execute: async(message, args, client) => {
        return {
            text: `${message.senderUsername}, kattahDance setcolor (50 🥩) | cdr (5 🥩) | change display name (50 🥩) | deactivate bot :tf: (1mill 🥩)`
        } 
    }
}