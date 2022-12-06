module.exports = {
    tags: 'moderation',
    name: 'offlineonly',
    cooldown: 3000,
    description: 'Make the bot only type when channel is offline',
    permission: 2,
    aliases: [],
    stvOnly: true,
    poro: true,
    offline: true,
    execute: async (message, args, client) => {
        const user = await bot.DB.channels.findOne({ id: message.senderUserID }).exec();
        if (user.offlineOnly) {
            try {
                await bot.DB.channels.updateOne({ id: message.senderUserID }, { $set: { offlineOnly: false } }).exec();
                return {
                    text: `${message.senderUsername} is now online & offline only`,
                };
            } catch (err) {
                return {
                    text: 'Failed to update database',
                };
            }
        }
        if (!user.offlineOnly) {
            try {
                await bot.DB.channels.updateOne({ id: message.senderUserID }, { $set: { offlineOnly: true } }).exec();
                return {
                    text: `${message.senderUsername} is now offline only`,
                };
            } catch (err) {
                return {
                    text: 'Failed to update database',
                };
            }
        }
    },
};
