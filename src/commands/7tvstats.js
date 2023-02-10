const fetch = require('node-fetch');
const { ParseUser } = require('../util/twitch/utils');

module.exports = {
	tags: '7tv',
	name: 'stats',
	aliases: ['7tvstats'],
	description: 'Check your 7tv emote usage stats',
	cooldown: 5000,
	execute: async (client, msg) => {
		const user = await ParseUser(msg.args[0] ?? msg.channel.login);
		const emoteStats = await fetch(`https://api.kattah.me/c/${user.toLowerCase()}`, {
			method: 'GET',
		}).then((res) => res.json());
		console.log(emoteStats);
		const { success, emotes } = emoteStats;

		if (success) {
			const listTop5Emotes = emotes.slice(0, 5);

			const top5Text = listTop5Emotes
				.map((emote, index) => `${index == 0 ? `🥇` : index == 1 ? `🥈` : index == 2 ? `🥉` : ``} ${emote.emote} (Usage: ${emote.count.toLocaleString()})`)
				.join(' | ');

			return {
				text: `${top5Text} More info ==> stats.kattah.me/c/${user}`,
				reply: false,
			};
		} else {
			return {
				text: `Channel ${user} not found`,
				reply: false,
			};
		}
	},
};
