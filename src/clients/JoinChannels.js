const { client } = require('../util/twitch/connections.js');

const main = async () => {
	const levelZeros = await bot.DB.users.find({ level: 0 }).exec();
	for (const levelZero of levelZeros) {
		await bot.Redis.set(`xd:kattah:banned:${levelZero.id}`, '1', 0);
	}

	let ChannelsArray = [];
	const channels = await bot.DB.channels.find({ isChannel: true }).exec();
	for (const channel of channels) {
		ChannelsArray.push({ id: channel.id, username: channel.username });
	}

	for (const channel of ChannelsArray) {
		const channelData = await bot.Redis.get(`xd:kattah:banned:${channel.id}`);
		if (channelData === '1') {
			console.log(channelData);
			continue;
		}
		console.log(channel);
		if (!client.joinedChannels.has(channel.username)) {
			await new Promise((resolve) => setTimeout(resolve, 8));
			client.join(channel.username);
		}
	}
};

module.exports = { main };
