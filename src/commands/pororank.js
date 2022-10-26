const utils = require('../util/utils.js');

module.exports = {
    tags: 'poro',
    name: 'rank',
    cooldown: 5000,
    aliases: ['pororank'],
    description: 'Check your rank in the poro leaderboard',
    poro: true,
    execute: async (message, args, client) => {
        const targetUser = await utils.ParseUser(args[0]?.toLowerCase() ?? message.senderUsername);

        const poroData = await bot.DB.poroCount.find({}).exec();

        const sorted = poroData.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount);

        const totalSliced = sorted.slice(0, 5000000);

        if (!isNaN(args[0])) {
            //console.log(Number(args[0]) - 1, Number(args[0]))
            const nanRank = sorted.slice(Number(args[0]) - 1, Number(args[0]));
            if (!nanRank[0] || args[0].startsWith('-')) {
                return {
                    text: `Rank #${targetUser} not found in database PoroSad`,
                };
            }
            return {
                text: `${nanRank[0].username} is rank #${
                    kekw.findIndex((user) => user.username == nanRank[0].username) + 1
                }/${sorted.length} in the poro leaderboard! kattahBoom`,
            };
        }
        if (kekw.findIndex((user) => user.username == targetUser) + 1 == 0) {
            return {
                text: `${targetUser} not found in database PoroSad`,
            };
        }
        return {
            text: `${targetUser} is rank #${totalSliced.findIndex((user) => user.username == targetUser) + 1}/${
                totalSliced.length
            } in the poro leaderboard! kattahBoom`,
        };
    },
};
