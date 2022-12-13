const { ChatClient, AlternateMessageModifier, SlowModeRateLimiter } = require('@kararty/dank-twitch-irc');
const { twitch } = require('../../../config.json');

const client = new ChatClient({
	username: twitch.username,
	password: twitch.oauth,
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
