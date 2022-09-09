const fetch = require('node-fetch')
const utils = require('../util/utils.js');

module.exports = {
    name: 'test',
    cooldown: 5000,
    description: 'Test',
    execute: async(message, args, client) => {
        let channels2 = [];
        const getEmebed = async() => {
            const channels = await fetch('https://api.poros.lol/api/bot/channels').then((res) => res.json());
            utils.Shuffle(channels.channels);
            const randomLiveStreamer = channels.channels.map((stream) => stream);
            const randomSliced = randomLiveStreamer.splice(Math.floor(Math.random() * randomLiveStreamer.length), 100);
            const streams = await fetch(`https://api.twitch.tv/helix/streams?user_login=${randomSliced.join('&user_login=')}`, {
                    headers: {
                        'Client-ID': process.env.CLIENT_ID,
                    'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
                    }
                }).then((res) => res.json());
            const streamers = streams.data.map((stream) => stream.user_name);
            const chooseOneStream = streamers[Math.floor(Math.random() * streamers.length)] ?? null;
            channels2.push(chooseOneStream)
            return chooseOneStream != null ? chooseOneStream : getEmebed();
        }
        await getEmebed();
        console.log(channels2.find(x => x != null))
    }
}