const got = require("got");

module.exports = {  
    name: "log",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        const targetChannel = args[1] ?? message.channelName
<<<<<<< HEAD
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
=======
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/emotes/${args[0]}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
>>>>>>> 6932fa7 (message)
        console.log(userData)
    }
};