module.exports = {
    name: "test",
    aliases: [],
    cooldown: 3000,
    description: "lol",
    execute: async (message, args) => {
        const lastUsage = await bot.Redis.get(`test:${message.senderUsername}`);

        if (lastUsage) {
            if (Date.now() - new Date(lastUsage).getTime() < 1000 * 60 * 5) {
                return {
                    text: `This command can only be used every 5 minutes. Please wait ${Date.now() - new Date(lastUsage).getTime() * 1000}s before trying to use it again.`,
                };
            }
        }

        await bot.Redis.set(`test:${message.senderUsername}`, Date.now());

        return {
            text: `Lol this worked`,
        };
    },
};
