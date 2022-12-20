const { exec } = require('child_process');

module.exports = {
	name: 'pull',
	aliases: [],
	cooldown: 3000,
	kattah: true,
	description: 'Pulls the latest commit from github. (Kattah only)',
	execute: async (client, msg) => {
		await exec('cd /home/DontAddThisBot && git reset --hard && git pull && yarn && mongodump --db=dontaddthisbot --out=dump/', (err) => {
			if (err) {
				console.error(err);
				return {
					text: `FeelsDankMan !!! failed to pull commit`,
					reply: true,
				};
			}
		});

		await client.say(msg.channel.login, 'Commit pulled, restarting.. MrDestructoid');
		process.exit(0);
	},
};
