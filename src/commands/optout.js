const { startCmds } = require('../clients/modules/commands.js');

module.exports = {
	tags: 'moderation',
	name: 'optout',
	aliases: ['optin'],
	description: 'Opt out of the bot.',
	cooldown: 5000,
	async execute(client, msg) {
		if (!msg.args[0]) {
			return {
				text: `Please provide a command to opt out of.`,
				reply: true,
			};
		}

		const { commands } = await startCmds();
		let namesAndAliases = {
			command: '',
			aliases: [],
		};

		const input = msg.args[0].toLowerCase();
		for (let command of commands) {
			const { canOptout, name, aliases } = command[1];
			if (!canOptout || !aliases) continue;
			if (canOptout) {
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
		}

		const { command, aliases } = namesAndAliases;
		if (!command || command === '') {
			return {
				text: `This command is not opt out/in-able.`,
				reply: true,
			};
		}

		const { rows } = await bot.SQL.query(`SELECT * FROM user_commands_settings WHERE twitch_id = '${msg.user.id}' AND command = '${command}';`);

		if (msg.command === 'optout') {
			if (!rows[0] || rows[0].length === 0) {
				await insertOptState(msg.user.id, msg.user.login, command, aliases);
				return {
					text: `You have opted out of the ${command} command.`,
					reply: true,
				};
			}

			return {
				text: `You are already opted out of the ${command} command. monkaS`,
				reply: true,
			};
		} else if (msg.command === 'optin') {
			if (rows[0]) {
				await deleteOptState(msg.user.id, command);
				return {
					text: `You have opted in to the ${command} command.`,
					reply: true,
				};
			}

			return {
				text: `You are already opted in to the ${command} command.`,
				reply: true,
			};
		}

		async function deleteOptState(senderUserID, command) {
			await bot.SQL.query(`DELETE FROM user_commands_settings WHERE twitch_id = '${senderUserID}' AND command = '${command}';`);
		}

		async function insertOptState(senderUserID, senderUsername, command, aliases) {
			await bot.SQL.query(
				`INSERT INTO user_commands_settings (twitch_id, twitch_login, command, aliases) VALUES ('${senderUserID}', '${senderUsername}', '${command}', '${JSON.stringify(aliases)}');`,
			);
		}
	},
};
