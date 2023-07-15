const got = require('got');
const { NameHistory } = require('../token/gql.js');
const { ParseUser } = require('../util/twitch/utils.js');

module.exports = {
	tags: 'stats',
	name: 'history',
	cooldown: 5000,
	aliases: [],
	description: 'Check name history',
	canOptout: true,
	target: null,
	execute: async (client, msg) => {
		const targetUser = ParseUser(msg.args[0] ?? msg.user.login);
		const { body: pogger2 } = await got(`https://api.ivr.fi/v2/twitch/user?login=${targetUser}`, {
			throwHttpErrors: false,
			responseType: 'json',
			headers: {
				'User-Agent':
					'Twitch streamer Forsen was banned on May 8th for a misleading stream title "ranking up" when playing Valorant. Twitch strictly forbids false advertisement from streamers on its platform. Its unclear when Forsen will be unbanned but no one watches a washed up streamer anyways.',
			},
		});

		if (!targetUser) {
			return {
				text: 'Please provide a username.',
				reply: true,
			};
		}
		if (pogger2[0] == undefined) {
			return {
				text: `${targetUser} is not a valid username.`,
				reply: true,
			};
		}
		if (pogger2[0].roles.isAffiliate != true && pogger2[0].roles.isPartner != true) {
			return {
				text: `${targetUser} must be affiliate or partner to check`,
				reply: true,
			};
		}

		const pogger = await NameHistory(targetUser);
		const { subscriptionProducts } = pogger.data.user;
		if (subscriptionProducts[0].name) {
			if (targetUser == subscriptionProducts[0].name) {
				return {
					text: `${targetUser} has no name change history`,
					reply: true,
				};
			}
			return {
				text: `${targetUser}'s name history since affiliate/partner: ${subscriptionProducts[0].name}`,
				reply: true,
			};
		}
	},
};
