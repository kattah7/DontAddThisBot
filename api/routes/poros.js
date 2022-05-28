const express = require("express");

const router = express.Router();

router.get("/lookup/:user", async (req, res) => {
    if (!req.params.user) {
        return res.status(400).send("No user specified");
    }

    const lastUsage = await bot.Redis.get(`poro:${req.params.user}`);

    if (!lastUsage) {
        res.json({
            cooldown: false,
        });
    } else {
        res.json({
            cooldown: true,
            lastUsage: lastUsage,
        });
    }
});

module.exports = router;