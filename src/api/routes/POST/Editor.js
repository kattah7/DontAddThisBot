const express = require('express');
const router = express.Router();
const { middleWare } = require('../../middleWare');
const { getAvatar } = require('../../getAvatar');
const { limiter } = require('../../rateLimit');

async function getUser(username) {
	const user = await fetch(`https://api.ivr.fi/v2/twitch/user?login=${username}`, {
		method: 'GET',
		'Content-Type': 'application/json',
		'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
	}).then((res) => res.json());
	if (!user || user.length === 0 || user === null) return;
	return user[0];
}

router.post('/api/bot/editor', limiter(2500, 5), middleWare, async (req, res) => {
	const { id } = req.user;
	const { channelID, targetID, type, targetUser } = req.body;
	if (id !== channelID) {
		return res.status(401).json({
			success: false,
			message: 'Unauthorized',
		});
	}

	const channelInfo = await bot.DB.channels.findOne({ id: channelID }).exec();
	if (!channelInfo || !channelInfo.isChannel) {
		return res.status(404).json({
			success: false,
			message: 'Channel not found.',
		});
	}

	if (type !== 'REMOVE' && type !== 'ADD') {
		return res.status(400).json({
			success: false,
			message: 'Invalid type.',
		});
	}

	if (type === 'REMOVE') {
		const found = channelInfo.editors.find((editor) => editor.id === targetID);
		if (!found) {
			return res.status(400).json({
				success: false,
				message: 'Editor not found.',
			});
		}

		try {
			await channelInfo.updateOne({ $pull: { editors: { id: targetID } } });
			const newState = await bot.DB.channels.findOne({ id: channelID }).exec();
			const editors = await getAvatar(newState.editors);

			return res.status(200).json({
				success: true,
				data: {
					editors,
				},
			});
		} catch (err) {
			return res.status(500).json({
				success: false,
				message: 'Internal Server Error',
			});
		}
	} else if (type === 'ADD') {
		const userID = await getUser(targetUser);
		if (!userID) {
			return res.status(400).json({
				success: false,
				message: 'User not found.',
			});
		}

		if (userID.id === channelID || userID.id === '790623318') {
			return res.status(400).json({
				success: false,
				message: "You can't add the channel owner or the bot.",
			});
		}

		if (channelInfo.editors.length >= 40) {
			return res.status(400).json({
				success: false,
				message: 'You can only have 40 editors.',
			});
		}

		const findThatEditor = channelInfo.editors.find((editor) => editor.id === userID.id);
		if (findThatEditor) {
			return res.status(400).json({
				success: false,
				message: 'Editor already exists.',
			});
		}

		try {
			await channelInfo.updateOne({ $addToSet: { editors: { id: userID.id, username: targetUser, grantedAt: new Date() } } });
			const newChannelState = await bot.DB.channels.findOne({ id: channelID }).exec();
			const editors = await getAvatar(newChannelState.editors);

			return res.status(200).json({
				success: true,
				data: {
					editors,
				},
			});
		} catch (err) {
			return res.status(500).json({
				success: false,
				message: 'Internal Server Error',
			});
		}
	}

	return res.status(200).json({
		success: true,
		message: 'Removed editor.',
	});
});

module.exports = router;
