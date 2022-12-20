module.exports = {
	tags: 'moderation',
	name: 'poroonly',
	cooldown: 3000,
	description: 'Make the bot only allow poro commands',
	permission: 2,
	offline: true,
	execute() {
		return {
			text: `This command has been deprecated. Please use |disable instead.`,
			reply: true,
		};
	},
};
