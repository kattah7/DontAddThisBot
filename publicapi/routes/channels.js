const express = require('express');
const router = express.Router();

router.get('/api/bot/channels', async (req, res) => {
    const channels = await bot.DB.channels.find({}).exec();
    const mapped = channels.map(x => x.username)
    const poroData = await bot.DB.poroCount.find({}).exec();
    let sum = 0;
    for (const xd of poroData) {
        sum += xd.poroCount;
    }
    return res.status(200).json({
        channelCount: channels.length,
        channels: mapped,
        totalPoros: sum,
    });
})

module.exports = router;