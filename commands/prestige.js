const got = require("got");

module.exports = {
    name: "prestige",  
    cooldown: 10000,
    description: "prestige information to use poro meat",
    poro: true,
    execute: async(message, args, client) => {
        const channelData = await bot.DB.poroCount.findOne({ username: message.senderUsername }).exec();
        if (channelData.poroCount < 10000) { 
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me Not enough poro meat! ${message.senderUsername} kattahHappy You need 10,000 poro meat | ${channelData.poroCount} meat total! 🥩`)
            }
            return {
                text: `Not enough poro meat! ${message.senderUsername} kattahHappy You need 10000 poro meat | ${channelData.poroCount} meat total! 🥩`
            }
        } else if (channelData.poroCount >= 10000) {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me ${message.senderUsername}, prestige | ${channelData.poroCount}`)
            } else {
                return {
                    text: `${message.senderUsername}, prestige | ${channelData.poroCount}`
                } 
            }
        }
            
    }
}
