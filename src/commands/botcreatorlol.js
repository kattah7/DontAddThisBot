module.exports = {
    tags: 'stats',
    name: 'datb',
    cooldown: 3000,
    description: 'bot info',
    aliases: ['dontaddthisbot'],
    poro: true,
    execute: async (message, args, client) => {
        return {
            text: `DontAddThisBot is a multi-channel variety and utility bot made by @Kattah`,
        };
    },
};
