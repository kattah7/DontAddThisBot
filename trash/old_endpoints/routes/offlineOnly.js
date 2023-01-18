const expresss = require('express');
const router = expresss.Router();

router.post('/api/bot/offline', async (req, res) => {
	const { id } = req.query;
	if (!id) {
		return res.status(404).json({
			success: false,
			message: 'malformed id parameter',
		});
	}
	const actualUser = await bot.DB.users.findOne({ id: id }).exec();
	if (actualUser.level == 0) {
		return res.status(403).json({
			success: false,
			message: 'Forbidden',
		});
	}

	const channel = await bot.DB.channels.findOne({ id: id }).exec();
	if (!channel) {
		return res.status(404).json({
			success: false,
			message: 'channel not found',
		});
	}

	if (channel.offlineOnly) {
		try {
			await bot.DB.channels.updateOne({ id: id }, { $set: { offlineOnly: false } });
			return res.status(200).json({
				success: true,
				message: `${channel.username} is now online only`,
			});
		} catch (err) {
			return res.status(500).json({
				success: false,
				message: 'Failed to update',
			});
		}
	} else {
		try {
			await bot.DB.channels.updateOne({ id: id }, { $set: { offlineOnly: true } });
			return res.status(200).json({
				success: true,
				message: `${channel.username} is now offline only`,
			});
		} catch (err) {
			return res.status(500).json({
				success: false,
				message: 'Failed to update',
			});
		}
	}
});

module.exports = router;
