const { startCmds } = require('../clients/modules/commands.js');

module.exports = {
	tags: 'moderation',
	name: 'optout',
	aliases: ['optin'],
	description: 'Opt out of the bot.',
	cooldown: 5000,
	async execute(message, args, client, userdata, params, channelData, cmd) {
		if (!args[0]) {
			return {
				text: `Please provide a command to opt out of.`,
			};
		}

		const { commands } = await startCmds();
		let namesAndAliases = {
			command: '',
			aliases: [],
		};

		const input = args[0].toLowerCase();
		for (let command of commands) {
			const { canOptout, name, aliases } = command[1];
			if (!canOptout || !aliases) continue;
			if (canOptout) {
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
		}

		const { command, aliases } = namesAndAliases;
		if (!command || command === '') {
			return {
				text: `This command is not opt out/in-able.`,
			};
		}

		const { rows } = await bot.SQL.query(
			`SELECT * FROM user_commands_settings WHERE twitch_id = '${message.senderUserID}' AND command = '${command}';`,
		);

		if (cmd === 'optout') {
			if (!rows[0] || rows[0].length === 0) {
				await bot.SQL.query(
					`INSERT INTO user_commands_settings (twitch_id, twitch_login, command, aliases) VALUES ('${
						message.senderUserID
					}', '${
						message.senderUsername
					}', '${command}', '${JSON.stringify(aliases)}');`,
				);

				return {
					text: `You have opted out of the ${command} command.`,
				};
			}

			return {
				text: `You are already opted out of the ${command} command. monkaS`,
			};
		} else if (cmd === 'optin') {
			if (rows[0]) {
				await bot.SQL.query(
					`DELETE FROM user_commands_settings WHERE twitch_id = '${message.senderUserID}' AND command = '${command}';`,
				);
				return {
					text: `You have opted in to the ${command} command.`,
				};
			}

			return {
				text: `You are already opted in to the ${command} command.`,
			};
		}
	},
};
