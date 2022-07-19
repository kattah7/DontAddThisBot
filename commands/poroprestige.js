const utils = require("../util/utils.js");

module.exports = {
    name: "prestige",  
    cooldown: 10000,
    description: "prestige with 10,000 poro meat",
    poro: true,
    execute: async (message, args, client) => {
        const channelData = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
        if (message.channelName == "forsen") {
            if (await utils.ForsenTV(message.senderUsername)) {
                return {
                    text: `banned msg lol`
                }
            } else {
                if (channelData.poroCount < 5000) { 
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me Not enough poro meat! ${message.senderUsername} kattahHappy You need 5,000 poro meat | [P:${channelData.poroPrestige}] ${channelData.poroCount} meat total! 🥩`)
                    } else {
                        return {
                            text: `Not enough poro meat! ${message.senderUsername} kattahHappy You need 5,000 poro meat :tf: | [P:${channelData.poroPrestige}] ${channelData.poroCount} meat total! 🥩`
                        }
                    }
                } else if (channelData.poroCount >= 5000) {
                    await bot.DB.poroCount.updateOne({ id: message.senderUserID }, { $set: { poroCount: channelData.poroCount - 5000 } } ).exec();
                    await bot.DB.poroCount.updateOne({ id: message.senderUserID }, { $set: { poroPrestige: channelData.poroPrestige + 1 } } ).exec();
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me ${message.senderUsername}, PartyHat Congratulations! | [P:${channelData.poroPrestige+1}] ${channelData.poroCount - 5000} meat total! 🥩`)
                    } else {
                        return {
                            text: `${message.senderUsername}, PartyHat Congratulations! | [P:${channelData.poroPrestige+1}] ${channelData.poroCount-5000} meat total! 🥩`
                        } 
                    }
                }
            }
        }

        if (message.channelName == "nymn") {
            if (await utils.Nymn(message.senderUsername)) {
                return {
                    text: `banned msg lol`
                }
            } else {
                if (channelData.poroCount < 5000) { 
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me Not enough poro meat! ${message.senderUsername} kattahHappy You need 5,000 poro meat | [P:${channelData.poroPrestige}] ${channelData.poroCount} meat total! 🥩`)
                    } else {
                        return {
                            text: `Not enough poro meat! ${message.senderUsername} kattahHappy You need 5,000 poro meat :tf: | [P:${channelData.poroPrestige}] ${channelData.poroCount} meat total! 🥩`
                        }
                    }
                } else if (channelData.poroCount >= 5000) {
                    await bot.DB.poroCount.updateOne({ id: message.senderUserID }, { $set: { poroCount: channelData.poroCount - 5000 } } ).exec();
                    await bot.DB.poroCount.updateOne({ id: message.senderUserID }, { $set: { poroPrestige: channelData.poroPrestige + 1 } } ).exec();
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me ${message.senderUsername}, PartyHat Congratulations! | [P:${channelData.poroPrestige+1}] ${channelData.poroCount - 5000} meat total! 🥩`)
                    } else {
                        return {
                            text: `${message.senderUsername}, PartyHat Congratulations! | [P:${channelData.poroPrestige+1}] ${channelData.poroCount-5000} meat total! 🥩`
                        } 
                    }
                }
            }
        }

        if (message.channelName == message.channelName) {
            if (channelData.poroCount < 5000) { 
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    client.privmsg(message.channelName, `.me Not enough poro meat! ${message.senderUsername} kattahHappy You need 5,000 poro meat | [P:${channelData.poroPrestige}] ${channelData.poroCount} meat total! 🥩`)
                } else {
                    return {
                        text: `Not enough poro meat! ${message.senderUsername} kattahHappy You need 5,000 poro meat :tf: | [P:${channelData.poroPrestige}] ${channelData.poroCount} meat total! 🥩`
                    }
                }
            } else if (channelData.poroCount >= 5000) {
                await bot.DB.poroCount.updateOne({ id: message.senderUserID }, { $set: { poroCount: channelData.poroCount - 5000 } } ).exec();
                await bot.DB.poroCount.updateOne({ id: message.senderUserID }, { $set: { poroPrestige: channelData.poroPrestige + 1 } } ).exec();
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    client.privmsg(message.channelName, `.me ${message.senderUsername}, PartyHat Congratulations! | [P:${channelData.poroPrestige+1}] ${channelData.poroCount - 5000} meat total! 🥩`)
                } else {
                    return {
                        text: `${message.senderUsername}, PartyHat Congratulations! | [P:${channelData.poroPrestige+1}] ${channelData.poroCount-5000} meat total! 🥩`
                    } 
                }
            }
        }
    }
}