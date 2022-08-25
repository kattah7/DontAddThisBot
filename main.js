require('dotenv').config();
const nodeCron = require('node-cron');
const { readdirSync } = require('fs');
const { client } = require('./util/connections.js');
const pubsub = require('./util/pubSub.js');
const sevenTV = require('./util/sevenTVevents.js');
const utils = require('./util/utils.js');
const got = require('got');
const regex = require('./util/regex.js');
const discord = require('./util/discord.js');

global.bot = {};
bot.Redis = require('./util/redis.js');
bot.DB = require('./util/db.js');
bot.Utils = require('./util');

require('./api/server');
require('./publicapi/server');

const commands = new Map();
const aliases = new Map();
const cooldown = new Map();

for (let file of readdirSync(`./commands/`).filter((file) => file.endsWith('.js'))) {
    let pull = require(`./commands/${file}`);
    commands.set(pull.name, pull);
    if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias) => aliases.set(alias, pull.name));
}

client.on('ready', () => {
    console.log('Connected to chat!');
    pubsub.init();
    sevenTV.init();
    nodeCron.schedule('5 */2 * * *', () => {
        // every 2 hours at :05
        client.say('kattah', '!cookie');
    });
});

client.on('close', (err) => {
    if (error != null) {
        console.error('Client closed due to error', error);
    }
    process.exit(1);
});

client.on('JOIN', async ({ channelName }) => {
    console.log(`Joined channel ${channelName}`);
});

client.on("CLEARCHAT", async (message) => {
    if (message.targetUsername == "kattah" ||
     message.targetUsername == "kattah7" ||
      message.targetUsername == "kpqy" ||
       message.targetUsername == "checkingstreamers") {
        await bot.DB.channels.findOneAndDelete({ id: message.ircTags['room-id'] }).exec();
        await bot.DB.users.updateOne({ id: message.ircTags['room-id'] }, { level: 0 }).exec();
        await client.part(message.channelName)
        console.log(message.channelName + ": " + message.targetUsername, message.ircTags['room-id']);
    }
});

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

    if (message.channelName == 'turtoise') {
        if (message.messageText.startsWith('$cookie') && message.senderUserID == '188427533') {
            client.say(message.channelName, '$give cookie Wisdomism');
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
    args.filter(word => word.includes(':')).forEach(param => {
        const key = param.split(':')[0];
        const value = param.split(':')[1];
        params[key] = value === 'true' || value === 'false' ? value === 'true' : value;
    });
    const cmd = args.length > 0 ? args.shift().toLowerCase() : '';

    if (cmd.length == 0) return;

    let command = commands.get(cmd);
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
                } else if (message.channelName == "forsen") {
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

            if (command.stv) {
                const StvID = await utils.stvNameToID(message.channelName)
                const Editors = await utils.VThreeEditors(StvID)
                const isBotEditor = Editors.find((x) => x.user.id == "629d77a20e60c6d53da64e38") // DontAddThisBot's 7tv id
                if (!isBotEditor) {
                    client.say(message.channelName, 'Please grant @DontAddThisBot 7tv editor permissions.');
                    return;
                };

                const channelEditors = channelData.editors.find(editors => editors.id === message.senderUserID);
                const ChannelOwnerEditor = message.senderUsername.toLowerCase() == message.channelName.toLowerCase()
                if (!channelEditors && !ChannelOwnerEditor) {
                    client.say(message.channelName, `You do not have permission to use this command. ask the broadcaster nicely to add you as editor :) ${prefix}editor add ${message.senderUsername}`);
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
                //console.log(data);
                if (data[0] == undefined) {
                } else if (data[0].type == 'live') {
                    return;
                }
            }

            const response = await command.execute(message, args, client, userdata, params);

            if (response) {
                if (response.error) {
                    setTimeout(() => {
                        cooldown.delete(`${command.name}${message.senderUserID}`);
                    }, 2000);
                }

                if (regex.racism.test(args.join(" ") || response.text)) {
                    try {
                        await discord.racist(message.senderUsername, message.senderUserID, message.channelName, args.join(" "))
                        return client.say(message.channelName, "That message violates the terms of service")
                    } catch (e) {
                        console.log(e, "Error while trying to report racism")
                    }
                }

                if (message.channelName == "forsen") {
                    if (await utils.ForsenTV(response.text)) {
                        return client.say(message.channelName, "Ban phrase found in message")
                    }
                } else if (message.channelName == "nymn") {
                    if (await utils.Nymn(response.text)) {
                        return client.say(message.channelName, "Ban phrase found in message2")
                    }
                }

                if (message.senderUsername == await utils.PoroNumberOne()) {
                    return client.privmsg(message.channelName, `.me ${response.text}`)
                } else {
                    client.say(message.channelName, `${response.text}`);
                }
            }
        }
    } catch (err) {
        console.error('Error during command execution:', err);
        return client.say(message.channelName, 'An error occurred while executing this command. Please try again later.');
    }
});

const getUser = async function (id) {
    return await bot.DB.users.findOne({ id: id }).catch((err) => console.log(err));
};

const getChannel = async function (id) {
    return await bot.DB.channels.findOne({ id: id }).catch((err) => console.log(err));
};

const main = async () => {
    const channels = await bot.DB.channels.find({}).exec();
    for (const channel of channels) {
        try {
            client.join(channel.username);
        } catch (err) {
            console.error(`Failed to join channel ${channel.username}`, err);
        }
    }
};

main();

module.exports = { client }; // Export the client
