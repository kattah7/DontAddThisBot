const got = require('got');
const { ParseUser } = require('../util/twitch/utils');

module.exports = {
	tags: 'stats',
	name: 'uid',
	cooldown: 3000,
	aliases: [],
	description: 'Gets user ID of a targeted user',
	execute: async (client, msg) => {
		const targetUser = await ParseUser(msg.args[0] ?? msg.user.login);
		let { body: userData } = await got(`https://api.ivr.fi/v2/twitch/user?login=${targetUser}`, {
			timeout: 10000,
			throwHttpErrors: false,
			responseType: 'json',
			headers: {
				'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
			},
		});

		if (userData) {
			if (userData[0].banned == true) {
				return {
					text: `${targetUser}'s UID ${userData[0].id} PoroSad (${userData[0].banReason})`,
					reply: true,
				};
			} else if (userData[0].banned == false) {
				return {
					text: `${targetUser}'s UID ${userData[0].id} BatChest`,
					reply: true,
				};
			}
		}
	},
};
