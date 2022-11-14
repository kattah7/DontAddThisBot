const express = require('express');
const router = express.Router();

router.get('/api/bot/leaderboard', async (req, res) => {
    const poroData = await bot.DB.poroCount.find({}).exec();
    const topUsers = poroData
        .filter((a) => a.poroPrestige > -1)
        .sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroRank - a.poroRank || b.poroCount - a.poroCount)
        .slice(0, 10)
        .map((user) => {
            return {
                username: user.username,
                poroPrestige: user.poroPrestige,
                poroRank: user.poroRank,
                poroCount: user.poroCount,
            };
        });

    return res.status(200).json({
        topUsers: topUsers,
    });
});

module.exports = router;
