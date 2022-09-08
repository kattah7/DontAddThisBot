const fetch = require('node-fetch');

module.exports = {
    name: "islive",
    cooldown: 5000,
    description: "Check if a user is live",
    execute: async (message, args, client) => {
        const botChannels = await bot.DB.channels.find({ isChannel: true });
        const channels = botChannels.map((channel) => channel.username);
        const streams = await fetch(`https://api.twitch.tv/helix/streams?user_login=${channels.join('&user_login=')}`, {
            headers: {
                'Client-ID': process.env.CLIENT_ID,
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
            }
        }).then((res) => res.json());
        const streamers = streams.data.map((stream) => stream.user_name);
        const chooseOneStream = streamers[Math.floor(Math.random() * streamers.length)];
        console.log(chooseOneStream)
    
    }
}