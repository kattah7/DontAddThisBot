module.exports = {
    name: "porocount",
    cooldown: 3000,
    description: "check poro count of user",
    execute: async(message, args) => {
        const targetUser = args[0] ?? message.senderUsername
        const channelData = await bot.DB.poroCount.findOne({ username: targetUser }).exec();
        
        if (!channelData) {
            return {
                text: `doesnt exist lol`
            }
        } else {
            return {
                text: `${targetUser} has total of ${channelData.poroCount} meat kattahXd | Registered: ${channelData.joinedAt}`
            }
        }
    }
}