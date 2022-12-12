const { client } = require('../util/twitch/connections.js');

const PART = async function () {
	client.on('PART', async ({ channelName }) => {
		Logger.info(`Left channel ${channelName}`);
	});
};

module.exports = { PART };
