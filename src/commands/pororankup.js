module.exports = {
    tags: 'poro',
    name: 'rankup',
    cooldown: 5000,
    aliases: ['pororankup'],
    description: 'Rank up with poros!',
    poroRequire: true,
    execute: async (message, args, client) => {
        const { senderUserID, senderUsername } = message;
        const userPoroCount = await bot.DB.poroCount.findOne({ id: senderUserID }).exec();
        const { poroCount, poroPrestige, poroRank } = userPoroCount;
        const poros = {
            1: 50, // raw
            2: 150, // rare
            3: 250, // medium rare
            4: 500, // medium
            5: 750, // medium well
            6: 1300, // well done
            7: 2000, // cooked
        };

        const displayPoroRankByName = {
            1: 'Raw',
            2: 'Rare',
            3: 'Medium Rare',
            4: 'Medium',
            5: 'Medium Well',
            6: 'Well Done',
            7: 'Cooked',
        };

        if (poroRank == 7) {
            return {
                text: `You are already at the highest rank, type prestige! ${senderUsername} kattahPoro`,
            };
        }

        if (poroCount < poros[poroRank + 1]) {
            return {
                text: `Not enough poro meat! ${senderUsername} kattahPoro You need ${
                    poros[poroRank + 1]
                } poro meat | [P${poroPrestige}: ${displayPoroRankByName[poroRank]}] ${poroCount} meat total! 🥩`,
            };
        } else {
            await bot.DB.poroCount
                .updateOne(
                    { id: senderUserID },
                    { $set: { poroCount: poroCount - poros[poroRank + 1], poroRank: poroRank + 1 } }
                )
                .exec();
            return {
                text: `You have ranked up to ${displayPoroRankByName[poroRank + 1]}! PoroSad [P${poroPrestige}: ${
                    displayPoroRankByName[poroRank + 1]
                }] ${poroCount - poros[poroRank + 1]} meat total! 🥩`,
            };
        }
    },
};
