const { Logger, LogLevel } = require('../../misc/logger');
const { invisChars } = require('../../misc/regex');
const { startCmds } = require('./commands');
const { updateEntireDB } = require('./updateUser');
const { GetStreams } = require('../../token/helix');
const { ParseUser } = require('../../util/twitch/utils');
const { getUser } = require('../../token/stvREST');
const { GetUser: GqlUser } = require('../../token/stvGQL');
const { client } = require('../../util/twitch/connections');
const { translateLanguage, iso6391LanguageCodes, getCodeFromName } = require('../../util/google/translate');
const discord = require('../../util/discord/discord.js');
const cooldown = require('./cooldown');
const fetch = require('node-fetch');

const getChannel = async function (id) {
	return await bot.DB.channels.findOne({ id: id }).catch((err) => Logger.log(LogLevel.ERROR, err));
};

const setParams = function (args) {
	const params = {};
	args.filter((word) => word.includes(':')).forEach((param) => {
		const key = param.split(':')[0];
		const value = param.split(':')[1];
		params[key] = value === 'true' || value === 'false' ? value === 'true' : value;
	});

	return params;
};

const getUserInDB = async function (id) {
	return await bot.DB.users.findOne({ id: id }).catch((err) => Logger.log(LogLevel.ERROR, err));
};

const getPoroDataInDB = async function (id) {
	return await bot.DB.poroCount.findOne({ id: id }).catch((err) => Logger.log(LogLevel.ERROR, err));
};

const createUserInDB = async function (senderUserID, senderUsername) {
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

	return userdata;
};

const userCommands = async function (username, commandName) {
	const targetUser = await ParseUser(username);
	const findUserInTable = await bot.SQL.query(`SELECT * FROM user_commands_settings WHERE twitch_login = '${targetUser}' AND command = '${commandName}'`);

	return findUserInTable.rows[0];
};

const saveCommandUsage = async function (senderUserID, senderUsername, command) {
	const findUserCommand = await bot.SQL.query(`SELECT * FROM commands WHERE twitch_id = '${senderUserID}' AND command = '${command}'`);
	if (findUserCommand.rows.length == 0) {
		await bot.SQL.query(`INSERT INTO commands (twitch_id, twitch_login, command, command_usage) VALUES ('${senderUserID}', '${senderUsername}', '${command}', 1)`);
	} else {
		await bot.SQL.query(`UPDATE commands SET command_usage = command_usage + 1, last_used = '${new Date().toISOString()}' WHERE twitch_id = '${senderUserID}' AND command = '${command}'`);
	}
};

const pajBotCheck = async function (link, input) {
	const { banned } = await fetch(link, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ message: input }),
	}).then((res) => res.json());

	return banned;
};

const setHastag = (msg) => {
	return msg.filter((word) => word.startsWith('#')).map((word) => word.replace('#', ''));
};

module.exports = {
	handler: async function (msg) {
		if (msg.user.id !== '790623318') {
			const channelData = await getChannel(msg.channel.id);
			msg.mongoChannel = channelData;
			msg.prefix = channelData.prefix ?? '|';

			if (!msg.text.startsWith(msg.prefix)) return;

			msg.text = msg.text.replace(invisChars, '');
			msg.args = msg.text.slice(msg.prefix.length).trim().split(/ +/g);
			msg.params = setParams(msg.args);
			msg.hashtag = setHastag(msg.args);

			const cmd = msg.args.length > 0 ? msg.args.shift().toLowerCase() : '';
			if (cmd.length == 0) return;
			const { commands, aliases } = await startCmds();

			let command = commands.get(cmd);

			if (!command && !aliases.get(cmd)) return;
			if (!command) command = commands.get(aliases.get(cmd));

			const cooldownKey = `${msg.channel.id}-${msg.user.id}-${command.name}`;
			if (cooldown.has(cooldownKey)) return;
			if (command) {
				msg.command = cmd;
				msg.sender = await createUserInDB(msg.user.id, msg.user.login);

				const userTable = await bot.SQL.query(`SELECT * FROM users WHERE twitch_id = '${msg.user.id}'`);

				try {
					if (msg.sender.username !== msg.user.login) {
						await updateEntireDB(msg.user.login, msg.user.id);
					}

					if (msg.sender.level < 1) {
						return;
					}

					if (msg?.mongoChannel.offlineOnly && !command?.offline) {
						const data = (await GetStreams(msg.channel.login, true))[0];
						if (data?.type === 'live') {
							return;
						}
					}

					const { rows } = await bot.SQL.query(`SELECT * FROM channel_settings WHERE twitch_id = '${msg.channel.id}' AND command = '${command.name}'`);
					if (rows[0]?.is_disabled === 1) {
						msg.send(`This command is disabled on this channel.`);
						return;
					}

					if (command?.canOptout) {
						if (msg.args.length <= 0) {
							const isSelfOrChannel = command?.target === 'self' ? msg.user.login : msg.channel.login;
							const isOptedOut = await userCommands(isSelfOrChannel, command.name);
							if (isOptedOut) {
								msg.send(`This command is disabled for ${isSelfOrChannel}.`);
								return;
							}
						} else {
							for (const arg of msg.args) {
								const isOptedOut = await userCommands(arg, command.name);
								if (isOptedOut) {
									msg.send(`This command is disabled for ${arg}.`);
									return;
								}
							}
						}
					}

					if (command?.permission) {
						if (msg.sender.level !== 3) {
							if (command.permission == 1 && !msg.user.perms.mod && msg.channel.login !== msg.user.login) {
								msg.send('This command is moderator only.');
								return;
							} else if (command.permission == 2 && msg.channel.login !== msg.user.login) {
								msg.send('This command is broadcaster only.');
								return;
							}
						}
					}

					if (command?.level) {
						if (msg.sender.level < command.level) {
							msg.send(`You do not have permission to use this command.`);
							return;
						}
					}

					if (command?.kattah) {
						if (msg.user.login !== 'kattah') {
							return;
						}
					}

					if (command?.botPerms) {
						const channelState = client.userStateTracker.channelStates[msg.channel.login];
						if (command.botPerms.includes('vip')) {
							if (!channelState.badges.hasVIP && !channelState.isMod) {
								cooldown.set(cooldownKey, 1000);
								return msg.send(`${msg.user.name}, This command requires the bot to be a VIP.`);
							}
						} else if (command.botPerms.includes('mod')) {
							if (!channelState.isMod) {
								cooldown.set(cooldownKey, 1000);
								return msg.send(`${msg.user.name}, This command requires the bot to be a moderator.`);
							}
						}
					}

					if (command?.stv) {
						const { rows: stvRows } = await bot.SQL.query(`SELECT * FROM stv_ids WHERE twitch_id = '${msg.channel.id}'`);
						let stvID = stvRows[0]?.stv_id;
						if (!stvRows[0] || stvRows[0] === null) {
							const stvInfo = await getUser(msg.channel.id);
							if (stvInfo === null) {
								msg.send('This channel does not have a 7TV account linked.');
								return;
							}

							stvID = stvInfo.user.id;
							await bot.SQL.query(`INSERT INTO stv_ids (twitch_login, twitch_id, stv_id) VALUES ('${msg.channel.login}', '${msg.channel.id}', '${stvID}')`);
						}

						const { data } = await GqlUser(stvID);
						const isBotEditor = data.user.editors.find((x) => x.user.id == '629d77a20e60c6d53da64e38'); // DontAddThisBot's 7tv id
						if (!isBotEditor) {
							msg.send('Please grant @DontAddThisBot 7tv editor permissions.');
							return;
						}

						const channelEditors = msg.mongoChannel.editors.find((x) => x.id === msg.user.id);
						const ChannelOwnerEditor = msg.user.login === msg.channel.login;
						if (!channelEditors && !ChannelOwnerEditor) {
							msg.send(`You do not have permission to use this command. ask the broadcaster nicely to add you as editor :) ${msg.prefix}editor add ${msg.user.login}`);
							return;
						}

						msg.sevenTV = data;
					}

					if (command?.poroRequire) {
						const poroData = await getPoroDataInDB(msg.user.id);
						if (!poroData || poroData === null) {
							msg.send(`You arent registered @${msg.user.login}, type ${msg.prefix}poro to get started! kattahPoro`);
							return;
						}

						msg.poro = poroData;
					}

					if (command.cooldown) {
						if (msg.sender.level > 1) {
							cooldown.set(cooldownKey, 1);
						} else if (msg.mongoChannel?.optionalSettings?.cooldown) {
							cooldown.set(cooldownKey, msg.mongoChannel.optionalSettings.cooldown);
						} else {
							cooldown.set(cooldownKey, command.cooldown);
						}
					}

					const response = await command.execute(client, msg);

					if (response) {
						if (response.error) {
							setTimeout(() => {
								cooldown.delete(cooldownKey);
							}, 2000);
						} else if (response.text) {
							if (userTable.rows[0].language !== null) {
								let userLanguage = userTable.rows[0].language;

								if (userLanguage === 'random') {
									const languages = Object.keys(iso6391LanguageCodes);
									userLanguage = getCodeFromName(languages[~~(Math.random() * languages.length)]);
								}

								const translate = await translateLanguage('en', userLanguage, response.text);
								response.text = translate.result;
							}

							if (msg.mongoChannel?.optionalSettings?.pajbot) {
								const pajbot = await pajBotCheck(msg.mongoChannel?.optionalSettings?.pajbot, response.text);
								if (pajbot) {
									msg.send('The response of the command contains a ban phrase.');
									return;
								}
							}

							await msg.send(response.text.replace(/\n|\r/g, ' '), response.reply);
							await saveCommandUsage(msg.user.id, msg.user.login, command.name);
						}
					}
				} catch (err) {
					await discord.errorMessage(msg.channel.login, msg.user.login, msg.text, err.message);
					msg.send('This command resulted in a unexpected error, Please try again later.');
					Logger.log(LogLevel.ERROR, `⁉ ERROR! ${err.message} ⁉`);
				}
			}
		}
	},
};
