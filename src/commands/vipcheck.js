const fetch = require('node-fetch');
const { ParseUser } = require('../util/twitch/utils');
const humanizeDuration = require('../misc/humanizeDuration');

module.exports = {
	tags: 'stats',
	name: 'firstvip',
	aliases: ['fv'],
	cooldown: 3000,
	description: 'First VIP of the channel',
	canOptout: true,
	target: 'channel',
	execute: async (client, msg) => {
		const targetUser = ParseUser(msg.args[0] ?? msg.channel.login);
		const vipsApi = await fetch(`https://api.ivr.fi/v2/twitch/modvip/${targetUser}?skipCache=false`, {
			method: 'GET',
		});

		const { vips } = await vipsApi.json();
		if (vips == undefined) {
			return {
				text: `Channel not found.`,
				reply: true,
			};
		}

		if (vips.length == 0) {
			const isArgs = msg.args[0] ? `${targetUser}` : `This channel`;
			return {
				text: `${isArgs} has no VIPs`,
				reply: true,
			};
		}

		const { login, grantedAt } = vips[0];
		return {
			text: `First VIP of ${targetUser} is ${login} (${humanizeDuration(Date.now() - new Date(grantedAt))})`,
			reply: true,
		};
	},
};
