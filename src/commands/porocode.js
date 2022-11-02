const fs = require('fs/promises');
const { exec } = require('child_process');

module.exports = {
    name: 'setcode',
    cooldown: 5000,
    description: 'check poro count of user',
    level: 3,
    execute: async (message, args, client, userdata, params, channelData) => {
        if (!args[0]) {
            return {
                text: `insert code lol`,
            };
        }

        var code = {
            code: args.join(' '),
        };

        await fs.writeFile('src/util/porocodes.json', JSON.stringify(code) + '\n', (encoding = 'utf8'));
        await exec('cd /home/DontAddThisBot && git reset --hard && git pull && yarn', (err) => {
            if (err) {
                console.error(err);
                return {
                    text: `FeelsDankMan !!! failed to pull commit`,
                };
            }
        });
        await client.say(message.channelName, 'Reset code, restarting.. MrDestructoid');
        process.exit(0);
    },
};
