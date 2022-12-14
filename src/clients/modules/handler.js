const { PoroNumberOne, ParseUser } = require('../../util/twitch/utils.js');
const discord = require('../../util/discord/discord.js');
const { color } = require('../../util/twitch/botcolor.json');
const { ChangeColor, GetStreams } = require('../../token/helix');
const { ForsenTV } = require('../../token/pajbot.js');
const { GetUser } = require('../../token/stvGQL.js');
const { getUser } = require('../../token/stvREST');
const { translateLanguage, iso6391LanguageCodes, getCodeFromName } = require('../../util/google/translate');
const { updateUser } = require('../../util/database/db');

const cooldown = new Map();
var block = false;

exports.handler = async (commands, aliases, message, client) => {
	const { messageText, senderUserID, senderUsername, channelID, channelName, isMod, ircTags } = message;
	const lowerCase = messageText.toLowerCase();
	if (lowerCase.startsWith('@dontaddthisbot,') || lowerCase.startsWith('@dontaddthisbot')) {
		if (!block) {
			const { prefix, editors } = await bot.DB.channels.findOne({ id: channelID }).exec();
			const isPrefix = prefix ? `${prefix}` : `|`;
			const isEditors = editors ? `${editors.length}` : `None`;
			client.say(channelName, `Prefix on this channel: "${isPrefix}" | Editors: ${isEditors} kattahYE`);
			block = true;
			setTimeout(() => {
				block = false;
			}, 5 * 1000);
			return;
		}
	}

	if (channelName == 'turtoise') {
		if (messageText.startsWith('$cookie') && senderUserID == '188427533') {
			client.say(channelName, '$cookie gift Wisdomism');
			return;
		}
	}

	const channelData = await getChannel(channelID);
	console.log('called', process.memoryUsage().rss / 1024 / 1024);
	const prefix = channelData.prefix ?? '|';
	if (!messageText.startsWith(prefix)) return;
	const args = messageText.slice(prefix.length).trim().split(/ +/g);
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
				(await getUserInDB(senderUserID)) ||
				new bot.DB.users({
					id: senderUserID,
					username: senderUsername,
					firstSeen: new Date(),
					level: 1,
				});

			await userdata.save();
			await bot.SQL.query(
				`INSERT INTO users (twitch_id, twitch_login) SELECT * FROM (SELECT '${senderUserID}', '${senderUsername}') AS tmp WHERE NOT EXISTS (SELECT twitch_id FROM users WHERE twitch_id = '${senderUserID}') LIMIT 1;`,
			);

			const userTable = await bot.SQL.query(`SELECT * FROM users WHERE twitch_id = '${senderUserID}'`);
			if (userTable.rows[0].twitch_login != senderUsername) {
				async function updateTable(table) {
					await bot.SQL.query(`UPDATE ${JSON.stringify(table)} SET twitch_login = '${senderUsername}' WHERE twitch_id = '${senderUserID}'`);
				}

				await updateTable('users');
				await updateTable('commands');
				await updateTable('user_commands_settings');
				await updateTable('channel_settings');
				await updateUser('users', senderUserID, senderUsername);
				await updateUser('channels', senderUserID, senderUsername);
				await updateUser('poroCount', senderUserID, senderUsername);
			}

			const { rows } = await bot.SQL.query(`SELECT * FROM channel_settings WHERE twitch_id = '${channelID}' AND command = '${command.name}'`);

			if (userdata.level < 1) {
				return;
			}

			if (channelData.offlineOnly && !command.offline) {
				const data = (await GetStreams(channelName, true))[0];
				if (data == undefined) {
				} else if (data.type == 'live') {
					return;
				}
			}

			if (rows[0]?.is_disabled === 1) {
				client.say(channelName, `@${senderUsername}, this command is disabled on this channel.`);
				return;
			}

			if (command.cooldown) {
				const { leaderboards } = await bot.Redis.get('leaderboardEndpoint');
				const returnUser = leaderboards.find(({ id }) => id === senderUserID);

				if (userdata.level == 3 || userdata.level == 2) {
					if (cooldown.has(`${command.name}${senderUserID}`)) return;
					cooldown.set(`${command.name}${senderUserID}`, Date.now() + 10);
					setTimeout(() => {
						cooldown.delete(`${command.name}${senderUserID}`);
					}, 10);
				} else if (returnUser) {
					if (cooldown.has(`${command.name}${senderUserID}`)) return;
					cooldown.set(`${command.name}${senderUserID}`, Date.now() + 3000);
					setTimeout(() => {
						cooldown.delete(`${command.name}${senderUserID}`);
					}, 3000);
				} else if (channelName == 'forsen') {
					if (cooldown.has(`${command.name}${senderUserID}`)) return;
					cooldown.set(`${command.name}${senderUserID}`, Date.now() + 3000);
					setTimeout(() => {
						cooldown.delete(`${command.name}${senderUserID}`);
					}, 10000);
				} else {
					if (cooldown.has(`${command.name}${senderUserID}`)) return;
					cooldown.set(`${command.name}${senderUserID}`, Date.now() + command.cooldown);
					setTimeout(() => {
						cooldown.delete(`${command.name}${senderUserID}`);
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
							const channelOptout = await userCommands(channelName, command.name);
							if (channelOptout) {
								return client.say(channelName, `${channelName} has opted out of this command.`);
							}
							break;
						}
						case 'self': {
							const selfOptout = await userCommands(senderUsername, command.name);
							if (selfOptout) {
								return client.say(channelName, `You have opted out of this command.`);
							}
							break;
						}
					}
				} else {
					const targetOptout = await userCommands(args[0], command.name);
					if (targetOptout) {
						return client.say(channelName, `${args[0]} has opted out of this command.`);
					}
				}
			}

			if (command.permission) {
				if (userdata.level !== 3) {
					if (command.permission == 1 && !isMod && channelName !== senderUsername) {
						return client.say(channelName, 'This command is moderator only.');
					} else if (command.permission == 2 && channelName !== senderUsername) {
						return client.say(channelName, 'This command is broadcaster only.');
					}
				}
			}

			if (command.level) {
				if (userdata.level < command.level) {
					return client.say(channelName, `${senderUsername}, you don't have permission to use this command. (${bot.Utils.misc.levels[command.level]})`);
				}
			}

			if (command.kattah) {
				if (senderUsername !== 'kattah') {
					return;
				}
			}

			if (command.botPerms) {
				const { rows } = await bot.SQL.query(`SELECT * FROM channels WHERE twitch_login = '${channelName}'`);
				const { is_mod, is_vip } = rows[0];
				if (command.botPerms.includes('mod') && is_mod !== 1) {
					return client.say(channelName, 'This command requires the bot to be a moderator.');
				} else if (command.botPerms.includes('vip') && is_vip !== 1 && is_mod !== 1) {
					return client.say(channelName, 'This command requires the bot to be a VIP.');
				}
			}

			let channelStvInfo;
			if (command.stv) {
				const stvInfo = await getUser(channelID);
				if (stvInfo === null) {
					client.say(channelName, "This channel doesn't have a 7tv account.");
					return;
				}
				channelStvInfo = stvInfo;

				const { data } = await GetUser(channelStvInfo.user.id);
				const isBotEditor = data.user.editors.find((x) => x.user.id == '629d77a20e60c6d53da64e38'); // DontAddThisBot's 7tv id
				if (!isBotEditor) {
					client.say(channelName, 'Please grant @DontAddThisBot 7tv editor permissions.');
					return;
				}

				const channelEditors = channelData.editors.find((editors) => editors.id === senderUserID);
				const ChannelOwnerEditor = senderUsername.toLowerCase() == channelName.toLowerCase();
				if (!channelEditors && !ChannelOwnerEditor) {
					client.say(channelName, `You do not have permission to use this command. ask the broadcaster nicely to add you as editor :) ${prefix}editor add ${senderUsername}`);
					return;
				}
			}

			if (command.poroRequire) {
				const poroData = await bot.DB.poroCount.findOne({
					id: senderUserID,
				});
				if (!poroData) {
					client.say(channelName, `You arent registered @${senderUsername}, type ${prefix}poro to get started! kattahPoro`);
					return;
				}
			}

			const response = await command.execute(message, args, client, userdata, params, channelData, cmd, channelStvInfo);

			if (response) {
				if (response.error) {
					setTimeout(() => {
						cooldown.delete(`${command.name}${senderUserID}`);
					}, 2000);
				}

				if (regex.racism.test(args.join(' ') || response.text) || regex.slurs.test(args.join(' ') || response.text)) {
					try {
						await discord.racist(senderUsername, senderUserID, channelName, args.join(' '));
						return client.say(channelName, 'That message violates the terms of service');
					} catch (e) {
						Logger.error(e, 'Error while trying to report racism');
					}
				}

				if (channelName == 'forsen') {
					if (await ForsenTV(response.text)) {
						return client.say(channelName, 'Ban phrase found in message');
					}
				}

				if (response.text) {
					const findUserCommand = await bot.SQL.query(`SELECT * FROM commands WHERE twitch_id = '${senderUserID}' AND command = '${command.name}'`);

					if (findUserCommand.rows.length == 0) {
						await bot.SQL.query(`INSERT INTO commands (twitch_id, twitch_login, command, command_usage) VALUES ('${senderUserID}', '${message.senderUsername}', '${command.name}', 1)`);
					} else {
						await bot.SQL.query(
							`UPDATE commands SET command_usage = command_usage + 1, last_used = '${new Date().toISOString()}' WHERE twitch_id = '${senderUserID}' AND command = '${command.name}'`,
						);
					}
				}

				if (userTable.rows[0].language !== null && channelName !== 'forsen') {
					let userLanguage = userTable.rows[0].language;

					if (userLanguage === 'random') {
						const languages = Object.keys(iso6391LanguageCodes);
						userLanguage = getCodeFromName(languages[~~(Math.random() * languages.length)]);
					}

					const translate = await translateLanguage('en', userLanguage, response.text);
					response.text = translate.result;
				}

				if (await PoroNumberOne(senderUserID)) {
					await ChangeColor(ircTags['color']);
					await client.me(channelName, `${response.text}`);
					await ChangeColor(color);
					return;
				} else {
					await client.say(channelName, `${response.text}`);
				}
			}
		}
	} catch (ex) {
		if (ex.message.match(/@msg-id=msg_rejected_mandatory|Timed out after waiting for response for 2000 milliseconds/)) {
			return;
		}
		console.log(ex.message);
		await discord.errorMessage(channelName, senderUsername, messageText, ex.message);
		if (channelName === 'forsen') {
			return;
		}
		return client.say(channelName, `⁉ ERROR! ${ex.message} ⁉`);
	}
};

const getUserInDB = async function (id) {
	return await bot.DB.users.findOne({ id: id }).catch((err) => Logger.error(err));
};

const getChannel = async function (id) {
	return await bot.DB.channels.findOne({ id: id }).catch((err) => Logger.error(err));
};
