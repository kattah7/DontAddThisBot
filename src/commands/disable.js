const { startCmds } = require('../clients/modules/commands.js');

module.exports = {
	tags: 'moderation',
	name: 'disable',
	cooldown: 5000,
	aliases: ['enable'],
	description: 'Disable a command',
	permission: 2,
	async execute(message, args, client, userdata, params, channelData, cmd) {
		if (!args[0]) {
			return {
				text: `Please provide a command to disable.`,
			};
		}

		const { commands } = await startCmds();
		let namesAndAliases = {
			command: '',
			aliases: [],
		};

		const input = args[0].toLowerCase();
		if (input === 'disable' || input === 'enable') {
			return {
				text: `You cannot disable the ${
					input === 'disable' ? 'disable' : 'enable'
				} command. 4Head`,
			};
		}

		for (let command of commands) {
			const { name, aliases, level } = command[1];
			if (!aliases || level > 1) continue;
			function returnNamesAndAliases() {
				namesAndAliases.command = name;
				namesAndAliases.aliases = aliases;
			}

			if (name === input) {
				returnNamesAndAliases();
				break;
			} else if (aliases.includes(input)) {
				returnNamesAndAliases();
				break;
			}
		}

		const { command, aliases } = namesAndAliases;
		if (!command || command === '') {
			return {
				text: `This command does not exist.`,
			};
		}

		const { rows } = await bot.SQL.query(
			`SELECT * FROM channel_settings WHERE twitch_id = '${message.channelID}' AND command = '${command}';`,
		);

		if (cmd === 'disable') {
			if (!rows[0] || rows[0].length === 0) {
				await bot.SQL.query(
					`INSERT INTO channel_settings (twitch_id, twitch_login, command, aliases, is_disabled) VALUES ('${
						message.channelID
					}', '${
						message.senderUsername
					}', '${command}', '${JSON.stringify(
						aliases,
					)}', 1);`,
				);

				return {
					text: `The command "${command}" has been disabled.`,
				};
			} else if (rows[0].is_disabled === 0) {
				await bot.SQL.query(
					`UPDATE channel_settings SET is_disabled = 1 WHERE twitch_id = '${message.channelID}' AND command = '${command}';`,
				);

				return {
					text: `The command "${command}" has been re-disabled.`,
				};
			}

			if (rows[0].is_disabled === 1) {
				return {
					text: `The command "${command}" is already disabled.`,
				};
			}
		} else if (cmd === 'enable') {
			if (rows.length === 0 || rows[0].is_disabled === 0) {
				return {
					text: `The command "${command}" is already enabled.`,
				};
			}

			if (rows[0].is_disabled === 1) {
				await bot.SQL.query(
					`UPDATE channel_settings SET is_disabled = 0 WHERE twitch_id = '${message.channelID}' AND command = '${command}';`,
				);

				return {
					text: `The command "${command}" has been enabled.`,
				};
			}
		}
	},
};
