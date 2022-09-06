const humanizeDuration = require("../util/humanizeDuration");
const got = require("got");
const utils = require("../util/utils.js");

module.exports = {
    name: "porocount",
    cooldown: 10000,
    aliases: ["poros"],
    description: "check poro count of user",
    poro: true,
    execute: async(message, args, client) => {
        const targetUser = args[0]?.toLowerCase() ?? message.senderUsername
        const selfPoroData = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
        const poroData = await bot.DB.poroCount.findOne({ username: await utils.ParseUser(targetUser) }).exec();
        const xd = args[0] || selfPoroData
        if (!xd) {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                client.privmsg(message.channelName, `.me You aren't registered PoroSad type |poro to get started!`)
            } else {
                return {
                    text: `You aren't registered PoroSad type |poro to get started!`
                }
            }
        }
        const {banned, banphrase_data} = await got.post(`https://forsen.tv/api/v1/banphrases/test `, {json: {'message': targetUser }}).json();
        //console.log(banned, banphrase_data)
        if (banned == true) {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                client.privmsg(message.channelName, `.me Ban phrase ${banphrase_data.id} detected.`)
            } else {
                return {
                    text: `Ban phrase ${banphrase_data.id} detected.`
                }
            }
        } else {
            var reg = /^[a-z0-9_#@,]+$/i;
            if (reg.test(args[0])) {
            if (!poroData) {
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    client.privmsg(message.channelName, `.me ${targetUser} not found in database PoroSad`)
                } else {
                    return {
                        text: `${targetUser} not found in database PoroSad`
                    }
                }
            }
            var today = new Date()
            const timestamp = new Date(poroData.joinedAt)
            const diffTime = Math.abs(today - timestamp)
            const register = humanizeDuration(diffTime)
            return {
                text: `${targetUser} has ${poroData.poroCount} poro(s) and ${poroData.poroPrestige} prestige. kattahHappy Registered (${register})`
            }
            //console.log(poroData.poroCount)
        } else {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                client.privmsg(message.channelName, `.me message too long or not valid`)
            } else {
                return {
                    text: `message too long or not valid`
                }
            }
        }
    }
        
    }
}