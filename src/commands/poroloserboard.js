module.exports = {
    tags: 'poro',
    name: 'loserboard',
    cooldown: 5000,
    aliases: ['lb2'],
    description: 'See loserboard of poro meat',
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

        const { loserboards } = await bot.Redis.get('leaderboardEndpoint');
        const Sorted = loserboards.reverse().slice(0, 5);
        const SortedMapped = Sorted.map((user, index) => {
            const { username, poroCount, poroPrestige, poroRank } = user;
            const isTop3 = index == 0 ? `🥇` : index == 1 ? `🥈` : index == 2 ? `🥉` : ``;
            return `${isTop3} ${username[0]}\u{E0000}${username.slice(1)} - [P${poroPrestige}: ${
                displayPoroRankByName[poroRank]
            }] ${poroCount.toLocaleString()}`;
        });

        return {
            text: `kattahPoro Poro loserboard: ${SortedMapped.join(' | ')}`,
        };
    },
};
