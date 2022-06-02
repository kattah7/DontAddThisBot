module.exports = {
    name: "poroonly",
    cooldown: 3000,
    description: "Make the bot only allow poro commands",
    level: 3,
    poro: true,
    execute: async(message, args, client) => {
        if (args[0] == 'enable') {
            await bot.DB.channels.updateOne({ username: message.channelName }, { $set: { poroOnly: true } }).exec(); 
            return {
                text: `Only poro commands are now available in ${message.channelName}`
            }
        } else if (args[0] == 'disable') {
            await bot.DB.channels.updateOne({ username: message.channelName }, { $set: { poroOnly: false } }).exec(); 
            return {
                text: `All commands are now available in ${message.channelName}`
            }
        }
        
    }
}