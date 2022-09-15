const { exec } = require("child_process");

module.exports = {
    name: "pull3",
    aliases: [],
    cooldown: 3000,
    level: 3,
    description: "Pulls the latest commit from github. (Kattah only)",
    execute: async (message, args, client) => {
        await exec("pm2 stop joiner", (err) => {
            if (err) {
                console.error(err);
                return {
                    text: `FeelsDankMan !!! failed to pull commit`,
                };
            }
        });

        await client.say(message.channelName, "Commit pulled, restarting.. KEK");
        process.exit(0);
    },
};
