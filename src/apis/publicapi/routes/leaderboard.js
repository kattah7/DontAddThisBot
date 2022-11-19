const express = require('express');
const router = express.Router();

async function getLeaderboard() {
    const poroData = await bot.DB.poroCount.find({}).exec();
    const topUsers = poroData
        .sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroRank - a.poroRank || b.poroCount - a.poroCount)
        .slice(0, 10);

    return topUsers;
}

async function getLoserboard() {
    const poroData = await bot.DB.poroCount.find({}).exec();
    const count = await bot.DB.poroCount.count({}).exec();
    const sorted = poroData.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount);
    const losers = sorted.slice(count - 10, count);
    return losers;
}

let leaderboards = new Array();
let loserboards = new Array();
let totalUsers = new Number(0);

setInterval(async () => {
    console.log('cache leaderboard');
    leaderboards = await getLeaderboard();
    loserboards = await getLoserboard();
    totalUsers = await bot.DB.poroCount.count({}).exec();
}, 1000 * 30);

router.get('/api/bot/leaderboard', async (req, res) => {
    const keys = Object.keys(req.query)[0];

    if (!keys) {
        const leaderboard = leaderboards.map((a, index) => {
            return {
                username: a.username,
                poroCount: a.poroCount,
                poroPrestige: a.poroPrestige,
                poroRank: a.poroRank,
                joinedAt: a.joinedAt,
                userRank: index + 1,
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
            .map((a, index) => {
                return {
                    username: a.username,
                    poroCount: a.poroCount,
                    poroPrestige: a.poroPrestige,
                    poroRank: a.poroRank,
                    joinedAt: a.joinedAt,
                    userRank: totalUsers - [...loserboards].reverse().indexOf(a),
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
