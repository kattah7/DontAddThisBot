const express = require('express');
const router = express.Router();

let leaderboards = [];
let loserboards = [];

setInterval(async () => {
    const poroData = await bot.DB.poroCount.find({}).exec();
    const count = await bot.DB.poroCount.count({}).exec();
    const topUsers = poroData
        .filter((a) => a.poroPrestige > 0)
        .sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroRank - a.poroRank || b.poroCount - a.poroCount);

    leaderboards = topUsers.slice(0, 10);
    loserboards = topUsers.slice(count - 10, count);
}, 1000 * 30);

router.get('/api/bot/leaderboard', async (req, res) => {
    const keys = Object.keys(req.query)[0];

    if (!keys) {
        const leaderboard = leaderboards.map((a) => {
            return {
                username: a.username,
                poroCount: a.poroCount,
                poroPrestige: a.poroPrestige,
                poroRank: a.poroRank,
            };
        });

        return res.status(200).json({
            success: true,
            topUsers: leaderboard,
        });
    }

    if (keys !== 'type') {
        return res.status(400).json({
            success: false,
            error: 'Invalid query',
        });
    }

    const { type } = req.query;

    if (type === 'lowest') {
        const loser = loserboards
            .map((a) => {
                return {
                    username: a.username,
                    poroCount: a.poroCount,
                    poroPrestige: a.poroPrestige,
                    poroRank: a.poroRank,
                };
            })
            .reverse();

        return res.status(200).json({
            success: true,
            topUsers: loser,
        });
    }

    return res.status(400).json({
        success: false,
        error: 'Invalid type',
    });
});

module.exports = router;
