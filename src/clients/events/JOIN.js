const { client } = require('../../util/twitch/connections.js');
const { Logger, LogLevel } = require('../../misc/logger');

const JOIN = async function () {
	client.on('JOIN', async ({ channelName }) => {
		Logger.log(LogLevel.INFO, `Joined channel ${channelName}`);
	});
};

module.exports = { JOIN };
