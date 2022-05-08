require("dotenv").config();
const { readdirSync } = require("fs");
const { ChatClient } = require("@kararty/dank-twitch-irc");

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
});

client.on("ready", () => {
    console.log("Connected to chat!");
});

client.on("close", (err) => {
    if (error != null) {
        console.error("Client closed due to error", error);
    }
    process.exit(1);
});

client.on("PRIVMSG", async (message) => {
    const prefix = "!";
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

            const response = await command.execute(message, args);

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

client.connect();
client.join("kattah");
