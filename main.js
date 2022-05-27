require("dotenv").config();
const nodeCron = require("node-cron");
const { readdirSync } = require("fs");
const { ChatClient } = require("@kararty/dank-twitch-irc");

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

const client = new ChatClient({
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_OAUTH,
    connection: {
        type: "websocket",
        secure: true,
    },
    maxChannelCountPerConnection: 5,
    connectionRateLimits: {
        parallelConnections: 20,
        releaseTime: 50,
    },
});

client.on("ready", () => {
    console.log("Connected to chat!");

    nodeCron.schedule("0 0-22/2 * * *<", () => {
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
            level: 1,
        });

    await userdata.save();

    if (userdata.level < 1) {
        return;
    }

    const prefix = "|";
    if (!message.messageText.startsWith(prefix)) return;
    const args = message.messageText.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.length > 0 ? args.shift().toLowerCase() : "";

    if (cmd.length == 0) return;

    let command = commands.get(cmd);
    if (!command) command = commands.get(aliases.get(cmd));

    try {
        if (command) {
            if (command.cooldown) {
                if (cooldown.has(`${command.name}${message.senderUserID}`)) return;
                cooldown.set(`${command.name}${message.senderUserID}`, Date.now() + command.cooldown);
                setTimeout(() => {
                    cooldown.delete(`${command.name}${message.senderUserID}`);
                }, command.cooldown);
            }
            if (command.permission) {
                if (command.permission == 1 && !message.isMod && message.channelName !== message.senderUsername) {
                    return client.say(message.channelName, "This command is mod only.");
                } else if (command.permission == 2 && message.channelName !== message.senderUsername) {
                    return client.say(message.channelName, "This command is broadcaster only.");
                }
            }

            if (command.level) {
                if (userdata.level < command.level) {
                    return client.say(message.channelName, `${message.senderUsername}, you don't have permission to use this command. (${bot.Utils.misc.levels[command.level]})`);
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

const main = async () => {
    await client.join("dontaddthisbot");
    client.connect();
    const channels = await bot.DB.channels.find({}).exec();
    for (const channel of channels) {
        try {
            await client.join(channel.username);
        } catch (err) {
            console.error(`Failed to join channel ${channel.username}`, err);
        }
        await new Promise((r) => setTimeout(r, 500));
    }
};

main();
