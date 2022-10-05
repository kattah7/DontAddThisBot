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
        const top5Text = top5
            .map(
                (user, index) =>
                    `${index == 0 ? `🥇` : index == 1 ? `🥈` : index == 2 ? `🥉` : index == 3 ? `` : ``} ${
                        user.username
                    } - [P:${user.poroPrestige}] ${user.poroCount}`
            )
            .join(' | ');

        return {
            text: `${top5Text}`,
        };
    },
};
