const humanizeDuration = require("../util/humanizeDuration");
const got = require("got");
const utils = require("../util/utils.js");

module.exports = {
    name: "redeem",
    cooldown: 10000,
    description: "Redeem poro meat with speical codes",
    poro: true,
    execute: async(message, args, client) => {
        if (!args[0]) {
            if (message.senderUsername == await utils.PoroNumberOne()) {
                client.privmsg(message.channelName, `.me insert code lol`)
            } else {
                return {
                    text: `insert code lol`
                }
            }
        }
        const {banned, banphrase_data} = await got.post(`https://forsen.tv/api/v1/banphrases/test `, {json: {'message': message.senderUsername}}).json();
        console.log(banned, banphrase_data)
        const lastUsage = await bot.Redis.get(`pororedeem:${message.senderUserID}`);
        const channelData = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
        const input = args[0]
        const availableBadges = ["docL"];
        if (banned == false) {
            if (lastUsage) {
                if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 24) {
                    const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 24;
                    if (message.senderUsername == await utils.PoroNumberOne()) {
                        client.privmsg(message.channelName, `.me You have already redeemed the code! Come back in ${humanizeDuration(ms)} for daily codes`)
                        return
                    } else {
                        return {
                            text: `${message.senderUsername}, You have already redeemed the code! Come back in ${humanizeDuration(ms)} for daily codes`,
                        };
                    }
                }
            } 
             if (!availableBadges.includes(input)) {
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    client.privmsg(message.channelName, `.me ${message.senderUsername}, Wrong code :p`)
                    return
                } else {
                    return {
                        text: `${message.senderUsername}, Wrong code :p`
                    }
                }
            } 
                await bot.DB.poroCount.updateOne({ id: message.senderUserID }, { $set: { poroCount: channelData.poroCount + 50 } } ).exec();
                await bot.Redis.set(`pororedeem:${message.senderUserID}`, Date.now(), 0);
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    await client.privmsg(message.channelName, `.me Code Redeemed! ${message.senderUsername} (+50) kattahDance2 total [P:${channelData.poroPrestige}] ${channelData.poroCount + 50} meat`)
                    return
                } else {
                    await client.say(message.channelName, `Code Redeemed! ${message.senderUsername} (+50) kattahDance2 total [P:${channelData.poroPrestige}] ${channelData.poroCount + 50} meat`)
                return
                }
            
        } else if (banned == true) {
            return {
                text: `banned msg lol`
            }
        }
        
    }
}