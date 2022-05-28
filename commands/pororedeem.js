const got = require("got")

module.exports = {
    name: "redeem",
    cooldown: 3000,
    execute: async(message, args, client) => {
        const lastUsage = await bot.Redis.get(`pororedeem:${message.senderUsername}`);
        const channelData = await bot.DB.poroCount.findOne({ username: message.senderUsername }).exec();
        const input = args[0]
        const availableBadges = ["kattah", "pokimane", "forsen"];

        if (lastUsage) {
            if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 3) {
                const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 3;
                return {
                    text: `You have already redeemed the code!`,
                };
            }
        } else if (availableBadges.includes(input.toLowerCase())) {
            return {
                text: `Wrong code :p`
            }
        }
        await bot.DB.poroCount.updateOne({ username: message.senderUsername }, { $set: { poroCount: channelData.poroCount - 5 } } ).exec();
        await client.say(message.channelName, `Code Redeemed! ${message.senderUsername} (+100) kattahDance2 total ${channelData.poroCount + 100} meat`)
    }
}