const { client } = require('../util/twitch/connections.js');

const main = async () => {
	let levelZeroArray = [];
	const levelZeros = await bot.DB.users.find({ level: 0 }).exec();
	for (const levelZero of levelZeros) {
		levelZeroArray.push(levelZero.id);
	}

	let ChannelsArray = [];
	const channels = await bot.DB.channels.find({ isChannel: true }).exec();
	for (const channel of channels) {
		await bot.Redis.set(`xd:kattah:banned:${channel.id}`, '1', 0);
		ChannelsArray.push({ id: channel.id, username: channel.username });
	}

	let filterChannels = ChannelsArray.filter((channel) => !levelZeroArray.includes(channel.id));

	for (const channel of filterChannels) {
		if (!client.joinedChannels.has(channel.username)) {
			await new Promise((resolve) => setTimeout(resolve, 8));
			client.join(channel.username);
		}
	}
};

module.exports = { main };
