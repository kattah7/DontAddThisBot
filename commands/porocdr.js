const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "cdr",
    cooldown: 3000,
    description: "Get poro meat every 2 hour",
    execute: async(message, args, client) => {
        const lastUsage = await bot.Redis.get(`porocdr:${message.senderUsername}`);
        const channelData = await bot.DB.poroCount.findOne({ username: message.senderUsername }).exec();
        const random = Math.floor(Math.random() * 27) + -5;


        if (lastUsage || channelData) {
            if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 3) {
                const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 3;
                return {
                    text: `Please wait ${humanizeDuration(ms)} before doing another cooldown reset!`,
                };
            }
        }
        await bot.DB.poroCount.updateOne({ username: message.senderUsername }, { $set: { poroCount: channelData.poroCount - 5 } } ).exec();
        await bot.Redis.set(`porocdr:${message.senderUsername}`, Date.now(), 0);
        await client.say(message.channelName, `Timer Reset! (-5) kattahDance total ${channelData.poroCount -5} meat`)


        await bot.DB.poroCount.updateOne({ username: message.senderUsername }, { $set: { poroCount: channelData.poroCount -5 + random } } ).exec();

        await bot.Redis.set(`poro:${message.senderUsername}`, Date.now(), 0);
        console.log(random)
        if (random == 5 || random == 6 || random == 7 || random == 8 || random == 9) {
            return {
                text: `Poro slaughtered! ${message.senderUsername} --> Tenderloin Poro kattahStare (+${random}) PoroSad ${channelData.poroCount -5 + random} meat total!`,
            };
        } else if (random == 10 || random == 11 || random == 12 || random == 13 || random == 14 || random == 15) {
            return {
                text: `Poro slaughtered! ${message.senderUsername} --> Wagyu Poro 🤤 (+${random}) kattahHappy ${channelData.poroCount -5 + random} meat total!`
            }
        } else if (random == -1 || random == -2 || random == -3 || random == -4 || random == -5) {
            return {
                text: `Poro slaughtered! ${message.senderUsername} --> Rotten Poro DansGame (${random}) kattahBAT ${channelData.poroCount -5 + random} meat total!`
            }
        } else if (random == 1 || random == 2 || random == 3 || random == 4) {
            return {
                text: `Poro slaughtered! ${message.senderUsername} --> Sirloin Poro OpieOP (+${random}) PoroSad ${channelData.poroCount -5 + random} meat total!`
            }
        } else if (random == 0) {
            return {
                text: `Poro slaughtered! ${message.senderUsername} --> Poro ran away haHAA (±${random}) kattahHappy ${channelData.poroCount -5 + random} meat total!`
            }
        } else if (random >= 16) {
            return {
                text: `Poro slaughtered! ${message.senderUsername} --> LEGENDARY PORO VisLaud (+${random}) PoroSad ${channelData.poroCount -5 + random} meat total!`
            }
        }
        
    }
}