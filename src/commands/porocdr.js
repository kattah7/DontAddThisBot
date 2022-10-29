const humanizeDuration = require('../util/humanizeDuration');

module.exports = {
    tags: 'poro',
    name: 'cdr',
    description: 'cooldown reset timer',
    cooldown: 3000,
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
        const lastUsage = await bot.Redis.get(`porocdr:${senderUserID}`);
        const channelData = await bot.DB.poroCount.findOne({ id: senderUserID }).exec();
        const { poroCount, poroPrestige, poroRank } = channelData;
        if (lastUsage && channelData) {
            if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 3) {
                const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 3;
                return {
                    text: `Please wait ${humanizeDuration(ms)} before doing another cooldown reset! kattahDanceButFast`,
                };
            }
        }
        await bot.DB.poroCount.updateOne({ id: senderUserID }, { $set: { poroCount: poroCount - 5 } }).exec();
        // -5 poros if user types cdr
        await bot.Redis.set(`porocdr:${senderUserID}`, Date.now(), 0);
        // resets porocdr redis timer
        await bot.Redis.del(`poro:${senderUserID}`);
        // deletes the timer for poro redis timer
        return {
            text: `Timer Reset! ${senderUsername} (-5) kattahPoro total [P${poroPrestige}: ${
                displayPoroRankByName[poroRank]
            }] ${poroCount - 5} meat`,
        };
    },
};
