const express = require('express');
const router = express.Router();
const { middleWare } = require('../../middleWare');
const { handleEditor } = require('../../handleEditor');

router.put('/api/bot/offline', middleWare, handleEditor, async (req, res) => {
	const { channelID } = req.body;
	const getChannel = await bot.DB.channels.findOne({ id: channelID }).exec();
	if (!getChannel) {
		return res.status(404).json({
			success: false,
			message: 'Channel not found',
		});
	}

	let { offlineOnly } = getChannel;
	try {
		if (offlineOnly === null || !offlineOnly) {
			await bot.DB.channels.findOneAndUpdate({ id: channelID }, { offlineOnly: true }).exec();
			offlineOnly = true;
		} else if (offlineOnly) {
			await bot.DB.channels.findOneAndUpdate({ id: channelID }, { offlineOnly: false }).exec();
			offlineOnly = false;
		}
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}

	return res.status(200).json({
		success: true,
		message: `${offlineOnly ? 'Enabled' : 'Disabled'} offline only mode`,
		data: {
			offlineOnly,
		},
	});
});

module.exports = router;
