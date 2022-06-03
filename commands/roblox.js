const got = require("got");

module.exports = {  
    name: "roblox",
    aliases: [],
    cooldown: 3000,
    description:"Gets basic information of your roblox account",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        const targetChannel = args[1] ?? message.channelName
        let { body: userData, statusCode } = await got(`https://api.roblox.com/users/get-by-username?username=${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData)
        const id = (userData.Id)
        const online = (userData.IsOnline)
        
        let { body: data } = await got(`https://users.roblox.com/v1/users/${id}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        

        const desc = (data.description)
        const age = (data.created)
        const display = (data.displayName)
        const banned = (data.isBanned)

        if (userData.success == false) {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me "${targetUser}" Not Found.`)
            } else {
                return {
                    text: `"${targetUser}" Not Found.`
                } 
            }
        } else {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me ${targetUser}'s Roblox display name is ${display}, Created ${(age.split("T")[0])}, Status: ${userData.IsOnline ? "Online ✅" : "Offline ❌"}, Banned: ${data.isBanned ? "TRUE ✅" : "False ❌"}`)
            } else {
                return {
                    text: `${targetUser}'s Roblox display name is ${display}, Created ${(age.split("T")[0])}, Status: ${userData.IsOnline ? "Online ✅" : "Offline ❌"}, Banned: ${data.isBanned ? "TRUE ✅" : "False ❌"}`
                } 
            }
        }
        
 }
};