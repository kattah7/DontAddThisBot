const got = require("got");

module.exports = {  
    name: "name",
    aliases: [],
    cooldown: 3000,
    description:"Check available names on Twitch",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        const targetChannel = args[1] ?? message.channelName
        let { body: userData, statusCode } = await got(`https://api.fuchsty.com/checkname/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        
        const available = (userData.available)

        if (userData == 400) {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me ${targetUser} must start with an alphanumeric character.`)
            } else {
                return {
                    text: `${targetUser} must start with an alphanumeric character.`
                }
            }
        } else if (userData.available == false) {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me "${targetUser}" username is not available. PoroSad`)
            } else {
                return {
                    text: `"${targetUser}" username is not available. PoroSad`
                }
            }
        } else if (userData.available == true) {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me "${targetUser}" username is available. PogBones`)
            } else {
                return {
                    text: `"${targetUser}" username is available. PogBones`
                }
            }
        }
        

    }
};