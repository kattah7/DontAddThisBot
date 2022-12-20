const { startCmds } = require('../clients/modules/commands.js');

module.exports = {
	tags: 'moderation',
	name: 'disable',
	cooldown: 5000,
	aliases: ['enable'],
	description: 'Disable a command',
	permission: 1,
	async execute(client, msg) {
		if (!msg.args[0]) {
			return {
				text: `Please provide a command to disable.`,
				reply: true,
			};
		}

		const { commands } = await startCmds();
		let namesAndAliases = {
			command: '',
			aliases: [],
		};

		const input = msg.args[0].toLowerCase();
		if (input === 'disable' || input === 'enable') {
			return {
				text: `You cannot disable the ${input === 'disable' ? 'disable' : 'enable'} command. 4Head`,
				reply: true,
			};
		}

		for (let command of commands) {
			const { name, aliases, level } = command[1];
			if (!aliases || level > 1) continue;
			if (name === input) {
				namesAndAliases.command = name;
				namesAndAliases.aliases = aliases;
				break;
			} else if (aliases.includes(input)) {
				namesAndAliases.command = name;
				namesAndAliases.aliases = aliases;
				break;
			}
		}

		const { command, aliases } = namesAndAliases;
		if (!command || command === '') {
			return {
				text: `This command does not exist.`,
			};
		}

		const { rows } = await bot.SQL.query(`SELECT * FROM channel_settings WHERE twitch_id = '${msg.channel.id}' AND command = '${command}';`);

		if (msg.command === 'disable') {
			if (!rows[0] || rows[0].length === 0) {
				await bot.SQL.query(
					`INSERT INTO channel_settings (twitch_id, twitch_login, command, aliases, is_disabled) VALUES ('${msg.channel.id}', '${msg.user.login}', '${command}', '${JSON.stringify(
						aliases,
					)}', 1);`,
				);

				return {
					text: `The command "${command}" has been disabled.`,
					reply: true,
				};
			} else if (rows[0].is_disabled === 0) {
				await bot.SQL.query(`UPDATE channel_settings SET is_disabled = 1 WHERE twitch_id = '${msg.channel.id}' AND command = '${command}';`);

				return {
					text: `The command "${command}" has been re-disabled.`,
					reply: true,
				};
			}

			if (rows[0].is_disabled === 1) {
				return {
					text: `The command "${command}" is already disabled.`,
					reply: true,
				};
			}
		} else if (msg.command === 'enable') {
			if (rows.length === 0 || rows[0].is_disabled === 0) {
				return {
					text: `The command "${command}" is already enabled.`,
					reply: true,
				};
			}

			if (rows[0].is_disabled === 1) {
				await bot.SQL.query(`UPDATE channel_settings SET is_disabled = 0 WHERE twitch_id = '${msg.channel.id}' AND command = '${command}';`);

				return {
					text: `The command "${command}" has been enabled.`,
					reply: true,
				};
			}
		}
	},
};
