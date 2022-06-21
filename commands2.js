const got = require("got");
const { readdirSync } = require("fs");

module.exports = {
    name: "commands",
    aliases: ["commands"],
    cooldown: 3000,
    execute: async (message, args, client) => {
        let text = "DontAddThisBot commands (Prefix: | )\n\n";

        for (let file of readdirSync(`./commands/`).filter((file) => file.endsWith(".js"))) {
            let pull = require(`../commands/${file}`);
            text += `${pull.name} (${pull.description || "This command has no description."})\n`;
        }

        const { key } = await got
            .post(`https://paste.ivr.fi/documents`, {
                responseType: "json",
                body: text,
            })
            .json();

            if (message.senderUsername == process.env.NUMBER_ONE) {
                return client.privmsg(message.channelName, `.me ${message.senderUsername}, https://paste.ivr.fi/${key} WutFace`)
            } else {
                return {
                    text: `${message.senderUsername}, https://paste.ivr.fi/${key} WutFace`,
                };
            }
    },
};