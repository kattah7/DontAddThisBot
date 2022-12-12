const { displayName, PoroNumberOne, stvNameToID, ParseUser } = require('../../util/twitch/utils.js');
const discord = require('../../util/discord.js');
const { color } = require('../../util/twitch/botcolor.json');
const { ChangeColor, GetStreams } = require('../../token/helix');
const { ForsenTV } = require('../../token/pajbot.js');
const { GetEditorOfChannels } = require('../../token/stvGQL.js');
const { translateLanguage } = require('../../util/translate');
const cooldown = new Map();
var block = false;

exports.handler = async (commands, aliases, message, client) => {
	const lowerCase = message.messageText.toLowerCase();
	if (lowerCase.startsWith('@dontaddthisbot,') || lowerCase.startsWith('@dontaddthisbot')) {
		if (!block) {
			const { prefix, editors } = await bot.DB.channels.findOne({ id: message.channelID }).exec();
			const isPrefix = prefix ? `${prefix}` : `|`;
			const isEditors = editors ? `${editors.length}` : `None`;
			client.say(message.channelName, `Prefix on this channel: "${isPrefix}" | Editors: ${isEditors} kattahYE`);
			block = true;
			setTimeout(() => {
				block = false;
			}, 5 * 1000);
			return;
		}
	}

	if (message.channelName == 'turtoise') {
		if (message.messageText.startsWith('$cookie') && message.senderUserID == '188427533') {
			client.say(message.channelName, '$cookie gift Wisdomism');
			return;
		}
	}

	const channelData = await getChannel(message.channelID);
	console.log('called', process.memoryUsage().rss / 1024 / 1024);
	const prefix = channelData.prefix ?? '|';
	if (!message.messageText.startsWith(prefix)) return;
	const args = message.messageText.slice(prefix.length).trim().split(/ +/g);
	const params = {};
	args.filter((word) => word.includes(':')).forEach((param) => {
		const key = param.split(':')[0];
		const value = param.split(':')[1];
		params[key] = value === 'true' || value === 'false' ? value === 'true' : value;
	});
	const cmd = args.length > 0 ? args.shift().toLowerCase() : '';

	if (cmd.length == 0) return;

	let command = commands.get(cmd);
	if (!command && !aliases.get(cmd)) return;
	if (!command) command = commands.get(aliases.get(cmd));

	try {
		if (command) {
			const userdata =
				(await getUser(message.senderUserID)) ||
				new bot.DB.users({
					id: message.senderUserID,
					username: message.senderUsername,
					firstSeen: new Date(),
					level: 1,
				});

			await userdata.save();
			await bot.SQL.query(
				`INSERT INTO users (twitch_id, twitch_login) SELECT * FROM (SELECT '${message.senderUserID}', '${message.senderUsername}') AS tmp WHERE NOT EXISTS (SELECT twitch_id FROM users WHERE twitch_id = '${message.senderUserID}') LIMIT 1;`,
			);

			const userTable = await bot.SQL.query(`SELECT * FROM users WHERE twitch_id = '${message.senderUserID}'`);
			if (userTable.rows[0].twitch_login != message.senderUsername) {
				async function updateTable(table) {
					await bot.SQL.query(`UPDATE ${JSON.stringify(table)} SET twitch_login = '${message.senderUsername}' WHERE twitch_id = '${message.senderUserID}'`);
				}

				await updateTable('users');
				await updateTable('commands');
				await updateTable('user_commands_settings');
				await updateTable('channel_settings');
			}

			if (userdata.username !== message.senderUsername) {
				await bot.DB.users
					.updateOne(
						{ id: message.senderUserID },
						{
							$set: {
								username: message.senderUsername,
							},
						},
					)
					.exec();
				await bot.DB.users
					.updateOne(
						{ id: message.senderUserID },
						{
							$addToSet: {
								nameChanges: [
									{
										username: message.senderUsername,
										changedAt: new Date(),
									},
								],
							},
						},
					)
					.exec(); // Logging since 2022 August 5th 2:19AM UTC
				await bot.DB.poroCount
					.updateOne(
						{ id: message.senderUserID },
						{
							$set: {
								username: message.senderUsername,
							},
						},
					)
					.exec();
				await bot.DB.channels
					.updateOne(
						{ id: message.senderUserID },
						{
							$set: {
								username: message.senderUsername,
							},
						},
					)
					.exec();
			}

			const { rows } = await bot.SQL.query(`SELECT * FROM channel_settings WHERE twitch_id = '${message.channelID}' AND command = '${command.name}'`);

			if (userdata.level < 1) {
				return;
			}

			if (channelData.offlineOnly && !command.offline) {
				const data = (await GetStreams(message.channelName, true))[0];
				if (data == undefined) {
				} else if (data.type == 'live') {
					return;
				}
			}

			if (rows[0]?.is_disabled === 1) {
				return await client.say(message.channelName, `@${message.senderUsername}, this command is disabled on this channel.`);
			}

			if (command.cooldown) {
				const { leaderboards } = await bot.Redis.get('leaderboardEndpoint');
				const returnUser = leaderboards.find(({ id }) => id === message.senderUserID);

				if (userdata.level == 3 || userdata.level == 2) {
					if (cooldown.has(`${command.name}${message.senderUserID}`)) return;
					cooldown.set(`${command.name}${message.senderUserID}`, Date.now() + 10);
					setTimeout(() => {
						cooldown.delete(`${command.name}${message.senderUserID}`);
					}, 10);
				} else if (returnUser) {
					if (cooldown.has(`${command.name}${message.senderUserID}`)) return;
					cooldown.set(`${command.name}${message.senderUserID}`, Date.now() + 3000);
					setTimeout(() => {
						cooldown.delete(`${command.name}${message.senderUserID}`);
					}, 3000);
				} else if (message.channelName == 'forsen') {
					if (cooldown.has(`${command.name}${message.senderUserID}`)) return;
					cooldown.set(`${command.name}${message.senderUserID}`, Date.now() + 3000);
					setTimeout(() => {
						cooldown.delete(`${command.name}${message.senderUserID}`);
					}, 10000);
				} else {
					if (cooldown.has(`${command.name}${message.senderUserID}`)) return;
					cooldown.set(`${command.name}${message.senderUserID}`, Date.now() + command.cooldown);
					setTimeout(() => {
						cooldown.delete(`${command.name}${message.senderUserID}`);
					}, command.cooldown);
				}
			}

			if (command.canOptout) {
				async function userCommands(username, commandName) {
					const targetUser = await ParseUser(username);
					const findUserInTable = await bot.SQL.query(`SELECT * FROM user_commands_settings WHERE twitch_login = '${targetUser}' AND command = '${commandName}'`);

					return findUserInTable.rows[0];
				}

				if (!args[0]) {
					switch (command.target) {
						case 'channel': {
							const channelOptout = await userCommands(message.channelName, command.name);
							if (channelOptout) {
								return client.say(message.channelName, `${message.channelName} has opted out of this command.`);
							}
							break;
						}
						case 'self': {
							const selfOptout = await userCommands(message.senderUsername, command.name);
							if (selfOptout) {
								return client.say(message.channelName, `You have opted out of this command.`);
							}
							break;
						}
					}
				} else {
					const targetOptout = await userCommands(args[0], command.name);
					if (targetOptout) {
						return client.say(message.channelName, `${args[0]} has opted out of this command.`);
					}
				}
			}

			if (command.permission) {
				if (userdata.level !== 3) {
					if (command.permission == 1 && !message.isMod && message.channelName !== message.senderUsername) {
						return client.say(message.channelName, 'This command is moderator only.');
					} else if (command.permission == 2 && message.channelName !== message.senderUsername) {
						return client.say(message.channelName, 'This command is broadcaster only.');
					}
				}
			}

			if (command.level) {
				if (userdata.level < command.level) {
					return client.say(message.channelName, `${message.senderUsername}, you don't have permission to use this command. (${bot.Utils.misc.levels[command.level]})`);
				}
			}

			if (command.kattah) {
				if (message.senderUsername !== 'kattah') {
					return;
				}
			}

			if (command.botPerms) {
				const { rows } = await bot.SQL.query(`SELECT * FROM channels WHERE twitch_login = '${message.channelName}'`);
				const { is_mod, is_vip } = rows[0];
				if (command.botPerms.includes('mod') && is_mod !== 1) {
					return client.say(message.channelName, 'This command requires the bot to be a moderator.');
				} else if (command.botPerms.includes('vip') && is_vip !== 1 && is_mod !== 1) {
					return client.say(message.channelName, 'This command requires the bot to be a VIP.');
				}
			}

			if (command.stv) {
				const StvID = await stvNameToID(message.channelID);
				const { user } = await GetEditorOfChannels('629d77a20e60c6d53da64e38');
				const isBotEditor = user.editor_of.find((x) => x.user.id == StvID); // DontAddThisBot's 7tv id
				if (!isBotEditor) {
					client.say(message.channelName, 'Please grant @DontAddThisBot 7tv editor permissions.');
					return;
				}

				const channelEditors = channelData.editors.find((editors) => editors.id === message.senderUserID);
				const ChannelOwnerEditor = message.senderUsername.toLowerCase() == message.channelName.toLowerCase();
				if (!channelEditors && !ChannelOwnerEditor) {
					client.say(message.channelName, `You do not have permission to use this command. ask the broadcaster nicely to add you as editor :) ${prefix}editor add ${message.senderUsername}`);
					return;
				}
			}

			if (command.poroRequire) {
				const poroData = await bot.DB.poroCount.findOne({
					id: message.senderUserID,
				});
				if (!poroData) {
					client.say(message.channelName, `You arent registered @${message.senderUsername}, type ${prefix}poro to get started! kattahPoro`);
					return;
				}
			}

			const response = await command.execute(message, args, client, userdata, params, channelData, cmd);

			if (response) {
				if (response.error) {
					setTimeout(() => {
						cooldown.delete(`${command.name}${message.senderUserID}`);
					}, 2000);
				}

				if (regex.racism.test(args.join(' ') || response.text) || regex.slurs.test(args.join(' ') || response.text)) {
					try {
						await discord.racist(message.senderUsername, message.senderUserID, message.channelName, args.join(' '));
						return client.say(message.channelName, 'That message violates the terms of service');
					} catch (e) {
						Logger.error(e, 'Error while trying to report racism');
					}
				}

				if (message.channelName == 'forsen') {
					if (await ForsenTV(response.text)) {
						return client.say(message.channelName, 'Ban phrase found in message');
					}
				}

				if (response.text) {
					const findUserCommand = await bot.SQL.query(`SELECT * FROM commands WHERE twitch_id = '${message.senderUserID}' AND command = '${command.name}'`);

					if (findUserCommand.rows.length == 0) {
						await bot.SQL.query(
							`INSERT INTO commands (twitch_id, twitch_login, command, command_usage) VALUES ('${message.senderUserID}', '${message.senderUsername}', '${command.name}', 1)`,
						);
					} else {
						await bot.SQL.query(
							`UPDATE commands SET command_usage = command_usage + 1, last_used = '${new Date().toISOString()}' WHERE twitch_id = '${message.senderUserID}' AND command = '${
								command.name
							}'`,
						);
					}
				}

				if (userTable.rows[0].language !== null && message.channelName !== 'forsen') {
					const userLanguage = userTable.rows[0].language;
					const translate = await translateLanguage('en', userLanguage, response.text);
					console.log(translate);
					if (translate) {
						await client.say(message.channelName, translate.result);
						return;
					}
				}

				if (await PoroNumberOne(message.senderUserID)) {
					await ChangeColor(message.ircTags['color']);
					await client.me(message.channelName, `${response.text}`);
					await ChangeColor(color);
					return;
				} else {
					await client.say(message.channelName, `${response.text}`);
				}
			}
		}
	} catch (ex) {
		if (ex.message.match(/@msg-id=msg_rejected_mandatory|Timed out after waiting for response for 2000 milliseconds/)) {
			return;
		}
		Logger.error('Error during command execution:', ex);
		await discord.errorMessage(message.channelName, message.senderUsername, message.messageText, ex.message);
		if (message.channelName === 'forsen') {
			return;
		}
		return client.say(message.channelName, `⁉ ERROR! ${ex.message} ⁉`);
	}
};

const getUser = async function (id) {
	return await bot.DB.users.findOne({ id: id }).catch((err) => Logger.error(err));
};

const getChannel = async function (id) {
	return await bot.DB.channels.findOne({ id: id }).catch((err) => Logger.error(err));
};
