const express = require('express');
const router = express.Router();
const { middleWare } = require('../../middleWare');
const jwt = require('jsonwebtoken');

router.post('/logout', middleWare, async (req, res) => {
	const auth = req.headers.authorization;
	const token = auth && auth.split(' ')[1];

	try {
		await bot.SQL.query(`INSERT INTO logout_token (jwt_token) VALUES ('${token}')`);
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error',
		});
	}

	return res.status(200).json({
		success: true,
		message: 'Logged out',
	});
});

module.exports = router;
