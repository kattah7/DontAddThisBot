const { Achievements } = require('../../src/token/gql');
const { ParseUser, IDByLogin } = require('../../src/util/twitch/utils.js');

module.exports = {
	tags: 'stats',
	name: 'firststream',
	aliases: ['fs'],
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

		const pogger = await Achievements(UserID);
		try {
			const { itBegins, pathToAffiliate } = pogger.data.user.quests;
			const isAffiliate = pathToAffiliate.completedAt ? `${pathToAffiliate.completedAt.split('T')[0]}` : false;
			if (itBegins.completedAt == null) {
				return {
					text: `${targetUser} has never streamed before :p`,
					reply: true,
				};
			} else {
				return {
					text: `First stream: ${itBegins.completedAt.split('T')[0]} | Affiliated At: ${isAffiliate}`,
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
