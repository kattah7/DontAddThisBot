const { GetFirstFollows } = require('../token/gql');
const { ParseUser } = require('../util/twitch/utils.js');

module.exports = {
	tags: 'stats',
	name: 'fcf',
	cooldown: 3000,
	aliases: [],
	description: 'Check your first follower.',
	canOptout: true,
	target: 'self',
	execute: async (client, msg) => {
		const targetUser = await ParseUser(msg.args[0] ?? msg.channel.login);
		const { data } = await GetFirstFollows(targetUser);
		const { user } = data;

		if (data) {
			if (user == null) {
				return {
					text: `${targetUser} is either banned or doesnt exist.`,
					reply: false,
				};
			} else if (user.followers.edges == null) {
				return {
					text: `${targetUser} do not have any followers to display.`,
					reply: false,
				};
			} else if (user.followers.edges[0].node == null) {
				const DATE = user.followers.edges[0].followedAt;
				return {
					text: `Seems like ${targetUser} blocked this person :p following since ${DATE.split('T')[0]}`,
					reply: false,
				};
			} else {
				const NAME = user.followers.edges[0].node.login;
				const DATE = user.followers.edges[0].followedAt;
				return {
					text: `${targetUser} first ever follower, ${NAME} has been following since ${DATE.split('T')[0]}`,
					reply: false,
				};
			}
		}
	},
};
