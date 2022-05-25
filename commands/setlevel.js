module.exports = {
    name: "setlevel",
    description: "Sets the user's level.",
    cooldown: 5000,
    async execute(message, args, client, userdata) {
        if (message.senderUsername !== "fookstee") return;

        if (!args[0]) {
            return {
                text: `Please provide a user.`,
            };
        }

        const data = await bot.DB.users.findOne({ username: args[0].toLowerCase() }).exec();

        if (!data) {
            return {
                text: `User not found.`,
            };
        }

        if (!args[1]) {
            return {
                text: `Please provide a level.`,
            };
        }

        const level = parseInt(args[1]);

        if (isNaN(level) || level < 0 || level > bot.Utils.misc.levels.length) {
            return {
                text: `Please provide a valid level.`,
            };
        }

        await bot.DB.users.updateOne({ username: args[0].toLowerCase() }, { level: parseInt(args[1]) }).exec();

        return {
            text: `The users level has been updated to:  ${bot.Utils.misc.levels[parseInt(args[1])]} (${args[1]})`,
        };
    },
};
