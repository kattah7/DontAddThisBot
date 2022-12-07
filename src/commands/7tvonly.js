module.exports = {
    tags: 'moderation',
    name: '7tvonly',
    aliases: ['7tvonly'],
    cooldown: 3000,
    aliases: [],
    description: '7tv only cmds',
    permission: 2,
    execute: async (message, args, client) => {
        return {
            text: `This command has been deprecated. Please use |disable instead.`,
        };
    },
};
