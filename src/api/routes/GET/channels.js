const express = require('express');
const router = express.Router();

async function returnChannelCount() {
    const channels = await bot.DB.channels.count({ isChannel: true }).exec();
    return channels;
}

async function returnUsersCount() {
    const users = await bot.DB.users.count({}).exec();
    return users;
}

async function returnPoroCount() {
    const poroData = await bot.DB.poroCount.find({}).exec();
    let sum = 0;
    for (const xd of poroData) {
        sum += xd.poroCount;
    }

    return sum;
}

let channelCount = new Number(0);
let userCount = new Number(0);
let poroCount = new Number(0);

setInterval(async () => {
    console.log('cache users');
    returnChannelCount().then((x) => {
        channelCount = x;
    });
    returnUsersCount().then((x) => {
        userCount = x;
    });
    returnPoroCount().then((x) => {
        poroCount = x;
    });
}, 1000 * 30);

router.get('/api/bot/channels', async (req, res) => {
    const todaysCode = await bot.DB.private.findOne({ code: 'code' }).exec();

    return res.status(200).json({
        channelCount: channelCount,
        totalPoros: poroCount,
        todaysCode: todaysCode.todaysCode,
        seenUsers: userCount,
    });
});

module.exports = router;
