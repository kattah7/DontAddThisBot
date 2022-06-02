const { isObjectIdOrHexString } = require("mongoose");

module.exports = {
    name: `changecolor`,
    cooldown: 3000,
    aliases: ["changecolour", "setcolor", "setcolour"],
    description: 'Change the bot color with 50 poro meat',
    poro: true,
    execute: async(message, args, client) => {
        var reg=/^#[0-9A-F]{6}$/i;
        const channelData = await bot.DB.poroCount.findOne({ username: message.senderUsername }).exec();
        if (channelData.poroCount < 50) {
            return {
                text: `Not enough poro meat! ${message.senderUsername} kattahHappy You need 50 poro meat | ${channelData.poroCount} meat total! 🥩`
            }
        } else if (!reg.test(args[0])) {
            return {
                text: `Invalid color, please use hex color code with # kattahDance`
            }
            
        } else {
            await bot.DB.poroCount.updateOne({ username: message.senderUsername }, { $set: { poroCount: channelData.poroCount - 50 } } ).exec();
            client.privmsg(message.channelName, `.color ${args[0]}`);
            return {
                text: `Color changed! PoroSad ${channelData.poroCount - 50} meat total! 🥩`
            }
        }

    }
}