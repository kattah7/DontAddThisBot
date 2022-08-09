const { exec } = require("child_process");

module.exports = {
    name: "pull2",
    aliases: [],
    cooldown: 3000,
    level: 3,
    description: "Pulls the latest commit from github. (Kattah only)",
    execute: async (message, args, client) => {
        await exec("cd /home/mywebsitexd && git reset --hard && git pull && npm i", (err) => {
            if (err) {
                console.error(err);
                return {
                    text: `FeelsDankMan !!! failed to pull commit`,
                };
            }
        });

        await client.say(message.channelName, "Commit pulled, restarting.. :)");
        process.exit(0);
    },
};