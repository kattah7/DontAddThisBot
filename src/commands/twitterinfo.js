const got = require('got');
const { twitter } = require('../../config.json');
const { ParseUser } = require('../util/twitch/utils');

module.exports = {
	tags: 'stats',
	name: 'twitter',
	cooldown: 1000,
	aliases: [],
	description: "Gets info of user's twitter",
	execute: async (client, msg) => {
		if (!msg.args[0]) {
			return {
				text: `insert name to get twitter info lol`,
				reply: true,
			};
		}

		const targetUser = await ParseUser(msg.args[0] ?? msg.user.login);
		const { data } = await got(`https://api.twitter.com/2/users/by/username/${targetUser}?user.fields=created_at,location,description`, {
			headers: {
				Authorization: `Bearer ${twitter.bearer}`,
			},
		}).json();

		const { data: data2 } = await got(`https://api.twitter.com/2/users/${data.id}?user.fields=public_metrics`, {
			headers: {
				Authorization: `Bearer ${twitter.bearer}`,
			},
		}).json();

		const { created_at } = data;
		const { name, location, description, id, public_metrics } = data2;
		const { followers_count, following_count } = public_metrics;
		return {
			text: `${targetUser} (${name})'s twitter account created at ${
				created_at.split('T')[0]
			}, ID: ${id}, Location: ${location}, Description: ${description} [Followers: ${followers_count} Following: ${following_count} ]`,
			reply: true,
		};
	},
};
