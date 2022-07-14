require("dotenv").config();
const nodeCron = require("node-cron");
const { readdirSync } = require("fs");
const { channel } = require("diagnostics_channel");
const { client } = require('./util/connections.js')
const pubsub = require('./util/pubSub.js')
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
    pubsub.init()
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
            await client.say("kattah", `"${message.messageText.replace(/[#|@|'|+|$|!|?|||*|^|%|>|=|-]/, '')}" BatChest`);
        }
        if (message.senderUserID == 632146121 && message.messageText.startsWith("anakarolinne Reminder to eat your cookie nymnOkay")) {
            await client.say("kattah", "anakarolinne Reminder to eat your cookie nymnOkay");
        }
        
        if (message.senderUserID == 790623318 && message.messageText.startsWith("pokimane")) { // uid to username is datb
            client.say("kattah", `pokimane`)
        }
        if (message.messageText.startsWith("|massbotping")) {
            const xd = "' = ? * # > ! $ + | % ^ - < # @ & * ( ) [ ] { } , . / ~ `; bb"; 
            for (const lol of xd.split(" ")) 
            { client.say("kattah", `${lol}ping`) };
        }
        if (message.messageText.startsWith("to")) {
            client.say("kattah", `to`)
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

                const top1 = sorted.slice(0, 1);
                const top2 = sorted.slice(1, 2);
                const top3 = sorted.slice(2, 3);
                const top4 = sorted.slice(3, 4);
                const top5 = sorted.slice(4, 5);
                const top6 = sorted.slice(5, 6);
                const top7 = sorted.slice(6, 7);
                const top8 = sorted.slice(7, 8);
                const top9 = sorted.slice(8, 9);
                const top10 = sorted.slice(9, 10);

                const num1 = top1.map((user) => `${user.username}`)
                const num2 = top2.map((user) => `${user.username}`)
                const num3 = top3.map((user) => `${user.username}`)
                const num4 = top4.map((user) => `${user.username}`)
                const num5 = top5.map((user) => `${user.username}`)
                const num6 = top6.map((user) => `${user.username}`)
                const num7 = top7.map((user) => `${user.username}`)
                const num8 = top8.map((user) => `${user.username}`)
                const num9 = top9.map((user) => `${user.username}`)
                const num10 = top10.map((user) => `${user.username}`)
                if (userdata.level == 3 || userdata.level == 2) {
                    if (cooldown.has(`${command.name}${message.senderUserID}`)) return;
                    cooldown.set(`${command.name}${message.senderUserID}`, Date.now() + 10);
                    setTimeout(() => {
                        cooldown.delete(`${command.name}${message.senderUserID}`);
                    }, 10);
                } else if (message.senderUsername == num1 || 
                    message.senderUsername == num2 || 
                    message.senderUsername == num3 || 
                    message.senderUsername == num4 || 
                    message.senderUsername == num5 || 
                    message.senderUsername == num6 ||
                    message.senderUsername == num7 ||
                    message.senderUsername == num8 ||
                    message.senderUsername == num9 ||
                    message.senderUsername == num10){
                    if (cooldown.has(`${command.name}${message.senderUserID}`)) return;
                    cooldown.set(`${command.name}${message.senderUserID}`, Date.now() + 3000);
                    setTimeout(() => {
                        cooldown.delete(`${command.name}${message.senderUserID}`);
                    }, 3000);
                } else {
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
            if (channelData.poroOnly && !command.poro) {
                return
            }
    
            if (channelData.offlineOnly && !command.offline) {
                const { data } = await got(`https://api.twitch.tv/helix/streams?user_login=${message.channelName}`, {
                headers: {
                "Client-ID": process.env.CLIENT_ID,
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                },
                }).json();
                console.log(data)
                var xd = true
                if (data[0]==undefined){
                    
                } else if (data[0].type == 'live') {
                    return
                }
            }

            if (command.numberone) {
                if (command.numberone == message.senderUsername == 'kattah') {
                    return client.say(message.channelName, 'xd')
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
    await client.join("dontaddthisbot");
    const channels = await bot.DB.channels.find({}).exec();
    for (const channel of channels) {
        try {
            await client.join(channel.username);
        } catch (err) {
            console.error(`Failed to join channel ${channel.username}`, err);
        }
    }
};

main();

module.exports = { client }; // Export the client
