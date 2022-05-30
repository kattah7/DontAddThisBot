module.exports = {
    name: "porocount",
    cooldown: 3000,
    description: "check poro count of user",
    execute: async(message, args) => {
        const channelData = await bot.DB.poroCount.findOne({ username: message.senderUsername }).exec();
        const channelData2 = await bot.DB.joinedAt.findOne({ username: message.senderUsername }).exec();
        
        return {
            text: `You have total of ${channelData.poroCount} | ${channelData2.joinedAt}`
        }
    }
}