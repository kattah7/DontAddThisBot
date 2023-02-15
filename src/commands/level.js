const { ParseUser } = require('../util/twitch/utils.js');

module.exports = {
	tags: 'stats',
	name: 'level',
	description: "Shows the user's level.",
	aliases: ['lvl'],
	cooldown: 5000,
	async execute(client, msg) {
		const user = msg.args[0] ? msg.args[0].toLowerCase() : msg.user.login;
		const targeParsedUser = ParseUser(user);
		const data = await bot.DB.users.findOne({ username: targeParsedUser }).exec();

		if (!data) {
			return {
				text: `${targeParsedUser} has not been seen before.`,
				reply: true,
			};
		} else {
			return {
				text: `${targeParsedUser} is level ${data.level} (${bot.Utils.misc.levels[data.level]})`,
				reply: true,
			};
		}
	},
};
