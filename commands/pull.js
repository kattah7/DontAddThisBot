const { exec } = require("child_process");

module.exports = {
    name: "pull",
    aliases: [],
    cooldown: 3000,
    description: "Pulls the latest commit from github. (Kattah only)",
    execute: async (message, args, client) => {
        if (!["kattah", "fookstee"].includes(message.senderUsername)) return;
        exec("cd /home/DontAddThisBot && git pull && npm i", (err) => {
            if (err) {
                console.error(error);
                return {
                    text: `FeelsDankMan !!! failed to pull commit`,
                };
            }
        });

        await client.say(message.channelName, "Commit pulled, restarting.. MrDestructoid");
        process.exit(0);
    },
};