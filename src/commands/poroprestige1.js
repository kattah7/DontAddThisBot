module.exports = {
    tags: 'poro',
    name: 'prestige',
    cooldown: 5000,
    description: 'prestige with 10,000 poro meat',
    poro: true,
    poroRequire: true,
    execute: async (message, args, client) => {
        const channelData = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
        if (channelData.poroCount < 5000) {
            return {
                text: `Not enough poro meat! ${message.senderUsername} kattahHappy You need 5,000 poro meat :tf: | [P:${channelData.poroPrestige}] ${channelData.poroCount} meat total! 🥩`,
            };
        } else if (channelData.poroCount >= 5000) {
            await bot.DB.poroCount
                .updateOne({ id: message.senderUserID }, { $set: { poroCount: channelData.poroCount - 5000 } })
                .exec();
            await bot.DB.poroCount
                .updateOne({ id: message.senderUserID }, { $set: { poroPrestige: channelData.poroPrestige + 1 } })
                .exec();
            return {
                text: `${message.senderUsername}, PartyHat Congratulations! | [P:${channelData.poroPrestige + 1}] ${
                    channelData.poroCount - 5000
                } meat total! 🥩`,
            };
        }
    },
};
