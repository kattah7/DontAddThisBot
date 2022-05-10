const got = require("got");

module.exports = {  
    name: "name",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        const targetChannel = args[1] ?? message.channelName
        let { body: userData, statusCode } = await got(`https://api.fuchsty.com/checkname/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData)
        
        const available = (userData.available)

        if (userData == 400) {
            return {
                text: `${targetUser} must start with an alphanumeric character.`
            }
        } else if (userData.available == false) {
            return {
                text: `"${targetUser}" username is not available. PoroSad`
            }
        } else if (userData.available == true) {
            return {
                text: `"${targetUser}" username is available. PogBones`
            }
        }
        

    }
};