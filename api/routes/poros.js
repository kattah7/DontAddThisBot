const express = require('express');

const router = express.Router();
const humanizeDuration = require('../../humanizeDuration');

router.get('/lookup/:user', async (req, res) => {
    if (!req.params.user) {
        return res.status(400).send('No user specified');
    }

    const lastUsage = await bot.Redis.get(`poro:${req.params.user}`);

    if (lastUsage) {
        const ms = new Date().getTime() + 1000 * 60 * 60 * 2 - new Date(lastUsage).getTime();
        const divided = (ms / 1000).replace(/\.\d+/, '');
        res.json({
            cooldown: true,
            ms: divided,
        });
    } else {
        res.json({
            cooldown: false,
        });
    }
});

module.exports = router;
