module.exports = {
    tags: 'moderation',
    name: 'poroonly',
    cooldown: 3000,
    description: 'Make the bot only allow poro commands',
    permission: 2,
    stvOnly: true,
    poro: true,
    offline: true,
    execute: async (message, args, client) => {
        const user = await bot.DB.channels.findOne({ id: message.senderUserID }).exec();
        if (user.poroOnly) {
            try {
                await bot.DB.channels.updateOne({ id: message.senderUserID }, { $set: { poroOnly: false } }).exec();
                return {
                    text: `#${message.senderUsername} is now all cmds`,
                };
            } catch (err) {
                return {
                    text: 'Failed to update database',
                };
            }
        }
        if (!user.poroOnly) {
            try {
                await bot.DB.channels.updateOne({ id: message.senderUserID }, { $set: { poroOnly: true } }).exec();
                return {
                    text: `#${message.senderUsername} is now poro cmds only`,
                };
            } catch (err) {
                return {
                    text: 'Failed to update database',
                };
            }
        }
    },
};
