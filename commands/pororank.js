const utils = require("../util/utils.js");

module.exports = {
    name: "rank",
    cooldown: 10000,
    aliases: ["pororank"],
    description: "Check your rank in the poro leaderboard",
    poro: true,
    execute: async (message, args, client) => {
        const targetUser = await utils.ParseUser(args[0]?.toLowerCase() ?? message.senderUsername)

        const poroData = await bot.DB.poroCount.find({}).exec();

        const sorted = poroData.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount);

        const kekw = sorted.slice(0, 5000000);

        if (message.channelName == "forsen") {
            if (await utils.ForsenTV(args[0] || message.senderUsername)) {
                return {
                    text: `banned msg lol`
                }
            } else {
                if (kekw.findIndex((user) => user.username == targetUser) + 1 == 0) {
                return {
                    text: `${targetUser} not found in database PoroSad`
                } 
            }
            return {
                text: `${targetUser} is rank #${kekw.findIndex((user) => user.username == targetUser) + 1}/${kekw.length} in the poro leaderboard! kattahBoom`,
            }
        }
    }

        if (message.channelName == "nymn") {
            if (await utils.Nymn(args[0] || message.senderUsername)) {
                return {
                    text: `banned msg lol`
                }
            } else {
                if (kekw.findIndex((user) => user.username == targetUser) + 1 == 0) {
                    return {
                        text: `${targetUser} not found in database PoroSad`
                    } 
                }
                return {
                    text: `${targetUser} is rank #${kekw.findIndex((user) => user.username == targetUser) + 1}/${kekw.length} in the poro leaderboard! kattahBoom`,
                }
            }
        }

        if (message.channelName == message.channelName) {
            if (kekw.findIndex((user) => user.username == targetUser) + 1 == 0) {
                return {
                    text: `${targetUser} not found in database PoroSad`
                } 
            }
            return {
                text: `${targetUser} is rank #${kekw.findIndex((user) => user.username == targetUser) + 1}/${kekw.length} in the poro leaderboard! kattahBoom`,
            }
        }
    }
}