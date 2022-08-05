const express = require('express');

const router = express.Router();
const humanizeDuration = require('../../humanizeDuration');

router.get('/lookup/:user', async (req, res) => {
    if (!req.params.user) {
        return res.status(400).send('No user specified');
    }

    const lastUsage = await bot.Redis.get(`poro:${req.params.user}`);

    if (lastUsage) {
        res.json({
            cooldown: true,
            ms: Date.now() - lastUsage,
        });
    } else {
        res.json({
            cooldown: false,
        });
    }
});

module.exports = router;
