module.exports = {
    tags: 'poro',
    name: 'loserboard',
    cooldown: 5000,
    aliases: ['lb2'],
    description: 'See loserboard of poro meat',
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

        const poroData = await bot.DB.poroCount.find({}).exec();
        const allUserLength = Number(poroData.length);
        const sorted = poroData.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroRank - a.poroRank);

        const top5 = sorted.slice(allUserLength - 5, allUserLength);
        const top5String = top5
            .map(
                (user) =>
                    `${user.username} - [P${user.poroPrestige}: ${
                        displayPoroRankByName[user.poroRank]
                    }] ${user.poroCount.toLocaleString()} `
            )
            .join(' | ');

        return {
            text: `kattahBAT Poro loserboard: ${top5String}`,
        };
    },
};
