const regex = require('../misc/regex');

module.exports = {
	tags: 'moderation',
	name: 'pyramid',
	cooldown: 10000,
	description: 'Pyramid command in chat',
	aliases: [],
	permission: 1,
	botPerms: 'vip',
	async execute(client, msg) {
		const size = msg.args[0];
		const emote = msg.args.slice(1).join(' ') + ' ';

		if (msg.args.length < 2) return { text: 'you need to include at least 2 args', reply: true };
		if (isNaN(size)) return { text: `size should be a number`, reply: true };
		if (size > 20) return { text: `the maximum size is 20`, reply: true };
		if (size < 2) return { text: `the minimum size is 2`, reply: true };
		if (regex.racism.test(emote)) return { text: `🤨` };
		if (regex.nonEnglish.test(emote))
			return {
				text: `malformed text parameter`,
				reply: true,
			};
		if (regex.slurs.test(emote)) {
			return {
				text: `malformed text parameter`,
				reply: true,
			};
		}

		for (let i = 1; i <= size; i++) {
			client.say(msg.channel.login, emote.repeat(i));
			await new Promise((r) => setTimeout(r, 70));
		}

		for (let i = size - 1; i > 0; i--) {
			client.say(msg.channel.login, emote.repeat(i));
			await new Promise((r) => setTimeout(r, 70));
		}
	},
};
