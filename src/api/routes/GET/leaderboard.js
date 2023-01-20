const express = require('express');
const router = express.Router();
const Redis = require('ioredis');
const redis = new Redis({});

async function getLeaderboard() {
	const topUsers = await bot.DB.poroCount.find().sort({ poroPrestige: -1, poroRank: -1, poroCount: -1 }).exec();
	return topUsers;
}

async function makeRequest() {
	const leaderboards = await getLeaderboard();
	const loserboards = leaderboards.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount);
	await redis.set(
		'leaderboardEndpoint',
		JSON.stringify({
			leaderboards: leaderboards,
			loserboards: loserboards,
			totalUsers: await bot.DB.poroCount.count({}).exec(),
		}),
	);
}

makeRequest().then(() => {
	setInterval(() => {
		makeRequest();
	}, 1000 * 60 * 1);
});

router.get('/api/bot/leaderboard', async (req, res) => {
	const keys = Object.keys(req.query)[0];
	const redisValue = await redis.get('leaderboardEndpoint');
	const { leaderboards, loserboards, totalUsers } = JSON.parse(redisValue);

	if (!keys) {
		const leaderboard = leaderboards.slice(0, 10).map((a, index) => {
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
			.reverse()
			.slice(0, 10)
			.map((a) => {
				return {
					username: a.username,
					poroCount: a.poroCount,
					poroPrestige: a.poroPrestige,
					poroRank: a.poroRank,
					joinedAt: a.joinedAt,
					userRank: totalUsers - [...loserboards].reverse().indexOf(a),
				};
			});

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
