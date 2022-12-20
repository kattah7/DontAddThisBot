const fs = require('fs/promises');
const { exec } = require('child_process');

module.exports = {
	name: 'setcode',
	cooldown: 5000,
	description: 'check poro count of user',
	aliases: [],
	level: 3,
	execute: async (client, msg) => {
		if (!msg.args[0]) {
			return {
				text: `insert code lol`,
			};
		}

		var code = {
			code: msg.args.join(' '),
		};

		await fs.writeFile('src/util/twitch/porocodes.json', JSON.stringify(code) + '\n', 'utf8');
		await exec('cd /home/DontAddThisBot && git reset --hard && git pull && yarn', (err) => {
			if (err) {
				console.error(err);
				return {
					text: `FeelsDankMan !!! failed to pull commit`,
					reply: false,
				};
			}
		});
		await client.say(msg.channel.login, 'Reset code, restarting.. MrDestructoid');
		process.exit(0);
	},
};
