const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "poro",
    cooldown: 3000,
    description: "Get poro meat every 1 hour",
    execute: async(message, args) => {
        const lastUsage = await bot.Redis.get(`poro:${message.senderUsername}`);
        const channelData = await bot.DB.poroCount.findOne({ username: message.senderUsername }).exec();
        const random = Math.floor(Math.random() * 27) + -5;

        if (!channelData) {
            const newChannel = new bot.DB.poroCount({
                username: message.senderUsername,
                id: message.senderUserID,
                joinedAt: new Date(),
                poroCount: 10,
            });
            
            await newChannel.save();
            await bot.Redis.set(`poro:${message.senderUsername}`, Date.now(), 0);

            return {
                text: `New user! ${message.senderUsername} PoroSad here is free 10 poro meat 🥩`
            }
        }

        if (lastUsage || channelData) {
            if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 1) {
                const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 1;
                return {
                    text: `No poros found... 🌉 PoroSad ${message.senderUsername} | ${channelData.poroCount} meat total! 🥩  | Come back later in ${humanizeDuration(ms)}.`,
                };
            }
        }

        await bot.DB.poroCount.updateOne({ username: message.senderUsername }, { $set: { poroCount: channelData.poroCount + random } } ).exec();

        await bot.Redis.set(`poro:${message.senderUsername}`, Date.now(), 0);
        console.log(random)
        if (random == 5 || random == 6 || random == 7 || random == 8 || random == 9) {
            return {
                text: `Poro slaughtered! ${message.senderUsername} --> Tenderloin Poro FBChallenge (+${random}) PoroSad ${channelData.poroCount + random} meat total!`,
            };
        } else if (random == 10 || random == 11 || random == 12 || random == 13 || random == 14 || random == 15) {
            return {
                text: `Poro slaughtered! ${message.senderUsername} --> Wagyu Poro 🤤 (+${random}) kattahHappy ${channelData.poroCount + random} meat total!`
            }
        } else if (random == -1 || random == -2 || random == -3 || random == -4 || random == -5) {
            return {
                text: `Poro slaughtered! ${message.senderUsername} --> Rotten Poro DansGame (${random}) kattahBAT ${channelData.poroCount + random} meat total!`
            }
        } else if (random == 1 || random == 2 || random == 3 || random == 4) {
            return {
                text: `Poro slaughtered! ${message.senderUsername} --> Sirloin Poro OpieOP (+${random}) PoroSad ${channelData.poroCount + random} meat total!`
            }
        } else if (random == 0) {
            return {
                text: `Poro slaughtered! ${message.senderUsername} --> Poro ran away haHAA (±${random}) kattahHappy ${channelData.poroCount + random} meat total!`
            }
        } else if (random >= 16) {
            return {
                text: `Poro slaughtered! ${message.senderUsername} --> LEGENDARY PORO VisLaud (+${random}) PoroSad ${channelData.poroCount + random} meat total!`
            }
        }
    }
}