const got = require("got");

module.exports = {  
    name: "log",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        const targetChannel = args[1] ?? message.channelName
        let { body: userData, statusCode } = await got(`https://api.mojang.com/users/profiles/minecraft/${targetUser}?at=0`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });

        const id = (userData.id)
        
        let { body: data } = await got(`https://api.mojang.com/user/profiles/${id}/names`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(data)
        

    }
};