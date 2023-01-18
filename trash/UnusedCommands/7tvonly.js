module.exports = {
	tags: 'moderation',
	name: '7tvonly',
	aliases: ['7tvonly'],
	cooldown: 3000,
	description: '7tv only cmds',
	permission: 2,
	execute(client, msg) {
		return {
			text: `This command has been deprecated. Please use |disable instead.`,
			reply: false,
		};
	},
};
