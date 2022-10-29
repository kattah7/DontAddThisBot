const humanizeDuration = require('../util/humanizeDuration');
const utils = require('../util/utils.js');
const discord = require('../util/discord.js');
const { randomInt } = require('crypto');

module.exports = {
    tags: 'poro',
    name: 'poro',
    cooldown: 5000,
    description: 'Get poro meat every 2 hour',
    poro: true,
    execute: async (message, args, client) => {
        const displayPoroRankByName = {
            1: 'Raw',
            2: 'Rare',
            3: 'Medium Rare',
            4: 'Medium',
            5: 'Medium Well',
            6: 'Well Done',
            7: 'Cooked',
        };

        const { senderUserID, senderUsername, channelName, messageText } = message;
        const lastUsage = await bot.Redis.get(`poro:${senderUserID}`);
        const channelData = await bot.DB.poroCount.findOne({ id: senderUserID }).exec();
        const random = randomInt(-5, 27);
        if (!channelData) {
            const newChannel = new bot.DB.poroCount({
                username: senderUsername,
                id: senderUserID,
                joinedAt: new Date(),
                poroCount: 10,
                poroPrestige: 0,
                poroRank: 1,
            });

            await newChannel.save();
            await bot.Redis.set(`poro:${senderUserID}`, Date.now(), 0);
            const Info = await utils.IVR(senderUserID);
            await discord.NewPoro(
                Info.createdAt.split('T')[0],
                senderUserID,
                senderUsername,
                channelName,
                messageText,
                Info.logo
            );

            return {
                text: `New user! ${senderUsername} kattahDance2 here is free 10 poro meat 🥩`,
            };
        }

        const { poroCount, poroPrestige, poroRank } = channelData;
        const totalPoros = `[P${poroPrestige}: ${
            displayPoroRankByName[poroRank]
        }] ${poroCount.toLocaleString()} meat total!`;
        if (lastUsage || channelData) {
            if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 2) {
                const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 2;
                return {
                    text: `No poros found... 🎇 kattahDespair ${senderUsername} | ${totalPoros} 🥩  | Come back later in ${humanizeDuration(
                        ms
                    )}. kattahDance`,
                };
            }
        }

        await bot.DB.poroCount.updateOne({ id: senderUserID }, { $set: { poroCount: poroCount + random } }).exec();
        const totalPorosWithRandom = `[P${poroPrestige}: ${displayPoroRankByName[poroRank]}] ${(
            poroCount + random
        ).toLocaleString()} meat total!`;
        await bot.Redis.set(`poro:${senderUserID}`, Date.now(), 0);

        if (random >= 5 && random <= 9) {
            return {
                text: `Poro slaughtered! ${senderUsername} --> Tenderloin Poro kattahStare (+${random}) kattahPoro ${totalPorosWithRandom}`,
            };
        } else if (random >= 10 && random <= 15) {
            return {
                text: `Poro slaughtered! ${senderUsername} --> Wagyu Poro 🤤 (+${random}) kattahPoro ${totalPorosWithRandom}`,
            };
        } else if (random <= -1 && random >= -5) {
            return {
                text: `Poro slaughtered! ${senderUsername} --> Rotten Poro DansGame (${random}) kattahBAT ${totalPorosWithRandom}`,
            };
        } else if (random >= 1 && random <= 4) {
            return {
                text: `Poro slaughtered! ${senderUsername} --> Sirloin Poro OpieOP (+${random}) kattahHappy ${totalPorosWithRandom}`,
            };
        } else if (random == 0) {
            return {
                text: `Poro gone! ${senderUsername} --> Poro ran away haHAA (±${random}) kattahDespair ${totalPorosWithRandom}`,
            };
        } else if (random >= 16) {
            return {
                text: `Poro slaughtered! ${senderUsername} --> LEGENDARY PORO VisLaud (+${random}) kattahXd ${totalPorosWithRandom}`,
            };
        }
    },
};
