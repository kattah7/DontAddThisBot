const { IVRByLogin, ParseUser } = require('../util/twitch/utils');

module.exports = {
	name: 'setlevel',
	description: "Sets the user's level.",
	level: 3,
	cooldown: 5000,
	aliases: [],
	async execute(client, msg) {
		if (!msg.args[0]) {
			return {
				text: `Please provide a user.`,
				reply: true,
			};
		}

		if (!msg.args[1]) {
			return {
				text: `Please provide a level.`,
				reply: true,
			};
		}

		const level = parseInt(msg.args[1]);

		if (isNaN(level) || level < 0 || level > bot.Utils.misc.levels.length - 1) {
			return {
				text: `Please provide a valid level.`,
				reply: true,
			};
		}

		const targetUser = ParseUser(msg.args[0]);
		const targetUserInfo = await IVRByLogin(targetUser);
		if (!targetUserInfo || targetUserInfo === null || targetUserInfo.banned === true) {
			return {
				text: `User not found.`,
				reply: true,
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
