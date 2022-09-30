const humanizeDuration = require('../util/humanizeDuration');

module.exports = {
    tags: 'poro',
    name: 'cdr',
    description: 'cooldown reset timer',
    cooldown: 3000,
    poro: true,
    poroRequire: true,
    execute: async (message, args, client) => {
        const lastUsage = await bot.Redis.get(`porocdr:${message.senderUserID}`);
        const channelData = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
        if (lastUsage && channelData) {
            if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 3) {
                const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 3;
                return {
                    text: `Please wait ${humanizeDuration(ms)} before doing another cooldown reset! kattahDanceButFast`,
                };
            }
        }
        await bot.DB.poroCount
            .updateOne({ id: message.senderUserID }, { $set: { poroCount: channelData.poroCount - 5 } })
            .exec();
        // -5 poros if user types cdr
        await bot.Redis.set(`porocdr:${message.senderUserID}`, Date.now(), 0);
        // resets porocdr redis timer
        await bot.Redis.del(`poro:${message.senderUserID}`);
        // deletes the timer for poro redis timer
        return {
            text: `Timer Reset! ${message.senderUsername} (-5) kattahDanceButFast total [P:${
                channelData.poroPrestige
            }] ${channelData.poroCount - 5} meat`,
        };
    },
};
