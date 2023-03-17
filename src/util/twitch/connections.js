const { ChatClient, AlternateMessageModifier, SlowModeRateLimiter, ConnectionPool } = require('@kararty/dank-twitch-irc');
const { twitch } = require('../../../config.json');

const client = new ChatClient({
	username: twitch.username,
	password: twitch.oauth,
	rateLimits: 'verifiedBot',
	ignoreUnhandledPromiseRejections: true,
	maxChannelCountPerConnection: 1,
	installDefaultMixins: true,
	connectionRateLimits: {
		parallelConnections: 5,
		releaseTime: 1000,
	},
	connection: {
		type: 'websocket',
		secure: true,
	},
});

client.use(new AlternateMessageModifier(client));
client.use(new SlowModeRateLimiter(client, 10));
// client.use(
// 	new ConnectionPool(client, {
// 		poolSize: 100,
// 	}),
// );
client.connect();

module.exports = { client };
