const express = require('express');
const router = express.Router();

router.get('/api/bot/channels', async (req, res) => {
    const channels = await bot.DB.channels.find({}).exec();
    const mapped = channels.map(x => x.username)
    return res.status(200).json({
        channels: mapped,
    });
})

module.exports = router;