module.exports = {
    tags: 'stats',
    name: 'whispers',
    cooldown: 3000,
    description: 'whisper popout',
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        return {
            text: `https://www.twitch.tv/popout/moderator/${targetUser}/whispers `,
        };
    },
};
