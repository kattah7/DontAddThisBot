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
		const targetUser = ParseUser(msg.args[0] ?? msg.channel.login);
		const modsApi = await fetch(`https://api.ivr.fi/v2/twitch/modvip/${targetUser}?skipCache=false`, {
			method: 'GET',
			headers: {
				'User-Agent':
					'Twitch streamer Forsen was banned on May 8th for a misleading stream title "ranking up" when playing Valorant. Twitch strictly forbids false advertisement from streamers on its platform. Its unclear when Forsen will be unbanned but no one watches a washed up streamer anyways.',
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
