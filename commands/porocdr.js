const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "cdr",
    cooldown: 3000,
    description: "Reset poro timer every 3 hours",
    poro: true,
    execute: async(message, args, client) => {
        const lastUsage = await bot.Redis.get(`porocdr:${message.senderUsername}`);
        const channelData = await bot.DB.poroCount.findOne({ username: message.senderUsername }).exec();
        const random = Math.floor(Math.random() * 27) + -5;


        if (lastUsage && channelData) {
            if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 3) {
                const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 3;
                if (message.senderUsername == process.env.NUMBER_ONE) {
                    client.privmsg(message.channelName, `.me Please wait ${humanizeDuration(ms)} before doing another cooldown reset!`)
                    return
                } else {
                    return {
                        text: `Please wait ${humanizeDuration(ms)} before doing another cooldown reset!`,
                    };
                }
            }
        }
        await bot.DB.poroCount.updateOne({ username: message.senderUsername }, { $set: { poroCount: channelData.poroCount - 5 } } ).exec();
        await bot.Redis.set(`porocdr:${message.senderUsername}`, Date.now(), 0);
        await bot.Redis.del(`poro:${message.senderUsername}`); 
        await client.say(message.channelName, `Timer Reset! ${message.senderUsername} (-5) kattahDance total ${channelData.poroCount -5} meat`)
        
        
        
        
    }
}