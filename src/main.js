require('dotenv').config();
const nodeCron = require('node-cron');
const { readdirSync } = require('fs');
const { client } = require('./util/connections.js');
const pubsub = require('./util/pubSub.js');
const sevenTV = require('./util/sevenTVevents.js');
const utils = require('./util/utils.js');
const got = require('got');
const discord = require('./util/discord.js');
const { color } = require('./util/botcolor.json');
const { exec } = require('child_process');

global.bot = {};
bot.Redis = require('./util/redis.js');
bot.DB = require('./util/db.js');
bot.Utils = require('./util');
Logger = require('./util/logger.js');
regex = require('./util/regex.js');

require('./api/server');
require('./publicapi/server.js');

const commands = new Map();
const aliases = new Map();
const cooldown = new Map();

for (let file of readdirSync(`./src/commands/`).filter((file) => file.endsWith('.js'))) {
    let pull = require(`./commands/${file}`);
    commands.set(pull.name, pull);
    if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias) => aliases.set(alias, pull.name));
}

client.on('ready', () => {
    Logger.info('Connected to chat!');
    pubsub.init();
    sevenTV.init();
    nodeCron.schedule('5 */2 * * *', () => {
        // every 2 hours at :05
        client.say('kattah', '!cookie');
    });
});

client.on('close', (err) => {
    if (err != null) {
        Logger.error('Client closed due to error', err);
    }
    process.exit(1);
});

client.on('JOIN', async ({ channelName }) => {
    Logger.info(`Joined channel ${channelName}`);
});

client.on('PART', async ({ channelName }) => {
    Logger.info(`Left channel ${channelName}`);
});

client.on('WHISPER', async ({ messageText, senderUsername, senderUserID }) => {
    const { user } = await utils.StvInformation(senderUserID);
    const values = {
        '60724f65e93d828bf8858789': 0, // Moderator
        '631ef5ea03e9beb96f849a7e': 1, // Evenet coordinator
        '63124dcf098bd6b8e5a7cb02': 2, // Staff
        '6102002eab1aa12bf648cfcd': 3, // Admin
        '608831312a61f51b61f2974d': 4, // Dungeon Mistress
    };
    // return by user values or -1
    const userRole = user?.roles?.map((role) => values[role])?.sort((a, b) => a - b)?.[0] ?? -1;
    if (userRole > -1) {
        const args = messageText.slice().trim().split(/ +/g);
        const [url] = args;
        if (/https:\/\/(next\.)?7tv\.app\/emotes\/\w{24}/g.test(url)) {
            const linkEmote = /https:\/\/(next\.)?7tv\.app\/emotes\/(\w{24})/.exec(url);
            const emoteInfo = await utils.StvEmoteInformation(linkEmote[2]);
            if (emoteInfo == null) return client.whisper(senderUsername, 'Unknown emote');
            const findBadApple = await bot.DB.moderation.findOne({ StvID: emoteInfo.owner.id }).exec();
            if (findBadApple) {
                const { username, id, StvID, warnings } = findBadApple;
                const warnList = warnings.map((warn) => {
                    return `Warned by ${warn.warnedBy} for "${warn.reason}" at "${warn.warnedAt}"`;
                });
                var paste = await got
                    .post('https://paste.ivr.fi/documents', {
                        body: `Username: ${username} \nID: ${id} \nStvID: "${StvID}" \n\n${warnList.join(
                            '\n'
                        )} \n\nNote that this link will never expire.`,
                    })
                    .json();
            }
            await client.whisper(
                senderUsername,
                emoteInfo.owner.id === '000000000000000000000000'
                    ? 'Deleted User'
                    : findBadApple
                    ? `${emoteInfo.owner.username} is a bad apple! monkaS Total of ${
                          findBadApple.warnings.length
                      } warning${findBadApple.warnings.length > 1 ? `s` : ``}; https://paste.ivr.fi/${paste.key}`
                    : `${emoteInfo.owner.username} is not a bad apple :)`
            );
        }

        if (args[0] === 'warn') {
            const [warn, user, ...reason] = args;
            if (!user) return client.whisper(senderUsername, 'Please provide a user');
            if (args[1] == 'warn') return client.whisper(senderUsername, 'Usage warn <user> <reason>');
            if (!args[2]) return client.whisper(senderUsername, 'Please provide a reason');
            const parseUser = await utils.ParseUser(user);
            try {
                const uid = await utils.IDByLogin(parseUser);
                const stvID = await utils.stvNameToID(uid);
                const isWarnedAlready = await bot.DB.moderation.findOne({ StvID: stvID });
                if (!isWarnedAlready) {
                    const warnUser = new bot.DB.moderation({
                        username: parseUser.toLowerCase(),
                        id: uid,
                        StvID: stvID,
                        warnings: [
                            {
                                reason: reason.join(' '),
                                warnedAt: new Date(),
                                warnedBy: senderUsername,
                            },
                        ],
                    });
                    await warnUser.save();
                    await client.whisper(senderUsername, `Warned ${parseUser} for ${reason.join(' ')}`);
                } else {
                    isWarnedAlready.warnings.push({
                        reason: reason.join(' '),
                        warnedAt: new Date(),
                        warnedBy: senderUsername,
                    });
                    await isWarnedAlready.save();
                    await client.whisper(
                        senderUsername,
                        `Warned ${parseUser} for ${reason.join(' ')}, this user has ${
                            isWarnedAlready.warnings.length
                        } warnings`
                    );
                }
            } catch (err) {
                client.whisper(senderUsername, 'Something went wrong');
            }
        } else if (args[0] === 'info') {
            const [warn, user] = args;
            if (!user) return client.whisper(senderUsername, 'Please provide a user');
            const parseUser = await utils.ParseUser(user);
            const findUser = await bot.DB.moderation.findOne({ username: parseUser.toLowerCase() });
            if (!findUser) return client.whisper(senderUsername, `User "${parseUser}" not found`);
            const { username, id, StvID, warnings } = findUser;
            // list all warnings and user info nicely and post it to paste.ivr.fi with got post
            const warnList = warnings.map((warn) => {
                return `Warned by ${warn.warnedBy} for "${warn.reason}" at "${warn.warnedAt}"`;
            });
            const paste = await got
                .post('https://paste.ivr.fi/documents', {
                    body: `Username: ${username} \nID: ${id} \nStvID: "${StvID}" \n\n${warnList.join(
                        '\n'
                    )} \n\nNote that this link will never expire.`,
                })
                .json();
            await client.whisper(
                senderUsername,
                `${username} has total of ${warnings.length} warning${
                    warnings.length > 1 ? `s` : ``
                }; https://paste.ivr.fi/${paste.key}`
            );
        } else if (args[0] === 'help') {
            await client.whisper(
                senderUsername,
                `warn <user> <reason> - Warn a user; info <user> - Get info about a user; <emote link> - Check if a user is a bad apple`
            );
        }
    }
});

client.on('CLEARCHAT', async (message) => {
    if (
        message.targetUsername == 'kattah' ||
        message.targetUsername == 'kattah7' ||
        message.targetUsername == 'kpqy' ||
        message.targetUsername == 'checkingstreamers' ||
        message.targetUsername == 'altaccountpoggers'
    ) {
        await bot.DB.channels.findOneAndDelete({ id: message.ircTags['room-id'] }).exec();
        await bot.DB.users.updateOne({ id: message.ircTags['room-id'] }, { level: 0 }).exec();
        await client.part(message.channelName);
        Logger.info(message.channelName + ': ' + message.targetUsername, message.ircTags['room-id']);
    }
});

client.on('NOTICE', async ({ channelName, messageID }) => {
    if (!messageID) return;

    if (messageID == 'msg_rejected_mandatory') {
        client.say(channelName, `That message violates the channel's moderation settings`);
        return;
    } else if (messageID == 'msg_banned') {
        Logger.warn(`Banned from channel ${channelName}`);
        await bot.DB.channels
            .updateOne({ username: channelName }, { isChannel: false })
            .catch((err) => Logger.error(err));
    } else if (messageID == 'msg_channel_suspended') {
        Logger.warn(`Suspended channel ${channelName}`);
    }
});

var block = false;
client.on('PRIVMSG', async (message) => {
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
            const channelData = await getChannel(message.channelName);
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
            client.say(message.channelName, '$give cookie Wisdomism');
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

    const channelData = await getChannel(message.channelName);
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
                const Editors = await utils.VThreeEditors(StvID);
                const isBotEditor = Editors.find((x) => x.user.id == '629d77a20e60c6d53da64e38'); // DontAddThisBot's 7tv id
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
                const { data } = await got(`https://api.twitch.tv/helix/streams?user_login=${message.channelName}`, {
                    headers: {
                        'Client-ID': process.env.CLIENT_ID,
                        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                    },
                }).json();
                if (data[0] == undefined) {
                } else if (data[0].type == 'live') {
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
                    if (await utils.ForsenTV(response.text)) {
                        return client.say(message.channelName, 'Ban phrase found in message');
                    }
                } else if (message.channelName == 'nymn') {
                    if (await utils.Nymn(response.text)) {
                        return client.say(message.channelName, 'Ban phrase found in message2');
                    }
                }

                if (await utils.PoroNumberOne(message.senderUserID)) {
                    await client.privmsg(message.channelName, `.color ${message.ircTags['color']}`);
                    await client.me(message.channelName, `${response.text}`);
                    await client.privmsg(message.channelName, `.color ${color}`);
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
        return client.say(message.channelName, `Error: ${ex.message}; Logged for review`);
    }
});

const getUser = async function (id) {
    return await bot.DB.users.findOne({ id: id }).catch((err) => Logger.error(err));
};

const getChannel = async function (channel) {
    return await bot.DB.channels.findOne({ username: channel }).catch((err) => Logger.error(err));
};

const main = async () => {
    const channels = await bot.DB.channels.find({ isChannel: true }).exec();
    for (const channel of channels) {
        try {
            client.join(channel.username);
        } catch (err) {
            Logger.error(`Failed to join channel ${channel.username}`, err);
        }
    }
};

main();

module.exports = { client }; // Export the client
