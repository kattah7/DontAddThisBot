const Redis = require('ioredis');
const redis = new Redis({});
const humanizeDuration = require('../util/humanizeDuration');

module.exports = {
    tags: 'stats',
    name: 'ping',
    aliases: ['xd'],
    cooldown: 3000,
    description: 'Bot response',
    poro: true,
    stvOnly: true,
    execute: async (message, args, client) => {
        const redisValue = await redis.get('channelsEndpoint');
        const { channelCount, totalPoros, executedCommands } = JSON.parse(redisValue);
        const ping1 = performance.now();
        await client.ping();
        const ping2 = performance.now();
        const actualPing = (ping2 - ping1).toFixed(2);
        return {
            text: `${message.senderUsername}, kattahPoro 🏓 BOT UPTIME: ${humanizeDuration(
                process.uptime() * 1000
            )} - PING: ${actualPing} - Channels: ${channelCount} - Executed Commands: ${executedCommands} - Total Poros: ${totalPoros}`,
        };
    },
};
