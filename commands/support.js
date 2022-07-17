const utils = require("../util/utils.js");

module.exports = {
    name: "support",
    aliases: ["donate"],
    cooldown: 3000,
    description:"If you would like to help my monthly server cost TriHard",
    execute: async (message, args, client) => {
        if (message.senderUsername == await utils.PoroNumberOne()) {
            client.privmsg(message.channelName, `.me ${message.senderUsername}, https://ko-fi.com/kattah ☕ If you would like to help upkeep server cost for the bot :) <3 SUPPORTERS: @Fromo__ `)
        } else {
            return {
                text: `${message.senderUsername}, https://ko-fi.com/kattah ☕ If you would like to help upkeep server cost for the bot :) <3 SUPPORTERS: @Fromo__ `
            }
        }
        
    },
};