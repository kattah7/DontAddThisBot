module.exports = {
    name: "porocount",
    cooldown: 10000,
    description: "check poro count of user",
    poro: true,
    execute: async(message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername
        const channelData = await bot.DB.poroCount.findOne({ username: targetUser }).exec();
        
        if (!channelData) {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me ${targetUser} isnt registered lol`)
            } else {
                return {
                    text: `${targetUser} isnt registered lol`
                }
            }
        } else {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me ${targetUser} has total of ${channelData.poroCount} meat kattahXd | Registered: ${channelData.joinedAt}`)
            } else {
                return {
                    text: `${targetUser} has total of ${channelData.poroCount} meat kattahXd | Registered: ${channelData.joinedAt}`
                }
            }
        }
    }
}