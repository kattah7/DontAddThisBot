const got = require('got');
const humanizeDuration = require('../util/humanizeDuration');
const { ParseUser } = require('../util/twitch/utils');
const { GetStreams } = require('../token/helix');

module.exports = {
	tags: 'stats',
	name: 'uptime',
	cooldown: 3000,
	aliases: [],
	description: 'Uptime of channel',
	execute: async (message, args, client) => {
		const targetUser = await ParseUser(args[0] ?? message.channelName);
		const data2 = await GetStreams(targetUser, true);
		let { body: userData } = await got(`https://api.ivr.fi/v2/twitch/user?login=${targetUser}`, {
			throwHttpErrors: false,
			responseType: 'json',
			headers: {
				'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
			},
		});
		const { startedAt, title } = userData[0].lastBroadcast;
		if (data2[0] == null) {
			const ms2 = new Date().getTime() - Date.parse(startedAt);
			return {
				text: `${targetUser} has been offline for ${humanizeDuration(
					ms2,
				)}, Title: ${title}`,
			};
		} else {
			const { started_at, user_name, game_name, viewer_count, title } = data2[0];
			const ms = new Date().getTime() - Date.parse(started_at);
			return {
				text: `${user_name} went live ${humanizeDuration(
					ms,
				)} ago, Playing ${game_name} with ${viewer_count.toLocaleString()} viewers. Title: ${title}`,
			};
		}
	},
};
