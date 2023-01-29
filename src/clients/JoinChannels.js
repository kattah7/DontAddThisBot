const { client } = require('../util/twitch/connections.js');

const main = async () => {
	let ChannelsArray = [];
	const channels = await bot.DB.channels.find({ isChannel: true }).exec();
	for (const channel of channels) {
		const findUser = await bot.DB.users.findOne({ id: channel.id }).exec();
		if (findUser?.level === 0 || !findUser) continue;
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
