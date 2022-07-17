const got = require("got");
const utils = require("../util/utils.js");

module.exports = {  
    name: "randomline",
    aliases: ["rl"],
    cooldown: 3000,
    description:"Fetches random message of a user in a channel that is logged on logs.ivr.fi",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        const targetChannel = args[1] ?? message.channelName
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/logs/rq/${targetChannel}/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData)

        const date = (userData.time)
        const randomline = (userData.message)
        if (userData.status == 404) {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                client.privmsg(message.channelName, `.me ${userData.error} FeelsDankMan or channel not logged.`)
            } else {
                return {
                    text: `${userData.error} FeelsDankMan or channel not logged.`
                }
            }
        }
        if (message.senderUsername == await utils.PoroNumberOne()) {
            client.privmsg(message.channelName, `.me ${targetUser} random logged message " ${randomline} " ${date} ago in ${targetChannel}`)
        } else {
            return {
                text: `${targetUser} random logged message " ${randomline} " ${date} ago in ${targetChannel}`
            }
        }
        

    }
};