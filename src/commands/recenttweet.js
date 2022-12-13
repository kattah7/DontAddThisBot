const got = require('got');
const humanizeDuration = require('../util/humanizeDuration');
const { twitter } = require('../../config.json');

module.exports = {
	tags: 'stats',
	name: 'recenttweet',
	aliases: ['rt'],
	cooldown: 5000,
	description: 'Gets recent tweet of user (Usage: |rt or |recenttweet)',
	execute: async (message, args, client) => {
		if (!args[0]) {
			return {
				text: `insert twitter name to get recent tweet lol`,
			};
		}
		const targetUser = args[0] ?? message.senderUsername;
		const { data } = await got(`https://api.twitter.com/2/users/by/username/${targetUser}?user.fields=location`, {
			headers: {
				Authorization: `Bearer ${twitter.bearer}`,
			},
		}).json();

		const { data: data2 } = await got(`https://api.twitter.com/2/users/${data.id}/tweets?tweet.fields=created_at`, {
			headers: {
				Authorization: `Bearer ${twitter.bearer}`,
			},
		}).json();
		//console.log(data2);
		const ms = new Date().getTime() - Date.parse(data2[0].created_at);
		return {
			text: `Recent Tweet: ${data2[0].text} (Posted ${humanizeDuration(ms)} ago) | twitter.com/${targetUser}/status/${data2[0].id}`,
		};
	},
};
