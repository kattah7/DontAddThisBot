const fetch = require('node-fetch');
const { ParseUser } = require('../util/twitch/utils.js');

module.exports = {
	tags: 'stats',
	name: 'name',
	cooldown: 3000,
	aliases: [],
	description: 'Check available names on Twitch',
	execute: async (client, msg) => {
		const targetUser = ParseUser(msg.args[0] ?? msg.user.login);
		if (!/^[a-z0-9_]/i.test(targetUser)) {
			return {
				text: `${targetUser} is not a valid user`,
				reply: true,
			};
		}

		const data = await fetch(`https://api.fuchsty.com/twitch/checkname?username=${targetUser}`, {
			method: 'GET',
		}).then((res) => res.json());

		const { username, invalid, available } = data[0];
		return {
			text: `"${username}" is ${invalid ? 'invalid' : available ? 'available PogBones' : 'taken FeelsBadMan'}`,
			reply: true,
		};
	},
};
