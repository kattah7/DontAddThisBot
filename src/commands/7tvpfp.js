const { ParseUser, IDByLogin } = require('../util/twitch/utils');
const { getUser } = require('../token/stvREST');

module.exports = {
	tags: '7tv',
	name: '7tvpfp',
	description: "Get user's 7tv profile picture",
	cooldown: 5000,
	aliases: [],
	execute: async (client, msg) => {
		const targetUser = ParseUser(msg.args[0] ?? msg.user.login);
		const targetID = await IDByLogin(targetUser);

		if (targetID === null) {
			return {
				text: `User ${targetUser} not found`,
				reply: true,
			};
		}

		const stvUser = await getUser(targetID);
		if (stvUser === null || stvUser?.user?.avatar_url === '' || !stvUser?.user?.avatar_url) {
			return {
				text: `User ${targetUser} not found on 7TV`,
				reply: true,
			};
		}

		return {
			text: 'https:' + stvUser.user.avatar_url,
			reply: true,
		};
	},
};
