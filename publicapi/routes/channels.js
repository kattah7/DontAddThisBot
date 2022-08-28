const express = require('express');
const router = express.Router();

router.get('/api/bot/channels', async (req, res) => {
    const channels = await bot.DB.channels.find({ isChannel: true }).exec();
    const mapped = channels.map(x => x.username)
    const poroData = await bot.DB.poroCount.find({}).exec();
    const todaysCode = await bot.DB.private.findOne({ code: "code" }).exec();
    let sum = 0;
    for (const xd of poroData) {
        sum += xd.poroCount;
    }
    return res.status(200).json({
        channelCount: channels.length,
        channels: mapped,
        totalPoros: sum,
        todaysCode: todaysCode.todaysCode,
    });
})

module.exports = router;