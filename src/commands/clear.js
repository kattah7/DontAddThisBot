module.exports = {
	tags: 'moderation',
	name: 'clear',
	description: 'Clears the chat',
	cooldown: 5000,
	aliases: [],
	permission: 1,
	botPerms: 'mod',
	async execute(client, msg) {
		const Input = msg.args[0];
		Input
			? isNaN(Input)
				? await client.say(msg.channel.login, `Please put a valid nunmber :)`)
				: Input > 100
				? await client.say(msg.channel.login, `You can only put less than 100 :)`)
				: clearChat(Input)
			: clearChat(50);
		function clearChat(amount) {
			for (let i = 0; i < amount; i++) {
				client.privmsg(msg.channel.login, `.clear`);
			}
		}
	},
};
