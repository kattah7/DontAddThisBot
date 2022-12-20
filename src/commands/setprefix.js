module.exports = {
	tags: 'moderation',
	name: 'setprefix',
	description: 'changes the bot prefix for your channel (default is "|")',
	cooldown: 3000,
	permission: 2,
	aliases: [],
	usage: '<prefix>',
	async execute(client, msg) {
		if (!msg.args.length) return { text: `you need to specify the prefix`, reply: true };
		const prefix = msg.args[0].toLowerCase();
		if (prefix.length > 15) return { text: `prefix too long, the maximum length is 15 characters`, reply: true };
		if (prefix === msg.prefix) return { text: `the channel prefix is already set to ${prefix}`, reply: true };
		if (prefix.startsWith('.') || prefix.startsWith('/')) return { text: `the prefix was not set, this character is reserved for twitch commands` };

		await bot.DB.channels.updateOne({ id: msg.channel.id }, { $set: { prefix: prefix } }).exec();
		return { text: `prefix changed to "${prefix}" lol`, reply: true };
	},
};
