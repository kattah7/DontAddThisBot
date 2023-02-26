const express = require('express');
const router = express.Router();
const { middleWare } = require('../../middleWare');
const { limiter } = require('../../rateLimit');

router.post('/api/bot/create', limiter(5000, 1), middleWare, async (req, res) => {
	const { id, login } = req.user;
	const userInfo = await bot.DB.users.findOne({ id: id }).exec();
	if (userInfo) {
		return res.status(400).json({
			success: false,
			message: 'user already exists',
		});
	} else {
		try {
			await bot.DB.users.create({
				id: id,
				username: login,
				firstSeen: new Date(),
				level: 1,
			});

			await bot.SQL.query(
				`INSERT INTO users (twitch_id, twitch_login) SELECT * FROM (SELECT '${id}', '${login}') AS tmp WHERE NOT EXISTS (SELECT twitch_id FROM users WHERE twitch_id = '${id}') LIMIT 1;`,
			);
		} catch (err) {
			return res.status(500).json({
				success: false,
				message: 'Failed to create user',
			});
		}

		return res.status(200).json({
			success: true,
			message: `User created`,
		});
	}
});

module.exports = router;
