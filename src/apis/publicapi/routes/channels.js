const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/api/bot/channels', async (req, res) => {
    function shuffle(array) {
        let currentIndex = array.length,
            randomIndex;

        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    async function returnChannels(totalChannels) {
        const isTotal = totalChannels ? { isChannel: true } : {};
        const channels = await bot.DB.channels.find(isTotal).exec();
        return channels;
    }

    async function returnChannelCount() {
        const channels = await bot.DB.channels.count({ isChannel: true }).exec();
        return channels;
    }

    async function returnUsersCount() {
        const users = await bot.DB.users.count({}).exec();
        return users;
    }

    async function returnExecutedCommands() {
        let commands = 0;
        const channels = await returnChannels(false);
        for (const { commandsUsed } of channels) {
            if (commandsUsed.length == 0) continue;
            commandsUsed.forEach((command) => {
                commands += command.Usage;
            });
        }

        return commands;
    }

    const channels = await returnChannels(true);
    const channelCount = await returnChannelCount();
    const userCount = await returnUsersCount();
    const commandsCount = await returnExecutedCommands();

    let channels2 = [];
    const mapped = channels.map((x) => x.username);
    const getEmebed = async () => {
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
        channelCount: channelCount,
        channels: mapped,
        totalPoros: sum,
        todaysCode: todaysCode.todaysCode,
        embedStream: channels2.find((x) => x != null),
        executedCommands: commandsCount,
        seenUsers: userCount,
    });
});

module.exports = router;
