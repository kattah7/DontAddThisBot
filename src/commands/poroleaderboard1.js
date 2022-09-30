module.exports = {
    tags: 'poro',
    name: 'leaderboard',
    cooldown: 5000,
    aliases: ['lb'],
    description: 'See leaderboard of poro meat',
    poro: true,
    execute: async (message, args, client) => {
        const poroData = await bot.DB.poroCount.find({}).exec();

        const sorted = poroData.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount);

        const top5 = sorted.slice(0, 5);
        const top5String = top5
            .map((user) => `${user.username} - [P:${user.poroPrestige}] ${user.poroCount.toLocaleString()} `)
            .join(' | ');

        return {
            text: `kattahXd Poro leaderboard: ${top5String}`,
        };
    },
};
