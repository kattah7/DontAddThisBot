const express = require('express');
const router = express.Router();
const utils = require('../../../util/twitch/utils');
const { readdirSync } = require('fs');
const { getAvatar } = require('../../getAvatar');

router.get('/api/bot/channel/:user', async (req, res) => {
	const { user } = req.params;
	if (!user || !/^[A-Z_\d]{2,30}$/i.test(user)) {
		return res.status(400).json({
			success: false,
			message: 'malformed username parameter',
		});
	}

	const channelInfo = await bot.DB.channels.findOne({ id: await utils.IDByLogin(user) }).exec();
	if (!channelInfo) {
		return res.status(404).json({
			success: false,
			message: 'user not found',
		});
	}

	const editors = await getAvatar(channelInfo.editors);
	let commands = [];
	let filteredCommands = [];
	for (let file of readdirSync('./src/commands').filter((file) => file.endsWith('.js'))) {
		let pull = require(`../../../commands/${file}`);
		if (pull?.level || pull?.kattah) continue;
		if (pull.name) {
			commands.push(pull);
		}
	}

	const { rows: disabledCommands } = await bot.SQL.query(`SELECT command, aliases FROM channel_settings WHERE twitch_id = '${channelInfo.id}' AND is_disabled = 1`);

	commands.forEach((command) => {
		const found = disabledCommands.find((disabledCommand) => disabledCommand.command === command.name);
		if (!found) {
			filteredCommands.push({ command: command.name, desc: command.description, disabled: false });
		} else {
			filteredCommands.push({ command: command.name, desc: command.description, disabled: true });
		}
	});

	return res.status(200).json({
		success: true,
		username: channelInfo.username,
		id: channelInfo.id,
		joinedAt: channelInfo.joinedAt,
		editors,
		offlineOnly: channelInfo.offlineOnly ?? null,
		isChannel: channelInfo.isChannel,
		prefix: channelInfo.prefix ?? null,
		disabledCommands: filteredCommands,
	});
});

module.exports = router;
