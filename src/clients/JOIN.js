const { client } = require('../util/twitch/connections.js');

const JOIN = async function () {
	client.on('JOIN', async ({ channelName }) => {
		Logger.info(`Joined channel ${channelName}`);
	});
};

module.exports = { JOIN };
