const got = require('got');

module.exports = {
	tags: 'stats',
	name: 'accage',
	cooldown: 3000,
	aliases: [],
	description: 'Check account age of a user or yourself',
	execute: async (message, args, client) => {
		const targetUser = args[0] ?? message.senderUsername;
		let userData = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, {
			timeout: 10000,
			headers: {
				'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
			},
		}).json();
		console.log(userData);

		const date = userData.createdAt;
		if (userData.banned == true) {
			return {
				text: `${targetUser}'s accage ${date.split('T')[0]} BatChest ❌`,
			};
		} else {
			return {
				text: `${targetUser}'s accage ${date.split('T')[0]} BatChest`,
			};
		}
	},
};
