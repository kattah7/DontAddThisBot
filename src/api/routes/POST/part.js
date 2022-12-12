const express = require('express');
const router = express.Router();
const { client } = require('../../../util/twitch/connections');
const { middleWare } = require('../../middleWare');

router.post('/api/bot/part', middleWare, async (req, res) => {
	const { id, login } = req.user;
	if (!login || !/^[A-Z_\d]{2,30}$/i.test(login)) {
		return res.status(400).json({
			success: false,
			message: 'malformed username parameter',
		});
	}

	const channelInfo = await bot.DB.channels.findOne({ id: id }).exec();
	if (!channelInfo) {
		return res.status(404).json({
			success: false,
			message: 'Channel not found.',
		});
	}

	if (!channelInfo.isChannel) {
		return res.status(400).json({
			success: false,
			message: 'Channel not found.',
		});
	}

	try {
		await client.say(login, `Parted channel, ${login} 👋`);
		await client.part(login);
		await bot.DB.channels.findOneAndUpdate({ id: id }, { $set: { isChannel: false } }).exec();
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Failed to part chat.',
		});
	}

	return res.status(200).json({
		success: true,
		message: 'Parted channel.',
	});
});

module.exports = router;
