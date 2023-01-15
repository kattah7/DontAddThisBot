module.exports = {
	tags: '7tv',
	name: '7tveditor',
	description: 'Usage: |editor add/remove <username>',
	aliases: ['editor'],
	cooldown: 3000,
	permission: 2,
	async execute(client, msg) {
		return {
			text: `This command has been deprecated. Please use https://poros.lol/dashboard/${msg.channel.login}/channel/editors`,
			reply: true,
		};
	},
};
