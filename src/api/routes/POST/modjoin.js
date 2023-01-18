const express = require('express');
const router = express.Router();
const { client } = require('../../../util/twitch/connections');
const { middleWare } = require('../../middleWare');
const { IDByLogin, IVRByLogin } = require('../../../util/twitch/utils');
const { newChannel } = require('../../../util/discord/discord');
const { limiter } = require('../../rateLimit');

async function returnUserLevelByID(id) {
	const userLevel = await bot.DB.users.findOne({ id: id }).exec();
	return userLevel;
}

async function returnUserLevelByUsername(username) {
	const userLevel = await bot.DB.users.findOne({ username: username }).exec();
	return userLevel;
}

async function returnTargetChannel(username) {
	const channelInfo = await bot.DB.channels.findOne({ username: username }).exec();
	return channelInfo;
}

async function createChannel(channel, addedUser, addedID) {
	const getUserID = await IDByLogin(channel);
	const newChannel = new bot.DB.channels({
		username: channel.toLowerCase(),
		id: getUserID,
		joinedAt: new Date(),
		isChannel: true,
		addedBy: [
			{
				username: addedUser,
				id: addedID,
				addedAt: new Date(),
			},
		],
	});
	return await newChannel.save();
}

async function reJoin(channelID, newName, newID) {
	await bot.DB.channels
		.findOneAndUpdate(
			{ id: channelID },
			{
				$set: {
					isChannel: true,
					addedBy: {
						username: newName,
						id: newID,
						addedAt: new Date(),
					},
				},
			},
		)
		.exec();
}

async function givePoros(id) {
	const poroInfo = await bot.DB.poroCount.findOne({ id: id }).exec();
	if (poroInfo) {
		await bot.DB.poroCount.findOneAndUpdate({ id: id }, { $inc: { poroCount: 30 } }).exec();
	}
}

router.post('/api/bot/mod/join/:channel', limiter(5000, 1), middleWare, async (req, res, next) => {
	const { channel } = req.params;
	const TwitchInfo = await IVRByLogin(channel);
	if (!TwitchInfo || TwitchInfo.banned === true || TwitchInfo === null) {
		return res.status(400).json({
			success: false,
			message: 'malformed username parameter',
		});
	}

	const { id, login } = req.user;
	const getSelfLevel = await returnUserLevelByID(id);
	const getTargetLevel = await returnUserLevelByUsername(channel);
	if (getSelfLevel?.level < 1 || getTargetLevel?.level < 1) {
		return res.status(403).json({
			success: false,
			message: 'Forbidden',
		});
	}

	const channelMods = await client.getMods(channel);
	if (!channelMods.includes(login)) {
		return res.status(403).json({
			success: false,
			message: 'You are not a moderator of this channel.',
		});
	}

	const channelInfo = await returnTargetChannel(channel);
	if (!channelInfo || channelInfo === null) {
		try {
			await givePoros(id);
			await createChannel(channel, login, id);
			await newChannel(channel, new Date(), login);
			await client.join(channel);
			await client.say(
				channel,
				`Joined channel by Moderator ${login}, kattahPoro Also check https://docs.poros.lol for more info! If you believe this was a mistake, please type |part in chat.`,
			);

			return res.status(200).json({
				success: true,
				message: 'Joined channel.',
			});
		} catch (err) {
			return res.status(500).json({
				success: false,
				message: 'Internal Server Error',
			});
		}
	}

	if (channelInfo.isChannel === false) {
		try {
			await reJoin(channelInfo.id, login, id);
			await client.join(channel);
			await client.say(
				channel,
				`Re-Joined channel by Moderator ${login}, kattahPoro Also check https://docs.poros.lol for more info! If you believe this was a mistake, please type |part in chat.`,
			);

			return res.status(200).json({
				success: true,
				message: 'Re-Joined channel.',
			});
		} catch (err) {
			return res.status(500).json({
				success: false,
				message: 'Internal Server Error',
			});
		}
	}

	return res.status(200).json({
		success: false,
		message: 'Already joined channel.',
	});
});

module.exports = router;
