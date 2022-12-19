const regex = require('../misc/regex');

module.exports = {
	tags: 'moderation',
	name: 'pyramid',
	cooldown: 10000,
	description: 'Pyramid command in chat',
	aliases: [],
	permission: 1,
	botPerms: 'vip',
	async execute(message, args, client) {
		const size = args[0];
		const emote = args.slice(1).join(' ') + ' ';

		if (args.length < 2) return { text: 'you need to include at least 2 args' };
		if (isNaN(size)) return { text: `size should be a number` };
		if (size > 20) return { text: `the maximum size is 20` };
		if (size < 2) return { text: `the minimum size is 2` };
		if (/^[^\x00-\x7F]/i.test(emote)) return { text: `malformed text parameter` };
		if (regex.racism.test(emote)) return { text: `🤨` };
		if (regex.nonEnglish.test(emote))
			return {
				text: `malformed text parameter`,
			};
		if (regex.slurs.test(emote)) {
			return {
				text: `malformed text parameter`,
			};
		}

		for (let i = 1; i <= size; i++) {
			client.say(message.channelName, emote.repeat(i));
			await new Promise((r) => setTimeout(r, 70));
		}

		for (let i = size - 1; i > 0; i--) {
			client.say(message.channelName, emote.repeat(i));
			await new Promise((r) => setTimeout(r, 70));
		}
	},
};
