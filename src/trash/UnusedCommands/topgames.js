const got = require('got');

module.exports = {
	tags: 'stats',
	name: 'topgames',
	cooldown: 3000,
	description: 'Live playercount of top games on steam',
	execute: async (message, args, client) => {
		let { body: userData } = await got(
			`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v0001/?appid=1599340`,
			{ timeout: 10000, throwHttpErrors: false, responseType: 'json' },
		);
		let { body: userData2 } = await got(
			`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v0001/?appid=730`,
			{ timeout: 10000, throwHttpErrors: false, responseType: 'json' },
		);
		let { body: userData3 } = await got(
			`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v0001/?appid=570`,
			{ timeout: 10000, throwHttpErrors: false, responseType: 'json' },
		);

		const data1 = userData.response.player_count;
		const data2 = userData2.response.player_count;
		const data3 = userData3.response.player_count;

		return {
			text: `TOP STEAM GAMES BatChest Lost Ark: ${data1} players :o CS:GO: ${data2} players :o Dota 2: ${data3} players :o`,
		};
	},
};
