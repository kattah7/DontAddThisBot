const got = require('got');
const { twitter } = require('../../config.json');

module.exports = {
	tags: 'stats',
	name: 'sillychamp',
	cooldown: 5000,
	description: 'Gets recent tweet from TwitchGibberish',
	execute: async (message, args, client) => {
		const { data } = await got(`https://api.twitter.com/2/users/by/username/TwitchGibberish?user.fields=location`, {
			headers: {
				Authorization: `Bearer ${twitter.bearer}`,
			},
		}).json();

		const { data: data2 } = await got(`https://api.twitter.com/2/users/${data.id}/tweets?tweet.fields=created_at`, {
			headers: {
				Authorization: `Bearer ${twitter.bearer}`,
			},
		}).json();
		const random = Math.floor(Math.random() * 10) + 0;
		return {
			text: `https://twitter.com/TwitchGibberish/status/${data2[random].id}/photo/1`,
		};
	},
};
