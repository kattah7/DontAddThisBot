const express = require('express');
const router = express.Router();
const { middleWare } = require('../../middleWare');

router.post('/api/bot/create', middleWare, async (req, res) => {
	const { id, login } = req.user;
	if (!login || !/^[A-Z_\d]{2,30}$/i.test(login)) {
		return res.status(400).json({
			success: false,
			message: 'malformed username parameter',
		});
	}

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
