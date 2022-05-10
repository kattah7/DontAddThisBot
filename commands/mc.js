const got = require("got");

module.exports = {  
    name: "mc",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        const targetChannel = args[1] ?? message.channelName
        let { body: userData, statusCode } = await got(`https://api.mojang.com/users/profiles/minecraft/${targetUser}?at=0`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });

        const id = (userData.id)
        
        let { body: data } = await got(`https://api.ashcon.app/mojang/v2/user/${id}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(data)

        const firstname = (data.username_history[0].username)
        const undefined = (data.uuid)
        const accage = (data.created_at)
       
        if (undefined == 'f0369554-7707-486a-b230-8518f04102f7')  {
            return {
                text: `${targetUser}'s account does not exist. SSSsss`
            }
        } else if (accage == null) {
            return {
                text: `${targetUser}'s first Minecraft name is ${firstname} and could not fetch account age. PoroSad`
            }
        } else {
           return {
            text: `${targetUser}'s first Minecraft name is ${firstname} and created at ${accage} PunchTrees`
           }
        }
        

    }
};