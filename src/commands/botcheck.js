const got = require('got');

module.exports = {
	tags: 'stats',
	name: 'bot',
	cooldown: 3000,
	aliases: [],
	description: 'Check if user is a verified bot',
	canOptout: true,
	target: 'self',
	execute: async (message, args, client) => {
		const targetUser = args[0] ?? message.senderUsername;
		let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, {
			timeout: 10000,
			throwHttpErrors: false,
			responseType: 'json',
			headers: {
				'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
			},
		});
		if (userData.bot == false) {
			return {
				text: `${targetUser}, BOT: false`,
			};
		} else if (userData.bot == true) {
			return {
				text: `${targetUser}, BOT: true MrDestructoid`,
			};
		} else if (statusCode == 404) {
			return {
				text: `${userData.error}`,
			};
		}
	},
};
