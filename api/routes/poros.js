const express = require('express');

const router = express.Router();
const humanizeDuration = require('../../humanizeDuration');

router.get('/lookup/:user', async (req, res) => {
    if (!req.params.user) {
        return res.status(400).send('No user specified');
    }

    const lastUsage = await bot.Redis.get(`poro:${req.params.user}`);

    if (lastUsage) {
        if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 2) {
            const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 2;
            res.json({
                cooldown: true,
                ms: humanizeDuration(ms),
            });
        }
    } else {
        res.json({
            cooldown: false,
        });
    }
});

module.exports = router;
