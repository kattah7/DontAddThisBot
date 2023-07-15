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
				'User-Agent':
					'Twitch streamer Forsen was banned on May 8th for a misleading stream title "ranking up" when playing Valorant. Twitch strictly forbids false advertisement from streamers on its platform. Its unclear when Forsen will be unbanned but no one watches a washed up streamer anyways.',
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
