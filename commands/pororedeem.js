const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "redeem",
    cooldown: 3000,
    execute: async(message, args, client) => {
        const lastUsage = await bot.Redis.get(`pororedeem:${message.senderUsername}`);
        const channelData = await bot.DB.poroCount.findOne({ username: message.senderUsername }).exec();
        const input = args[0]
        const availableBadges = ["kattah", "pokimane", "forsen"];

        if (lastUsage && channelData) {
            if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 999999999999999) {
                const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 999999999999999;
                return {
                    text: `You have already redeemed the code! ${humanizeDuration(ms)}`,
                };
            }
        } else if (!availableBadges.includes(input.toLowerCase())) {
            return {
                text: `Wrong code :p`
            }
        }

        await bot.DB.poroCount.updateOne({ username: message.senderUsername }, { $set: { poroCount: channelData.poroCount + 100 } } ).exec();
        await bot.Redis.set(`pororedeem:${message.senderUsername}`, Date.now(), 0);
        await client.say(message.channelName, `Code Redeemed! ${message.senderUsername} (+100) kattahDance2 total ${channelData.poroCount + 100} meat`)
        
    }
}