module.exports = {
    tags: 'moderation',
    name: '7tvonly',
    aliases: ['7tvonly'],
    cooldown: 3000,
    description: '7tv only cmds',
    stvOnly: true,
    poro: true,
    permission: 2,
    execute: async (message, args, client) => {
        const user = await bot.DB.channels.findOne({ id: message.senderUserID }).exec();
        if (!user.stvOnly) {
            try {
                await bot.DB.channels.updateOne({ id: message.senderUserID }, { $set: { stvOnly: true } }).exec();
                return {
                    text: `${message.senderUsername} is now 7tvH cmds only`,
                };
            } catch (err) {
                return {
                    text: 'Failed to update database',
                };
            }
        }

        if (user.stvOnly) {
            try {
                await bot.DB.channels.updateOne({ id: message.senderUserID }, { $set: { stvOnly: false } }).exec();
                return {
                    text: `${message.senderUsername} is now All-Commands`,
                };
            } catch (err) {
                return {
                    text: 'Failed to update database',
                };
            }
        }
    },
};
