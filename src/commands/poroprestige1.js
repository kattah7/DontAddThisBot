module.exports = {
    tags: 'poro',
    name: 'prestige',
    cooldown: 5000,
    aliases: [],
    description: 'prestige with 10,000 poro meat',
    poro: true,
    poroRequire: true,
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

        const { senderUserID, senderUsername } = message;
        const channelData = await bot.DB.poroCount.findOne({ id: senderUserID }).exec();
        const { poroCount, poroPrestige, poroRank } = channelData;
        if (poroCount < 5000 && poroRank != 7) {
            return {
                text: `Not enough poro meat! ${senderUsername} PoroSad You need ${(
                    5000 - poroCount
                ).toLocaleString()} poro meat or [Cooked] rank :tf: | [P${poroPrestige}: ${
                    displayPoroRankByName[poroRank]
                }] ${poroCount} meat total! 🥩`,
            };
        } else {
            if (poroCount >= 5000) {
                await bot.DB.poroCount
                    .updateOne(
                        { id: senderUserID },
                        { $set: { poroCount: poroCount - 5000, poroPrestige: poroPrestige + 1 } }
                    )
                    .exec();
                return {
                    text: `${senderUsername}, PartyHat Congratulations! | [P${poroPrestige + 1}: ${
                        displayPoroRankByName[poroRank]
                    }] ${poroCount - 5000} meat total! 🥩`,
                };
            } else if (poroRank == 7) {
                await bot.DB.poroCount
                    .updateOne({ id: senderUserID }, { $set: { poroRank: 1, poroPrestige: poroPrestige + 1 } })
                    .exec();
                return {
                    text: `${senderUsername}, PartyHat Congratulations! | [P${poroPrestige + 1}: ${
                        displayPoroRankByName[1]
                    }] ${poroCount} meat total! 🥩`,
                };
            }
        }
    },
};
