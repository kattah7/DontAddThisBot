const { ChatClient, AlternateMessageModifier, SlowModeRateLimiter } = require('@kararty/dank-twitch-irc');
require('dotenv').config();

const client = new ChatClient({
	username: process.env.TWITCH_USERNAME,
	password: process.env.TWITCH_OAUTH,
	rateLimits: 'verifiedBot',
	ignoreUnhandledPromiseRejections: true,
	connectionRateLimits: {
		parallelConnections: 6,
		releaseTime: 1000,
	},
});

client.use(new AlternateMessageModifier(client));
client.use(new SlowModeRateLimiter(client, 10));
client.connect();

module.exports = { client };
