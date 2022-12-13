const { Achievements } = require('../token/gql');
const utils = require('../util/twitch/utils.js');

module.exports = {
	tags: 'stats',
	name: 'firststream',
	aliases: ['fs'],
	cooldown: 3000,
	canOptout: true,
	target: 'channel',
	execute: async (message, args, client) => {
		const targetUser = await utils.ParseUser(args[0] ?? message.channelName);
		const UserID = await utils.IDByLogin(targetUser);
		if (!UserID || !/^[A-Z_\d]{2,26}$/i.test(targetUser)) {
			return {
				text: 'malformed username parameter',
			};
		}
		const pogger = await Achievements(UserID);
		try {
			const { itBegins, pathToAffiliate } = pogger.data.user.quests;
			const isAffiliate = pathToAffiliate.completedAt ? `${pathToAffiliate.completedAt.split('T')[0]}` : false;
			if (itBegins.completedAt == null) {
				return {
					text: `${targetUser} has never streamed before :p`,
				};
			} else {
				return {
					text: `First stream: ${itBegins.completedAt.split('T')[0]} | Affiliated At: ${isAffiliate}`,
				};
			}
		} catch (error) {
			return {
				text: `PoroSad bot requires editor in #${targetUser} to check`,
			};
		}
	},
};
