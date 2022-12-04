const { IVRByLogin, ParseUser } = require('../util/twitch/utils');

module.exports = {
    name: 'setlevel',
    description: "Sets the user's level.",
    level: 3,
    cooldown: 5000,
    async execute(message, args, client, userdata) {
        if (!args[0]) {
            return {
                text: `Please provide a user.`,
            };
        }

        if (!args[1]) {
            return {
                text: `Please provide a level.`,
            };
        }

        const level = parseInt(args[1]);

        if (isNaN(level) || level < 0 || level > bot.Utils.misc.levels.length - 1) {
            return {
                text: `Please provide a valid level.`,
            };
        }

        const targetUser = await ParseUser(args[0]);
        console.log(targetUser);
        const targetUserInfo = await IVRByLogin(targetUser);
        if (!targetUserInfo || targetUserInfo === null || targetUserInfo.banned === true) {
            return {
                text: `User not found.`,
            };
        }

        const { id, login } = targetUserInfo;
        const data = await bot.DB.users.findOne({ id: id }).exec();
        if (!data) {
            await bot.DB.users.create({
                id: id,
                username: login,
                firstSeen: new Date(),
                level: 1,
            });
        }

        await bot.DB.users.updateOne({ id: id }, { level: level }).exec();
        return {
            text: `The users level has been updated to:  ${bot.Utils.misc.levels[level]} (${level})`,
        };
    },
};
