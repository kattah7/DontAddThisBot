module.exports = {
    name: "porocount",
    cooldown: 3000,
    description: "check poro count of user",
    execute: async(message, args) => {
        const targetUser = args[0] ?? message.senderUsername
        const channelData = await bot.DB.poroCount.findOne({ username: targetUser }).exec();
        
        return {
            text: `${targetUser} has total of ${channelData.poroCount} | ${channelData.joinedAt}`
        }
    }
}