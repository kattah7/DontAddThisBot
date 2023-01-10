const { ParseUser } = require('../util/twitch/utils.js');

module.exports = {
	tags: 'poro',
	name: 'rank',
	cooldown: 5000,
	aliases: ['pororank'],
	description: 'Check your rank in the poro leaderboard',
	execute: async (client, msg) => {
		const targetUser = await ParseUser(msg.args[0] ?? msg.user.login);
		const { leaderboards } = await bot.Redis.get('leaderboardEndpoint');

		const length = leaderboards.length;
		console.log(length);
		const totalSliced = leaderboards.slice(0, length);

		if (!isNaN(msg.args[0])) {
			const nanRank = leaderboards.slice(Number(msg.args[0]) - 1, Number(msg.args[0]));
			if (!nanRank[0] || msg.args[0].startsWith('-')) {
				return {
					text: `Rank #${targetUser} not found in database PoroSad`,
				};
			}

			return {
				text: `${nanRank[0].username} is rank #${totalSliced.findIndex((user) => user.username == nanRank[0].username) + 1}/${length} in the poro leaderboard! kattahPoro`,
				reply: false,
			};
		}

		if (totalSliced.findIndex((user) => user.username == targetUser) + 1 == 0) {
			return {
				text: `${targetUser} not found in database PoroSad`,
				reply: true,
			};
		}

		return {
			text: `${targetUser} is rank #${totalSliced.findIndex((user) => user.username == targetUser) + 1}/${length} in the poro leaderboard! kattahPoro`,
			reply: false,
		};
	},
};
