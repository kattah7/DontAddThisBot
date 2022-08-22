const humanizeDuration = require("../humanizeDuration");
const utils = require("../util/utils.js");

module.exports = {
    name: "porocount",
    cooldown: 5000,
    aliases: ["poros"],
    description: "check poro count of user",
    poro: true,
    execute: async (message, args, client) => {
        const targetUser = await utils.ParseUser(args[0]?.toLowerCase() ?? message.senderUsername)
        const selfPoroData = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
        const poroData = await bot.DB.poroCount.findOne({ username: await utils.ParseUser(targetUser) }).exec();
        const xd = args[0] || selfPoroData
        if (!xd) {
            return {
                text: `You aren't registered PoroSad type |poro to get started!`
            }
        }
            var reg = /^[a-z0-9_#@,]+$/i;
            if (reg.test(args[0])) {
            if (!poroData) {
                return {
                    text: `${targetUser} not found in database PoroSad`
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
            return {
                text: `message too long or not valid`
            }
        }
    }   
}