const express = require('express');
const router = express.Router();
const { middleWare } = require('../../middleWare');
const { startCmds } = require('../../../clients/modules/commands.js');
const { readdirSync } = require('fs');
const { handleEditor } = require('../../handleEditor');

async function UpdateCommandStatus(channelID, channelName, command) {
	const { rows } = await bot.SQL.query(`SELECT * FROM channel_settings WHERE twitch_id = '${channelID}' AND command = '${command}';`);
	if (!rows[0] || rows[0].length === 0) {
		return await bot.SQL.query(`INSERT INTO channel_settings (twitch_id, twitch_login, command, is_disabled) VALUES ('${channelID}', '${channelName}', '${command}', 1);`);
	} else {
		return await bot.SQL.query(`DELETE FROM channel_settings WHERE twitch_id = '${channelID}' AND command = '${command}';`);
	}
}

router.post('/api/bot/command', middleWare, handleEditor, async (req, res) => {
	const { channelID, channelLogin } = req.body;
	const findChannel = await bot.DB.channels.findOne({ id: channelID }).exec();
	if (!findChannel || !findChannel.isChannel) {
		return res.status(400).json({
			success: false,
			message: 'Unknown Channel',
		});
	}

	const { command: input } = req.body;
	const { commands } = await startCmds();

	let findCommand = false;
	for (let command of commands) {
		const { name, aliases, level } = command[1];
		if (!aliases || level > 1) continue;
		if (name === input) {
			findCommand = true;
			break;
		}
	}

	if (input === 'disable' || input === 'enable' || !findCommand) {
		return res.status(400).json({
			success: false,
			message: 'Invalid command',
		});
	}

	try {
		await UpdateCommandStatus(channelID, channelLogin, input);

		let commands = [];
		let filteredCommands = [];
		for (let file of readdirSync('./src/commands').filter((file) => file.endsWith('.js'))) {
			let pull = require(`../../../commands/${file}`);
			if (pull?.level || pull?.kattah) continue;
			if (pull.name) {
				commands.push(pull);
			}
		}

		const { rows: disabledCommands } = await bot.SQL.query(`SELECT command, aliases FROM channel_settings WHERE twitch_id = '${channelID}' AND is_disabled = 1`);

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
			message: 'Command updated',
			disabledCommands: filteredCommands,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error',
		});
	}
});

module.exports = router;
