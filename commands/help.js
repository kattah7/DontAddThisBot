const got = require("got");
const utils = require("../util/utils.js");

module.exports = {
    name: "help",
    cooldown: 10000,
    poro: true,
    description: 'Bot help',
    execute: async(message, args, client) => {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                return client.privmsg(message.channelName, `.me Check the bot's panels for more info kattahHappy`)
            } else {
                return {
                    text: `Check the bot's panels for more info kattahHappy`
                }
            }
    }
}