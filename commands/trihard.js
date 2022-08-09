const utils = require('../util/utils.js');

module.exports = {
    name: "trihard",
    aliases: ["TriHard"],
    cooldown: 3000,
    description:"TriHard",
    execute: async (message, args, client) => {
        if (message.senderUsername == await utils.PoroNumberOne()) {
            client.privmsg(message.channelName, `.me ${message.senderUsername} TriHard 7`)
        } else {
            return {
                text: `${message.senderUsername} TriHard 7777`
            }
        }
        
    },
};
