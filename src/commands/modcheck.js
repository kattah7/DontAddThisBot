const fetch = require('node-fetch');
const { ParseUser } = require('../util/twitch/utils');
const humanizeDuration = require('../misc/humanizeDuration');

module.exports = {
	tags: 'stats',
	name: 'firstmod',
	aliases: ['fm'],
	cooldown: 3000,
	description: 'First Mod of the channel',
	canOptout: true,
	target: 'channel',
	execute: async (client, msg) => {
		const targetUser = await ParseUser(msg.args[0] ?? msg.channel.login);
		const modsApi = await fetch(`https://api.ivr.fi/v2/twitch/modvip/${targetUser}?skipCache=false`, {
			method: 'GET',
			headers: {
				'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
			},
		});

		const { mods } = await modsApi.json();
		if (mods == undefined) {
			return {
				text: `Channel not found.`,
				reply: true,
			};
		}

		if (mods.length == 0) {
			const isArgs = msg.args[0] ? `${targetUser}` : `This channel`;
			return {
				text: `${isArgs} has no MODs`,
				reply: true,
			};
		}

		const { login, grantedAt } = mods[0];
		return {
			text: `First MOD of ${targetUser} is ${login} (${humanizeDuration(Date.now() - new Date(grantedAt))})`,
			reply: true,
		};
	},
};
