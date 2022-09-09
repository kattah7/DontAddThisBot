const express = require('express');
const router = express.Router();
const fetch = require('node-fetch')
const utils = require('../../util/utils.js');

router.get('/api/bot/channels', async (req, res) => {
    const channels = await bot.DB.channels.find({ isChannel: true }).exec();
    const length = channels.length;
    utils.Shuffle(channels.username);
    const mapped = channels.map(x => x.username)
    const randomSliced = mapped.splice(Math.floor(Math.random() * mapped.length), 100);
    const streams = await fetch(`https://api.twitch.tv/helix/streams?user_login=${randomSliced.join('&user_login=')}`, {
            headers: {
                'Client-ID': process.env.CLIENT_ID,
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
            }
        }).then((res) => res.json());
    const streamers = streams.data.map((stream) => stream.user_name);
    const chooseOneStream = streamers[Math.floor(Math.random() * streamers.length)] ?? null;
    const poroData = await bot.DB.poroCount.find({}).exec();
    const todaysCode = await bot.DB.private.findOne({ code: "code" }).exec();

    let sum = 0;
    for (const xd of poroData) {
        sum += xd.poroCount;
    };

    return res.status(200).json({
        channelCount: length,
        channels: mapped,
        totalPoros: sum,
        todaysCode: todaysCode.todaysCode,
        embedStream: chooseOneStream
    });
})

module.exports = router;