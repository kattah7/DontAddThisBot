const Redis = require('ioredis');
const redis = new Redis({});
const humanizeDuration = require('../misc/humanizeDuration');

module.exports = {
	tags: 'stats',
	name: 'ping',
	aliases: ['xd'],
	cooldown: 3000,
	description: 'Bot response',
	execute: async (client, msg) => {
		const redisValue = await redis.get('channelsEndpoint');
		const { channelCount } = JSON.parse(redisValue);
		const uptime = humanizeDuration(process.uptime() * 1000);
		return {
			text: `DontAddThisBot has been online for (${uptime}) in ${channelCount} channels! kattahSilly`,
			reply: true,
		};
	},
};
