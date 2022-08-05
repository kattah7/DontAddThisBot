const express = require('express');

const router = express.Router();
const humanizeDuration = require('../../humanizeDuration');

router.get('/lookup/:user', async (req, res) => {
    if (!req.params.user) {
        return res.status(400).send('No user specified');
    }

    const channelData = await bot.DB.poroCount.findOne({ username: req.params.user }).exec();

    if (channelData) {
        res.json({
            username: channelData.username,
        });
    } else {
        res.json({
            Error: 'Not Found',
        });
    }
});

module.exports = router;
