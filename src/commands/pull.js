const { exec } = require('child_process');
const sql = require('../../joiner/data/db.js');

module.exports = {
    name: 'pull',
    aliases: [],
    cooldown: 3000,
    kattah: true,
    description: 'Pulls the latest commit from github. (Kattah only)',
    execute: async (message, args, client) => {
        await exec(
            'cd /home/DontAddThisBot && git reset --hard && git pull && yarn && mongodump --db=dontaddthisbot --out=dump/',
            (err) => {
                if (err) {
                    console.error(err);
                    return {
                        text: `FeelsDankMan !!! failed to pull commit`,
                    };
                }
            }
        );
        await sql.query('DROP TABLE channels');

        await client.say(message.channelName, 'Commit pulled, restarting.. MrDestructoid');
        process.exit(0);
    },
};
