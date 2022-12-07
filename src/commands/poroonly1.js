module.exports = {
    tags: 'moderation',
    name: 'poroonly',
    cooldown: 3000,
    description: 'Make the bot only allow poro commands',
    permission: 2,
    offline: true,
    execute: async (message, args, client) => {
        return {
            text: `This command has been deprecated. Please use |disable instead.`,
        };
    },
};
