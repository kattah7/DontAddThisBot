module.exports = {
    name: "test",
    aliases: [],
    cooldown: 3000,
    level: 3,
    description: "Test command",
    execute: async (message, args, client) => {
        const channels = await bot.DB.channels.find({ isChannel: true }).exec();
        for (const channel of channels) {
            const channelData = await bot.DB.channels.findOne({ username: channel.username }).exec();
            if (!channelData.isChannel) {
                await bot.DB.channels.findOneAndUpdate({ username: channel.username }, { $set: { isChannel: true } }).exec();
            }
            console.log(channelData)
        }
    }
}