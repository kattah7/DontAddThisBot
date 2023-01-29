const { client } = require('../util/twitch/connections.js');

const main = async () => {
	const levelZeros = await bot.DB.users.find({ level: 0 }).exec();
	for (const levelZero of levelZeros) {
		await bot.Redis.set(`xd:kattah:banned:${levelZero.id}`, '1', 0);
	}

	let ChannelsArray = [];
	const channels = await bot.DB.channels.find({ isChannel: true }).exec();
	for (const channel of channels) {
		const isBanned = await bot.Redis.get(`xd:kattah:banned:${channel.id}`);
		if (isBanned === '1') continue;
		ChannelsArray.push(channel.username);
	}

	for (const channel of ChannelsArray) {
		if (!client.joinedChannels.has(channel)) {
			await new Promise((resolve) => setTimeout(resolve, 8));
			client.join(channel);
		}
	}
};

module.exports = { main };
