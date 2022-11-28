const express = require('express');
const router = express.Router();

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

async function returnPoroCount() {
    const poroData = await bot.DB.poroCount.find({}).exec();
    let sum = 0;
    for (const xd of poroData) {
        sum += xd.poroCount;
    }

    return sum;
}

let channels = new Array();
let channelCount = new Number(0);
let userCount = new Number(0);
let commandsCount = new Number(0);
let poroCount = new Number(0);

setInterval(async () => {
    console.log('cache users');
    returnChannels(true).then((x) => {
        channels = x;
    });
    returnChannelCount().then((x) => {
        channelCount = x;
    });
    returnUsersCount().then((x) => {
        userCount = x;
    });
    returnExecutedCommands().then((x) => {
        commandsCount = x;
    });
    returnPoroCount().then((x) => {
        poroCount = x;
    });
}, 1000 * 30);

router.get('/api/bot/channels', async (req, res) => {
    const mapped = channels.map((x) => x.username);

    const todaysCode = await bot.DB.private.findOne({ code: 'code' }).exec();

    return res.status(200).json({
        channelCount: channelCount,
        channels: mapped,
        totalPoros: poroCount,
        todaysCode: todaysCode.todaysCode,
        embedStream: 'forsen',
        executedCommands: commandsCount,
        seenUsers: userCount,
    });
});

module.exports = router;