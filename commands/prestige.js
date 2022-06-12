const got = require("got");

module.exports = {
    name: "prestige",  
    cooldown: 10000,
    description: "prestige with 10,000 poro meat",
    poro: true,
    execute: async(message, args, client) => {
        const {banned, banphrase_data} = await got.post(`https://forsen.tv/api/v1/banphrases/test `, {json: {'message': message.senderUsername}}).json();
        console.log(banned, banphrase_data)
        const channelData = await bot.DB.poroCount.findOne({ username: message.senderUsername }).exec();
        if (banned == false) {
        if (channelData.poroCount < 10000) { 
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me Not enough poro meat! ${message.senderUsername} kattahHappy You need 10,000 poro meat | [P:${channelData.poroPrestige}] ${channelData.poroCount} meat total! 🥩`)
            } else {
                return {
                    text: `Not enough poro meat! ${message.senderUsername} kattahHappy You need 10,000 poro meat :tf: | [P:${channelData.poroPrestige}] ${channelData.poroCount} meat total! 🥩`
                }
            }
        } else if (channelData.poroCount >= 10000) {
            await bot.DB.poroCount.updateOne({ username: message.senderUsername }, { $set: { poroCount: channelData.poroCount - 10000 } } ).exec();
            await bot.DB.poroCount.updateOne({ username: message.senderUsername }, { $set: { poroPrestige: channelData.poroPrestige + 1 } } ).exec();
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me ${message.senderUsername}, PartyHat Congratulations! | [P:${channelData.poroPrestige+1}] ${channelData.poroCount - 10000} meat total! 🥩`)
            } else {
                return {
                    text: `${message.senderUsername}, PartyHat Congratulations! | [P:${channelData.poroPrestige+1}] ${channelData.poroCount-10000} meat total! 🥩`
                } 
            }
        }
        } else if (banned == true) {
            return {
                text: `banned msg lol`
            }
        }
            
    }
}
