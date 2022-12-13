const fetch = require('node-fetch');
const utils = require('../util/twitch/utils.js');

module.exports = {
	tags: 'stats',
	name: 'name',
	cooldown: 3000,
	aliases: [],
	description: 'Check available names on Twitch',
	execute: async (message, args, client) => {
		const targetUser = await utils.ParseUser(args[0] ?? message.senderUsername);
		if (!/^[a-z0-9_]/i.test(targetUser)) {
			return {
				text: `${targetUser} is not a valid user`,
			};
		}
		const data = await fetch(`https://api.fuchsty.com/twitch/checkname?username=${targetUser}`, {
			method: 'GET',
		}).then((res) => res.json());
		const { username, invalid, available } = data[0];

		return {
			text: `"${username}" is ${invalid ? 'invalid' : available ? 'available PogBones' : 'taken FeelsBadMan'}`,
		};
	},
};
