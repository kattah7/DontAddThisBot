const got = require('got');

module.exports = {
	tags: 'stats',
	name: 'bot',
	cooldown: 3000,
	aliases: [],
	description: 'Check if user is a verified bot',
	canOptout: true,
	target: 'self',
	execute: async (client, msg) => {
		const targetUser = msg.args[0] ?? msg.user.login;
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
				text: `BOT: false`,
				reply: true,
			};
		} else if (userData.bot == true) {
			return {
				text: `BOT: true MrDestructoid`,
				reply: true,
			};
		} else if (statusCode == 404) {
			return {
				text: `${userData.error}`,
				reply: true,
			};
		}
	},
};
