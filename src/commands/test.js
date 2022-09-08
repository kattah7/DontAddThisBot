const fetch = require('node-fetch')

module.exports = {
    name: 'test',
    cooldown: 5000,
    description: 'Test',
    execute: async(message, args, client) => {
        const channels = await bot.DB.channels.find({ isChannel: true }).exec();
        const mapped = channels.map(x => x.username)
        const sliced = mapped.slice(0, 100)
        const streams = await fetch(`https://api.twitch.tv/helix/streams?user_login=${sliced.join('&user_login=')}`, {
                headers: {
                    'Client-ID': process.env.CLIENT_ID,
                 'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
                }
            }).then((res) => res.json());
        const streamers = streams.data.map((stream) => stream.user_name);
        const chooseOneStream = streamers[Math.floor(Math.random() * streamers.length)] ?? null;
    }
}