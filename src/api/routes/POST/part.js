const express = require('express');
const router = express.Router();
const { client } = require('../../../util/twitch/connections');
const { middleWare } = require('../../middleWare');
const { limiter } = require('../../rateLimit');

router.post('/api/bot/part', limiter, middleWare, async (req, res) => {
	const { id, login } = req.user;
	const channelInfo = await bot.DB.channels.findOne({ id: id }).exec();
	if (!channelInfo || !channelInfo.isChannel) {
		return res.status(404).json({
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
			message: 'Failed to part chat.' + err,
		});
	}

	return res.status(200).json({
		success: true,
		message: 'Parted channel.',
	});
});

module.exports = router;
