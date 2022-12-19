const { client } = require('../util/twitch/connections.js');
const { Logger, LogLevel } = require('../misc/logger');

const PART = async function () {
	client.on('PART', async ({ channelName }) => {
		Logger.log(LogLevel.WARN, `Left channel ${channelName}`);
	});
};

module.exports = { PART };
