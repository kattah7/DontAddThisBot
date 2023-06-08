module.exports = {
	tags: 'stats',
	name: 'restart',
	aliases: [''],
	cooldown: 3000,
	level: 3,
	description: 'restart',
	execute: async (client, msg) => {
		client.say(msg.channel.login, 'Restarting...');
		process.exit(1);
	},
};
