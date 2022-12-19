const fetch = require('node-fetch');
const utils = require('../util/twitch/utils');
const humanizeDuration = require('../misc/humanizeDuration');

module.exports = {
	tags: 'stats',
	name: 'firstmod',
	aliases: ['fm'],
	cooldown: 3000,
	description: 'First Mod of the channel',
	canOptout: true,
	target: 'channel',
	execute: async (message, args, client) => {
		const targetUser = await utils.ParseUser(args[0] ?? message.channelName);
		const modsApi = await fetch(`https://api.ivr.fi/v2/twitch/modvip/${targetUser}?skipCache=false`, {
			method: 'GET',
			headers: {
				'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
			},
		});

		const { mods } = await modsApi.json();
		if (mods == undefined) {
			return {
				text: `${message.senderUsername}, Channel not found.`,
			};
		}

		if (mods.length == 0) {
			const isArgs = args[0] ? `${targetUser}` : `This channel`;
			return {
				text: `${message.senderUsername}, ${isArgs} has no MODs`,
			};
		}

		const { login, grantedAt } = mods[0];
		return {
			text: `${message.senderUsername}, First MOD of ${targetUser} is ${login} (${humanizeDuration(Date.now() - new Date(grantedAt))})`,
		};
	},
};
