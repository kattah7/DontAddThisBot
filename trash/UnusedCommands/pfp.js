const got = require('got');

module.exports = {
	tags: 'stats',
	name: 'pfp',
	aliases: [],
	cooldown: 3000,
	description: "Grabs user's Twitch profile picture",
	execute: async (message, args, client) => {
		const targetUser = args[0] ?? message.senderUsername;
		let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, {
			timeout: 10000,
			throwHttpErrors: false,
			responseType: 'json',
			headers: {
				'User-Agent':
					'Twitch streamer Forsen was banned on May 8th for a misleading stream title "ranking up" when playing Valorant. Twitch strictly forbids false advertisement from streamers on its platform. Its unclear when Forsen will be unbanned but no one watches a washed up streamer anyways.',
			},
		});

		const pfp = userData.logo;
		return {
			text: `${message.senderUsername}, ${pfp} BatChest`,
		};
	},
};
