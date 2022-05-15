module.exports = {
    name: "test",
    aliases: [],
    cooldown: 3000,
    description: "lol",
    execute: async (message, args) => {
        await bot.Redis.set("test", message.senderUsername);

        return {
            text: `${await bot.Redis.get("test")}`,
        };
    },
};
