const { ChatStats } = require('../../src/token/SE.js');
const { ParseUser } = require('../../src/util/twitch/utils.js');

module.exports = {
	tags: 'stats',
	name: 'chatstats',
	cooldown: 3000,
	aliases: [],
	description: 'Get channel emote, top chatter, top hastags and top command stats',
	execute: async (client, msg) => {
		const targetUser = ParseUser(msg.args[0] ?? msg.channel.login);
		const data = await ChatStats(targetUser);

		if (data.error) {
			return {
				text: `⛔ ${data.message}`,
				reply: true,
			};
		}

		const { totalMessages, chatters, twitchEmotes } = data;
		return {
			text: `This channel has (${totalMessages.toLocaleString()}) messages in total; ${chatters[0]['name']} Top Chatter; "${twitchEmotes[0]['emote']}" Top Twitch Emote with (${twitchEmotes[0][
				'amount'
			].toLocaleString()}) uses`,
			reply: true,
		};
	},
};
