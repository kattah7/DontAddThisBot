module.exports = {
    tags: 'poro',
    name: 'leaderboard',
    cooldown: 5000,
    aliases: ['lb'],
    description: 'See leaderboard of poro meat',
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
        // sort porodata by highest poroprestige and poro rank
        const topUsers = poroData.sort((a, b) => b.poroPrestige - a.poroPrestige);

        const top5 = topUsers.slice(0, 5);
        const top5Text = top5
            .map(
                (user, index) =>
                    `${index == 0 ? `🥇` : index == 1 ? `🥈` : index == 2 ? `🥉` : ``} ${
                        user.username[0]
                    }\u{E0000}${user.username.slice(1)} - [P${user.poroPrestige}: ${
                        displayPoroRankByName[user.poroRank]
                    }] ${user.poroCount}`
            )
            .join(' | ');

        return {
            text: `${top5Text}`,
        };
    },
};
