const express = require('express');
const router = express.Router();
const { middleWare } = require('../../middleWare');
const { iso6391LanguageCodes } = require('../../../util/google/translate');

async function updateLanguage(language, userID) {
	await bot.SQL.query(`UPDATE users SET language = '${language}' WHERE twitch_id = '${userID}'`);
}

router.put('/api/bot/language', middleWare, async (req, res) => {
	const { language } = req.body;
	if (!language || !Object.values(iso6391LanguageCodes).includes(language)) {
		return res.status(400).json({
			success: false,
			message: 'Unknown Language',
		});
	}

	const { id } = req.user;
	try {
		await updateLanguage(language, id);
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error',
		});
	}

	return res.status(200).json({
		success: true,
		message: `Langauge set to ${language}`,
	});
});

module.exports = router;
