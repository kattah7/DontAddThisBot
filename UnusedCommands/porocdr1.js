const humanizeDuration = require('../humanizeDuration');

module.exports = {
    name: 'cdr',
    cooldown: 5000,
    description: 'Reset poro timer every 3 hours',
    poro: true,
    execute: async (message, args, client) => {
        const lastUsage = await bot.Redis.get(`porocdr:${message.senderUserID}`);
        const channelData = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
                if (lastUsage && channelData) {
                    if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 3) {
                        const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 3;
                        return {
                            text: `Please wait ${humanizeDuration(
                                    ms
                                )} before doing another cooldown reset! kattahDespair`,
                        };
                    }
                }
                await bot.DB.poroCount
                    .updateOne({ id: message.senderUserID }, { $set: { poroCount: channelData.poroCount - 5 } })
                    .exec();
                await bot.Redis.set(`porocdr:${message.senderUserID}`, Date.now(), 0);
                await bot.Redis.del(`poro:${message.senderUserID}`);
                await client.say(
                        message.channelName,
                        `Timer Reset! ${message.senderUsername} (-5) kattahDance total [P:${
                            channelData.poroPrestige
                        }] ${channelData.poroCount - 5} meat`
                );
    },
};
