module.exports = {
	tags: 'stats',
	name: 'commands',
	aliases: ['help'],
	cooldown: 3000,
	execute() {
		return {
			text: `https://docs.poros.lol WutFace`,
			reply: true,
		};
	},
};
