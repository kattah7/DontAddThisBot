const fetch = require('node-fetch');
const utils = require('../util/twitch/utils');
const humanizeDuration = require('../misc/humanizeDuration');

module.exports = {
	tags: 'stats',
	name: 'firstvip',
	aliases: ['fv'],
	cooldown: 3000,
	description: 'First VIP of the channel',
	canOptout: true,
	target: 'channel',
	execute: async (message, args, client) => {
		const targetUser = await utils.ParseUser(args[0] ?? message.channelName);
		const vipsApi = await fetch(`https://api.ivr.fi/v2/twitch/modvip/${targetUser}?skipCache=false`, {
			method: 'GET',
		});

		const { vips } = await vipsApi.json();
		if (vips == undefined) {
			return {
				text: `${message.senderUsername}, Channel not found.`,
			};
		}

		if (vips.length == 0) {
			const isArgs = args[0] ? `${targetUser}` : `This channel`;
			return {
				text: `${message.senderUsername}, ${isArgs} has no VIPs`,
			};
		}

		const { login, grantedAt } = vips[0];
		return {
			text: `${message.senderUsername}, First VIP of ${targetUser} is ${login} (${humanizeDuration(Date.now() - new Date(grantedAt))})`,
		};
	},
};
