module.exports = {
    tags: 'poro',
    name: 'prestige',
    cooldown: 5000,
    description: 'prestige with 10,000 poro meat',
    poro: true,
    poroRequire: true,
    execute: async (message, args, client) => {
        const { senderUserID, senderUsername } = message;
        const channelData = await bot.DB.poroCount.findOne({ id: senderUserID }).exec();
        const { poroCount, poroPrestige } = channelData;
        if (poroCount < 5000) {
            return {
                text: `Not enough poro meat! ${senderUsername} kattahHappy You need 5,000 poro meat :tf: | [P:${poroPrestige}] ${poroCount} meat total! 🥩`,
            };
        } else if (poroCount >= 5000) {
            await bot.DB.poroCount.updateOne({ id: senderUserID }, { $set: { poroCount: poroCount - 5000 } }).exec();
            await bot.DB.poroCount.updateOne({ id: senderUserID }, { $set: { poroPrestige: poroPrestige + 1 } }).exec();
            return {
                text: `${senderUsername}, PartyHat Congratulations! | [P:${poroPrestige + 1}] ${
                    poroCount - 5000
                } meat total! 🥩`,
            };
        }
    },
};
