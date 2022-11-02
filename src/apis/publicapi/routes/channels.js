const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/api/bot/channels', async (req, res) => {
    function shuffle(array) {
        let currentIndex = array.length,
            randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    let channels2 = [];
    const channels = await bot.DB.channels.find({ isChannel: true }).exec();
    const mapped = channels.map((x) => x.username);
    const getEmebed = async () => {
        const channels = await bot.DB.channels.find({ isChannel: true }).exec();
        shuffle(channels);
        const mapped = channels.map((x) => x.username);
        const randomSliced = mapped.splice(Math.floor(Math.random() * mapped.length), 100);
        const streams = await fetch(
            `https://api.twitch.tv/helix/streams?user_login=${randomSliced.join('&user_login=')}`,
            {
                headers: {
                    'Client-ID': process.env.CLIENT_ID,
                    'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                },
            }
        ).then((res) => res.json());
        const streamers = streams.data.map((stream) => stream.user_name);
        const chooseOneStream = streamers[Math.floor(Math.random() * streamers.length)] ?? null;
        channels2.push(chooseOneStream);
        return chooseOneStream != null ? chooseOneStream : getEmebed();
    };
    await getEmebed();

    const poroData = await bot.DB.poroCount.find({}).exec();
    const todaysCode = await bot.DB.private.findOne({ code: 'code' }).exec();

    let sum = 0;
    for (const xd of poroData) {
        sum += xd.poroCount;
    }

    return res.status(200).json({
        channelCount: channels.length,
        channels: mapped,
        totalPoros: sum,
        todaysCode: todaysCode.todaysCode,
        embedStream: channels2.find((x) => x != null),
    });
});

module.exports = router;
