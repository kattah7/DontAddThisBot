const express = require('express');
const router = express.Router();

router.get('/api/bot/leaderboard', async (req, res) => {
    const poroData = await bot.DB.poroCount.find({}).exec();
    const topUsers = poroData
        .sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount)
        .slice(0, 10)
        .map((user) => `[P:${user.poroPrestige}] ${user.username} - ${user.poroCount}`);

    return res.status(200).json({
        topUsers: topUsers,
    });
});

module.exports = router;
