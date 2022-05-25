module.exports = {
    name: "level",
    description: "Shows the user's level.",
    cooldown: 5000,
    async execute(message, args, client, userdata) {
        const user = args[0] || message.senderUsername;

        const { level } = await bot.DB.users.findOne({ username: user }).exec();

        if (!level) {
            return {
                text: `${user} has not been seen before.`,
            };
        } else {
            return {
                text: `${user} is level ${level}`,
            };
        }
    },
};
