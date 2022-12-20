const got = require('got');

module.exports = {
	tags: 'stats',
	name: 'accage',
	cooldown: 3000,
	aliases: [],
	description: 'Check account age of a user or yourself',
	execute: async (client, msg) => {
		const targetUser = msg.args[0] ?? msg.user.login;
		let userData = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, {
			timeout: 10000,
			headers: {
				'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
			},
		}).json();

		const date = userData.createdAt;
		if (userData.banned == true) {
			return {
				text: `${targetUser}'s accage ${date.split('T')[0]} BatChest ❌`,
				reply: true,
			};
		} else {
			return {
				text: `${targetUser}'s accage ${date.split('T')[0]} BatChest`,
				reply: true,
			};
		}
	},
};
