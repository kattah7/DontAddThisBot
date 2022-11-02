const utils = require('../../util/utils.js');
const discord = require('../../util/discord.js');
const { color } = require('../../util/botcolor.json');
const { ChangeColor, GetStreams } = require('../../token/helix');
const { ForsenTV } = require('../../token/pajbot.js');
const { GetEditorOfChannels } = require('../../token/stvGQL.js');
const cooldown = new Map();
var block = false;

exports.handler = async (commands, aliases, message, client) => {
    const userdata =
        (await getUser(message.senderUserID)) ||
        new bot.DB.users({
            id: message.senderUserID,
            username: message.senderUsername,
            firstSeen: new Date(),
            prefix: '|',
            level: 1,
        });

    await userdata.save();

    const lowerCase = message.messageText.toLowerCase();
    if (lowerCase.startsWith('@dontaddthisbot,') || lowerCase.startsWith('@dontaddthisbot')) {
        if (!block) {
            const channelData = await getChannel(message.channelID);
            if (!channelData.id) {
                await bot.DB.channels
                    .updateOne({ username: message.channelName }, { id: message.ircTags['room-id'] })
                    .exec();
            }
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

    if (userdata.username !== message.senderUsername) {
        await bot.DB.users
            .updateOne({ id: message.senderUserID }, { $set: { username: message.senderUsername } })
            .exec();
        await bot.DB.users
            .updateOne(
                { id: message.senderUserID },
                { $addToSet: { nameChanges: [{ username: message.senderUsername, changedAt: new Date() }] } }
            )
            .exec(); // Logging since 2022 August 5th 2:19AM UTC
        await bot.DB.poroCount
            .updateOne({ id: message.senderUserID }, { $set: { username: message.senderUsername } })
            .exec();
        await bot.DB.channels
            .updateOne({ id: message.senderUserID }, { $set: { username: message.senderUsername } })
            .exec();
    }

    if (userdata.level < 1) {
        return;
    }

    const channelData = await getChannel(message.channelID);
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
            if (command.cooldown) {
                const poroData = await bot.DB.poroCount.find({}).exec();
                const sorted = poroData.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount);
                const top10 = sorted.slice(0, 10);
                const indexed = top10.map((user, index) => ({ name: user.username, position: index + 1 })); // start at 1
                const userPosition = indexed.find((user) => user.name === message.senderUsername)?.position;

                if (userdata.level == 3 || userdata.level == 2) {
                    if (cooldown.has(`${command.name}${message.senderUserID}`)) return;
                    cooldown.set(`${command.name}${message.senderUserID}`, Date.now() + 10);
                    setTimeout(() => {
                        cooldown.delete(`${command.name}${message.senderUserID}`);
                    }, 10);
                } else if (userPosition <= 10) {
                    // users position is within the range of 10
                    if (cooldown.has(`${command.name}${message.senderUserID}`)) return;
                    cooldown.set(`${command.name}${message.senderUserID}`, Date.now() + 3000);
                    setTimeout(() => {
                        cooldown.delete(`${command.name}${message.senderUserID}`);
                    }, 3000);
                } else if (message.channelName == 'forsen') {
                    // users position is within the range of 10
                    if (cooldown.has(`${command.name}${message.senderUserID}`)) return;
                    cooldown.set(`${command.name}${message.senderUserID}`, Date.now() + 3000);
                    setTimeout(() => {
                        cooldown.delete(`${command.name}${message.senderUserID}`);
                    }, 10000);
                } else {
                    // user is not in top 10
                    if (cooldown.has(`${command.name}${message.senderUserID}`)) return;
                    cooldown.set(`${command.name}${message.senderUserID}`, Date.now() + command.cooldown);
                    setTimeout(() => {
                        cooldown.delete(`${command.name}${message.senderUserID}`);
                    }, command.cooldown);
                }
            }
            if (command.permission) {
                if (command.permission == 1 && !message.isMod && message.channelName !== message.senderUsername) {
                    return client.say(message.channelName, 'This command is moderator only.');
                } else if (command.permission == 2 && message.channelName !== message.senderUsername) {
                    return client.say(message.channelName, 'This command is broadcaster only.');
                }
            }

            if (command.level) {
                if (userdata.level < command.level) {
                    return client.say(
                        message.channelName,
                        `${message.senderUsername}, you don't have permission to use this command. (${
                            bot.Utils.misc.levels[command.level]
                        })`
                    );
                }
            }

            if (command.kattah) {
                if (message.senderUsername !== 'kattah') {
                    return;
                }
            }

            if (command.botPerms) {
                const displayNamekek = await utils.displayName('dontaddthisbot');
                if (
                    command.botPerms == 'mod' &&
                    !(await client.getMods(message.channelName)).find((mod) => mod == 'dontaddthisbot')
                ) {
                    return client.say(message.channelName, 'This command requires the bot to be modded.');
                } else if (
                    command.botPerms == 'vip' &&
                    !(await client.getVips(message.channelName)).find((vip) => vip == displayNamekek) &&
                    !(await client.getMods(message.channelName)).find((mod) => mod == 'dontaddthisbot')
                ) {
                    // vips use displayname
                    return client.say(message.channelName, 'This command requires the bot to be VIP.'); // and since the bot has a feature to change display names
                } // this my only option
            }

            if (channelData.poroOnly && !command.poro) {
                return;
            }

            if (channelData.stvOnly && !command.stvOnly) {
                return;
            }

            if (command.stv) {
                const StvID = await utils.stvNameToID(message.channelID);
                const { user } = await GetEditorOfChannels('629d77a20e60c6d53da64e38');
                const isBotEditor = user.editor_of.find((x) => x.user.id == StvID); // DontAddThisBot's 7tv id
                if (!isBotEditor) {
                    client.say(message.channelName, 'Please grant @DontAddThisBot 7tv editor permissions.');
                    return;
                }

                const channelEditors = channelData.editors.find((editors) => editors.id === message.senderUserID);
                const ChannelOwnerEditor = message.senderUsername.toLowerCase() == message.channelName.toLowerCase();
                if (!channelEditors && !ChannelOwnerEditor) {
                    client.say(
                        message.channelName,
                        `You do not have permission to use this command. ask the broadcaster nicely to add you as editor :) ${prefix}editor add ${message.senderUsername}`
                    );
                    return;
                }
            }

            if (command.poroRequire) {
                const poroData = await bot.DB.poroCount.findOne({ id: message.senderUserID });
                if (!poroData) {
                    client.say(
                        message.channelName,
                        `You arent registered @${message.senderUsername}, type ${prefix}poro to get started! kattahHappy`
                    );
                    return;
                }
            }

            if (channelData.offlineOnly && !command.offline) {
                const data = (await GetStreams(message.channelName, true))[0];
                if (data == undefined) {
                } else if (data.type == 'live') {
                    return;
                }
            }

            const response = await command.execute(message, args, client, userdata, params, channelData);

            if (response) {
                if (response.error) {
                    setTimeout(() => {
                        cooldown.delete(`${command.name}${message.senderUserID}`);
                    }, 2000);
                }

                if (
                    regex.racism.test(args.join(' ') || response.text) ||
                    regex.slurs.test(args.join(' ') || response.text)
                ) {
                    try {
                        await discord.racist(
                            message.senderUsername,
                            message.senderUserID,
                            message.channelName,
                            args.join(' ')
                        );
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
                    // if command is already in user db then update the usage count
                    const targetUser = await bot.DB.users.findOne({ id: message.senderUserID });
                    const commandUsed = targetUser.commandsUsed.find((x) => x.command == command.name);
                    if (commandUsed) {
                        await bot.DB.users.updateOne(
                            { 'id': message.senderUserID, 'commandsUsed.command': command.name },
                            { $inc: { 'commandsUsed.$.Usage': 1 }, $set: { 'commandsUsed.$.lastUsage': Date.now() } }
                        );
                        await bot.DB.channels.updateOne(
                            { 'id': message.channelID, 'commandsUsed.command': command.name },
                            { $inc: { 'commandsUsed.$.Usage': 1 }, $set: { 'commandsUsed.$.lastUsage': Date.now() } }
                        );
                    } else {
                        await bot.DB.users.updateOne(
                            { id: message.senderUserID },
                            {
                                $addToSet: {
                                    commandsUsed: [{ command: command.name, Usage: 1, lastUsage: Date.now() }],
                                },
                            }
                        );
                        await bot.DB.channels.updateOne(
                            { id: message.channelID },
                            {
                                $addToSet: {
                                    commandsUsed: [{ command: command.name, Usage: 1, lastUsage: Date.now() }],
                                },
                            }
                        );
                    }
                }

                if (await utils.PoroNumberOne(message.senderUserID)) {
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
        if (
            ex.message.match(
                /@msg-id=msg_rejected_mandatory|Timed out after waiting for response for 2000 milliseconds/
            )
        ) {
            return;
        }
        Logger.error('Error during command execution:', ex);
        await discord.errorMessage(message.channelName, message.senderUsername, message.messageText, ex.message);
        return client.say(message.channelName, `⁉ ERROR! ${ex.message} ⁉`);
    }
};

const getUser = async function (id) {
    return await bot.DB.users.findOne({ id: id }).catch((err) => Logger.error(err));
};

const getChannel = async function (id) {
    return await bot.DB.channels.findOne({ id: id }).catch((err) => Logger.error(err));
};
