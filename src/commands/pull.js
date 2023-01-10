const { exec, spawn } = require('child_process');
const { postgres } = require('../../config.json');

module.exports = {
	name: 'pull',
	aliases: [],
	cooldown: 3000,
	kattah: true,
	description: 'Pulls the latest commit from github. (Kattah only)',
	execute: async (client, msg) => {
		exec('cd /home/DontAddThisBot && git reset --hard && git pull && yarn', (err) => {
			if (err) {
				console.error(err);
				return {
					text: `FeelsDankMan !!! failed to pull commit`,
					reply: true,
				};
			}
		});

		const mongoDump = spawn('mongodump', ['--db=dontaddthisbot', '--out=dump/']);
		mongoDump.stderr.on('data', (data) => {
			console.error(`child stderr:\n${data}`);
		});

		const cwd = process.cwd();
		const path1 = `${cwd}/psqldump/dontaddthisbot/data.sql`;
		const child1 = spawn('pg_dump', ['-U', 'postgres', '-h', 'localhost', '-d', 'dontaddthisbot', '-f', path1], {
			env: { PGPASSWORD: postgres.password },
		});
		child1.stderr.on('data', (data) => {
			console.error(`child stderr:\n${data}`);
		});

		const path2 = `${cwd}/psqldump/dontaddthisbot/data.tar`;
		const child2 = spawn('pg_dump', ['--format=custom', '-U', 'postgres', '-h', 'localhost', '-d', 'dontaddthisbot', '-f', path2], {
			env: { PGPASSWORD: postgres.password },
		});
		child2.stderr.on('data', (data) => {
			console.error(`child stderr:\n${data}`);
		});

		await client.say(msg.channel.login, 'Commit pulled, restarting.. MrDestructoid');
		process.exit(0);
	},
};
