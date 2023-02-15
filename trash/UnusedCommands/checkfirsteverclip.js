const { GetClips } = require('../../src/token/gql');
const { ParseUser, IDByLogin } = require('../../src/util/twitch/utils.js');

module.exports = {
	tags: 'stats',
	name: 'firstclip',
	aliases: ['fc'],
	cooldown: 3000,
	canOptout: true,
	target: 'channel',
	execute: async (client, msg) => {
		const targetUser = ParseUser(msg.args[0] ?? msg.channel.login);
		const UserID = await IDByLogin(targetUser);
		if (!UserID || !/^[A-Z_\d]{2,26}$/i.test(targetUser)) {
			return {
				text: 'malformed username parameter',
				reply: true,
			};
		}

		const pogger = await GetClips(targetUser, UserID);
		try {
			const { edges } = pogger.data.user.clips;
			const { url, curator, broadcaster, game, createdAt, title, viewCount } = edges[0].node;
			if (edges.length == 0) {
				return {
					text: `${targetUser} has never clipped before :p`,
					reply: true,
				};
			}
			if (edges.length > 0) {
				return {
					text: `First clip: ${url} by ${curator.login} in #${broadcaster.login} | Game: ${game.name} | Date: ${createdAt.split('T')[0]} | Title: ${title} | TotalViews: ${viewCount}`,
					reply: true,
				};
			}
		} catch (error) {
			return {
				text: `PoroSad bot requires editor in #${targetUser} to check`,
				reply: true,
			};
		}
	},
};
