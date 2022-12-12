const Redis = require('ioredis');
const redis = new Redis({});
const humanizeDuration = require('../util/humanizeDuration');

module.exports = {
	tags: 'stats',
	name: 'ping',
	aliases: ['xd'],
	cooldown: 3000,
	description: 'Bot response',
	execute: async (message, args, client) => {
		const redisValue = await redis.get('channelsEndpoint');
		const { channelCount } = JSON.parse(redisValue);
		const uptime = humanizeDuration(process.uptime() * 1000);
		return {
			text: `@${message.senderUsername}, DontAddThisBot has been online for (${uptime}) in ${channelCount} channels! kattahSilly`,
		};
	},
};
