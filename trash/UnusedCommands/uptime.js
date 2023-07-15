const got = require('got');
const humanizeDuration = require('../../src/misc/humanizeDuration');
const { ParseUser } = require('../../src/util/twitch/utils');
const { GetStreams } = require('../../src/token/helix');

module.exports = {
	tags: 'stats',
	name: 'uptime',
	cooldown: 3000,
	aliases: [],
	description: 'Uptime of channel',
	execute: async (client, msg) => {
		const targetUser = await ParseUser(msg.args[0] ?? msg.channel.login);
		const data2 = await GetStreams(targetUser, true);
		if (!data2) {
			return {
				text: `${targetUser} is not live`,
				reply: true,
			};
		}

		let { body: userData } = await got(`https://api.ivr.fi/v2/twitch/user?login=${targetUser}`, {
			throwHttpErrors: false,
			responseType: 'json',
			headers: {
				'User-Agent':
					'Twitch streamer Forsen was banned on May 8th for a misleading stream title "ranking up" when playing Valorant. Twitch strictly forbids false advertisement from streamers on its platform. Its unclear when Forsen will be unbanned but no one watches a washed up streamer anyways.',
			},
		});

		const { startedAt, title } = userData[0].lastBroadcast;
		if (data2[0] == null) {
			const ms2 = new Date().getTime() - Date.parse(startedAt);
			return {
				text: `${targetUser} has been offline for ${humanizeDuration(ms2)}, Title: ${title}`,
				reply: true,
			};
		} else {
			const { started_at, user_name, game_name, viewer_count, title } = data2[0];
			const ms = new Date().getTime() - Date.parse(started_at);
			return {
				text: `${user_name} went live ${humanizeDuration(ms)} ago, Playing ${game_name} with ${viewer_count.toLocaleString()} viewers. Title: ${title}`,
				reply: true,
			};
		}
	},
};
