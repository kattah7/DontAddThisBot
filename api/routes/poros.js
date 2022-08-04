const express = require('express');

const router = express.Router();
const humanizeDuration = require('../../humanizeDuration');

router.get('/lookup/:user', async (req, res) => {
    if (!req.params.user) {
        return res.status(400).send('No user specified');
    }

    const lastUsage = await bot.Redis.get(`poro:${req.params.user}`);

    if (lastUsage) {
        var today = new Date();
        const timestamp = new Date(lastUsage);
        const diffTime = Math.abs(today - timestamp);
        const timeLeft = humanizeDuration(diffTime - 1000 * 60 * 60 * 2);
        res.json({
            cooldown: true,
            lastUsage: timeLeft,
            kekw: lastUsage,
            kekw2: new Date(),
        });
    } else {
        res.json({
            cooldown: false,
        });
    }
});

module.exports = router;
