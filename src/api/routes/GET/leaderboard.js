const express = require('express');
const router = express.Router();
const Redis = require('ioredis');
const redis = new Redis({});

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

async function makeRequest() {
	console.log('Updated leaderboard endpoint');
	await redis.set(
		'leaderboardEndpoint',
		JSON.stringify({
			leaderboards: await getLeaderboard(),
			loserboards: await getLoserboard(),
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
					userRank:
						totalUsers -
						[...loserboards]
							.reverse()
							.indexOf(
								a,
							),
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
