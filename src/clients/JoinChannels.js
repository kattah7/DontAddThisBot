const { client } = require('../util/twitch/connections.js');

const main = async () => {
	const channels = await bot.DB.channels.find({ isChannel: true }).exec();
	for (const channel of channels) {
		try {
			client.join(channel.username);
		} catch (err) {
			Logger.error(`Failed to join channel ${channel.username}`, err);
		}
	}
};

module.exports = { main };
