require("dotenv").config();
const nodeCron = require("node-cron");
const { readdirSync } = require("fs");
const { channel } = require("diagnostics_channel");
const { client } = require('./util/connections.js');
const pubsub = require('./util/pubSub.js');
const utils = require("./util/utils.js");
const got = require("got");

global.bot = {};
bot.Redis = require("./util/redis.js");
bot.DB = require("./util/db.js");
bot.Utils = require("./util");

require("./api/server");

const commands = new Map();
const aliases = new Map();
const cooldown = new Map();

for (let file of readdirSync(`./commands/`).filter((file) => file.endsWith(".js"))) {
    let pull = require(`./commands/${file}`);
    commands.set(pull.name, pull);
    if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias) => aliases.set(alias, pull.name));
}

client.on("ready", () => {
    console.log("Connected to chat!");
    pubsub.init();
    nodeCron.schedule("5 */2 * * *", () => { // every 2 hours at :05
        client.say("kattah", "!cookie");
    });
});

client.on("close", (err) => {
    if (error != null) {
        console.error("Client closed due to error", error);
    }
    process.exit(1);
});

client.on("JOIN", async ({ channelName }) => {
    console.log(`Joined channel ${channelName}`);
});

client.on("PRIVMSG", async (message) => {
    const userdata =
        (await getUser(message.senderUserID)) ||
        new bot.DB.users({
            id: message.senderUserID,
            username: message.senderUsername,
            firstSeen: new Date(),
            prefix: "|",
            level: 1,
        });

    await userdata.save();

    if (userdata.level < 1) {
        return;
    }
    if (message.channelName == 'kattah') {
        if (message.senderUserID == 162760707 && message.messageText.includes("why")) {
            await client.say("kattah", "why not");
        } else if (message.senderUserID == 162760707 && message.messageText) {
            await client.say("kattah", `"${message.messageText.replace(/[|#@'+$!?*^%>=-]/, '')}" AYAYA`);
        }
        if (message.senderUserID == 632146121 && message.messageText.startsWith("anakarolinne Reminder to eat your cookie nymnOkay")) {
            await client.say("kattah", "anakarolinne Reminder to eat your cookie nymnOkay");
        }

        if (message.senderUserID == 790623318 && message.messageText.startsWith("pokimane")) { // uid to username is datb
            client.say("kattah", `pokimane`);
        }
        if (message.messageText.startsWith("|massbotping")) {
            const xd = "' = ? * # > ! $ + | % ^ - < # @ & * ( ) [ ] { } , . / ~ ` ; bb";
            for (const lol of xd.split(" ")) { client.say("kattah", `${lol}ping`); };
        }
        if (message.senderUserID == 180382257 && message.messageText.startsWith("to")) {
            client.say("kattah", `to`);
        }
    }

    const channelData = await getChannel(message.channelName);
    const prefix = channelData.prefix ?? "|";
    if (!message.messageText.startsWith(prefix)) return;
    const args = message.messageText.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.length > 0 ? args.shift().toLowerCase() : "";

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
                const userPosition = indexed.find(user => user.name === message.senderUsername)?.position;

                if (userdata.level == 3 || userdata.level == 2) {
                    if (cooldown.has(`${command.name}${message.senderUserID}`)) return;
                    cooldown.set(`${command.name}${message.senderUserID}`, Date.now() + 10);
                    setTimeout(() => {
                        cooldown.delete(`${command.name}${message.senderUserID}`);
                    }, 10);
                } else if (userPosition <= 10) { // users position is within the range of 10
                    if (cooldown.has(`${command.name}${message.senderUserID}`)) return;
                    cooldown.set(`${command.name}${message.senderUserID}`, Date.now() + 3000);
                    setTimeout(() => {
                        cooldown.delete(`${command.name}${message.senderUserID}`);
                    }, 3000);
                } else { // user is not in top 10
                    if (cooldown.has(`${command.name}${message.senderUserID}`)) return;
                    cooldown.set(`${command.name}${message.senderUserID}`, Date.now() + command.cooldown);
                    setTimeout(() => {
                        cooldown.delete(`${command.name}${message.senderUserID}`);
                    }, command.cooldown);
                }
            }
            if (command.permission) {
                if (command.permission == 1 && !message.isMod && message.channelName !== message.senderUsername) {
                    return client.say(message.channelName, "This command is moderator only.");
                } else if (command.permission == 2 && message.channelName !== message.senderUsername) {
                    return client.say(message.channelName, "This command is broadcaster only.");
                }
            }

            if (command.level) {
                if (userdata.level < command.level) {
                    return client.say(message.channelName, `${message.senderUsername}, you don't have permission to use this command. (${bot.Utils.misc.levels[command.level]})`);
                }
            }

            if (command.botPerms) {
                const displayNamekek = await utils.displayName("dontaddthisbot")
                if (command.botPerms == "mod" && !(await client.getMods(message.channelName)).find(mod => mod == "dontaddthisbot")) {
                    return client.say(message.channelName, "This command requires the bot to be modded.");
                } else if (command.botPerms == "vip" && !(await client.getVips(message.channelName)).find(vip => vip == displayNamekek)) { // vips use displayname
                    return client.say(message.channelName, "This command requires the bot to be VIP'd.");                                  // and since the bot has a feature to change display names
                }                                                                                                                             // this my only option
            }

            

            if (channelData.poroOnly && !command.poro) {
                return;
            }

            if (channelData.offlineOnly && !command.offline) {
                const { data } = await got(`https://api.twitch.tv/helix/streams?user_login=${message.channelName}`, {
                    headers: {
                        "Client-ID": process.env.CLIENT_ID,
                        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                    },
                }).json();
                console.log(data);
                var xd = true;
                if (data[0] == undefined) {

                } else if (data[0].type == 'live') {
                    return;
                }
            }

            if (command.numberone) {
                if (command.numberone == message.senderUsername == 'kattah') {
                    return client.say(message.channelName, 'xd');
                }
            }
            const response = await command.execute(message, args, client, userdata);

            if (response) {
                if (response.error) {
                    setTimeout(() => {
                        cooldown.delete(`${command.name}${message.senderUserID}`);
                    }, 2000);
                }

                client.say(message.channelName, `${response.text}`);
            }
        }
    } catch (err) {
        console.error("Error during command execution:", err);
    }
});

const getUser = async function (id) {
    return await bot.DB.users.findOne({ id: id }).catch((err) => console.log(err));
};

const getChannel = async function (channel) {
    return await bot.DB.channels.findOne({ username: channel }).catch((err) => console.log(err));
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
