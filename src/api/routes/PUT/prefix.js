const express = require('express');
const router = express.Router();
const { middleWare } = require('../../middleWare');
const { handleEditor } = require('../../handleEditor');
const { racism, slurs } = require('../../../misc/regex');

router.put('/api/bot/prefix', middleWare, handleEditor, async (req, res) => {
	const { prefix, channelID } = req.body;
	const getChannel = await bot.DB.channels.findOne({ id: channelID }).exec();
	if (!getChannel) {
		return res.status(404).json({
			success: false,
			message: 'Channel not found',
		});
	}

	if (!prefix || !channelID) {
		return res.status(404).json({
			success: false,
			message: 'Prefix  or channelID not found.',
		});
	}

	if (prefix.length > 15) {
		return res.status(400).json({
			success: false,
			message: 'Prefix is too long.',
		});
	}

	if (prefix.startsWith('.') || prefix.startsWith('/')) {
		return res.status(400).json({
			success: false,
			message: 'Prefix is reserved for Twitch commands.',
		});
	}

	if (racism.test(prefix) || slurs.test(prefix)) {
		return res.status(400).json({
			success: false,
			message: 'Prefix contains a banned word.',
		});
	}

	try {
		await bot.DB.channels.findOneAndUpdate({ id: channelID }, { $set: { prefix: prefix } }).exec();
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}

	return res.status(200).json({
		success: true,
		message: `Prefix updated to ${prefix}`,
		data: {
			prefix,
		},
	});
});

module.exports = router;
