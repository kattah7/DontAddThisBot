module.exports = {
    name: "offlineonly",
    cooldown: 3000,
    description: "Make the bot only type when channel is offline",
    level: 3,
    poro: true,
    offline: true,
    execute: async(message, args, client) => {
        if (args[0] == 'enable') {
            await bot.DB.channels.updateOne({ username: message.channelName }, { $set: { offlineOnly: true } }).exec(); 
            return {
                text: `Commands are now only available only when ${message.channelName} is offline`
            }
        } else if (args[0] == 'disable') {
            await bot.DB.channels.updateOne({ username: message.channelName }, { $set: { offlineOnly: false } }).exec(); 
            return {
                text: `All commands are now available in ${message.channelName}`
            }
        }
        
    }
}