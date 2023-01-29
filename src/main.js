// ██████╗  ██████╗ ███╗   ██╗████████╗ █████╗ ██████╗ ██████╗ ████████╗██╗  ██╗██╗███████╗██████╗  ██████╗ ████████╗
// ██╔══██╗██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██║  ██║██║██╔════╝██╔══██╗██╔═══██╗╚══██╔══╝
// ██║  ██║██║   ██║██╔██╗ ██║   ██║   ███████║██║  ██║██║  ██║   ██║   ███████║██║███████╗██████╔╝██║   ██║   ██║
// ██║  ██║██║   ██║██║╚██╗██║   ██║   ██╔══██║██║  ██║██║  ██║   ██║   ██╔══██║██║╚════██║██╔══██╗██║   ██║   ██║
// ██████╔╝╚██████╔╝██║ ╚████║   ██║   ██║  ██║██████╔╝██████╔╝   ██║   ██║  ██║██║███████║██████╔╝╚██████╔╝   ██║
// ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝╚══════╝╚═════╝  ╚═════╝    ╚═╝

const { Logger, LogLevel } = require('./misc/logger.js');
const { ConfigSchema } = require('./validators/ConfigSchema.js');
const result = ConfigSchema.validate(require('../config.json'));
if (result.error) {
	Logger.log(LogLevel.ERROR, result.error.message);
	process.exit(1);
}

const nodeCron = require('node-cron');
const { client } = require('./util/twitch/connections.js');
const pubsub = require('./util/twitch/pubSub.js');
const { Twitch } = require('./clients/twitch.js');
const { bannedChannels } = require('./util/twitch/bannedChannels');
const { SocketConnection } = require('./token/socket.js');

global.bot = {};
bot.Redis = require('./database/redis.js');
bot.DB = require('./database/db.js');
bot.Utils = require('./misc');
bot.SQL = require('./database/postgres.js');

require('./api/server');

client.on('ready', async () => {
	Logger.log(LogLevel.SILLY, 'Connected to chat!');
	pubsub.init();
	nodeCron.schedule('5 */2 * * *', () => {
		client.say('kattah', '!cookie');
	});
	Twitch();

	await bannedChannels();
	await SocketConnection(7777);
});

client.on('372', (msg) => Logger.log(LogLevel.INFO, `Server MOTD is: ${msg.ircParameters[1]}`));

client.on('close', (err) => {
	if (err != null) {
		Logger.log(LogLevel.ERROR, 'Client closed due to error', err);
	}
	process.exit(0);
});
