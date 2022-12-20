const { client } = require('../util/twitch/connections.js');
const { Logger, LogLevel } = require('../misc/logger');

const main = async () => {
	const channels = await bot.DB.channels.find({ isChannel: true }).exec();
	for (const channel of channels) {
		try {
			client.join(channel.username);
		} catch (err) {
			Logger.log(LogLevel.ERROR, `Failed to join channel ${channel.username}`, err);
		}
	}
};

module.exports = { main };
