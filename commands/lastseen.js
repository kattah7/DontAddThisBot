const got = require("got");
const utils = require("../util/utils.js");

module.exports = {  
    name: "lastseen",
    aliases: ["ls"],
    cooldown: 3000,
    description: "Check last seen of a user in a chat",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        const targetChannel = args[1] ?? message.channelName
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/logs/lastmessage/${targetChannel}/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        const lastseen = (userData.time) 
        if (message.senderUsername == await utils.PoroNumberOne()) {
            client.privmsg(message.channelName, `.me ${targetUser} was last seen ${lastseen} ago in ${targetChannel}.`)
        } else {
            return {
                text: `${targetUser} was last seen ${lastseen} ago in ${targetChannel}.`
            }
        }

    }
};