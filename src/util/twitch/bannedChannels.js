const fetch = require('node-fetch');

async function bannedChannels() {
	const channels = [
		'trevi4ko',
		'vpplayersbr',
		'moises1916',
		'2022markus',
		'nsxanvonde',
		'gavnoshmyg',
		'aysko_tom',
		'fiver8576',
		'dj_kash513',
		'blackatmate_',
		'tabesheepttv',
		'pokemongoraids69',
		'm0xyy',
		'galetop',
		'gil3344',
		'tom1424',
		'bronquitte',
		'chavaies',
		'iconn98',
		'feelssunnyman',
		'chris_p_bacon9000',
		'gatme',
		'matony_',
		'hchalo003_tm',
		'cheersmeow2',
		'lordevid',
		'nayou7',
		'nymn',
		'grubabulwa_',
		'aimbotcone',
		'mirronake',
	];

	const response = await fetch(`https://api.ivr.fi/v2/twitch/user?login=${channels.join('%2C')}`, {
		method: 'GET',
		headers: {
			accept: 'application/json',
			'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
		},
	}).then((res) => res.json());
	const bannedMapped = response.map((channel) => {
		return {
			id: channel.id,
			username: channel.login,
			bannedDate: new Date(),
			banType: 'ban',
		};
	});

	for (const channel of bannedMapped) {
		if (!channel) continue;
		const { id, username, bannedDate, banType } = channel;

		const user = await bot.DB.bans.findOne({ id }).exec();
		if (!user || user === null) {
			const newUser = new bot.DB.bans({
				username,
				id,
				bannedDate,
				banType,
			});
			await newUser.save();
		}
	}
}

module.exports = { bannedChannels };
