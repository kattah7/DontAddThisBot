const express = require('express');
const router = express.Router();
const { readdirSync } = require('fs');

router.get('/api/bot/commands', async (req, res) => {
	let commands = [];
	for (let file of readdirSync('./src/commands').filter((file) => file.endsWith('.js'))) {
		let pull = require(`../../../commands/${file}`);
		if (pull?.level || pull?.kattah) continue;
		if (pull.name) {
			commands.push(pull);
		}
	}

	return res.status(200).json({
		success: true,
		commands,
	});
});

module.exports = router;
