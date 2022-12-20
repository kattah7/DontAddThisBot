const { Announce } = require('../token/helix');
const regex = require('../misc/regex');

module.exports = {
	tags: 'moderation',
	name: 'announce',
	description: 'annoucement in chat (Requires Mod)',
	cooldown: 3000,
	permission: 1,
	aliases: ['ann'],
	botPerms: 'mod',
	async execute(client, msg) {
		if (!msg.args[0]) {
			return {
				text: 'Please put a message to announce',
				reply: true,
			};
		}
		const messages = msg.args.join(' ');
		if (regex.racism.test(messages)) return { text: `🤨` };
		if (regex.nonEnglish.test(messages) || regex.slurs.test(messages)) {
			return {
				text: `malformed text parameter`,
				reply: true,
			};
		}

		await Announce(msg.channel.id, messages);
	},
};
