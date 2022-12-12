const { Announce } = require('../token/helix');

module.exports = {
	tags: 'moderation',
	name: 'announce',
	description: 'annoucement in chat (Requires Mod)',
	cooldown: 3000,
	permission: 1,
	aliases: ['ann'],
	botPerms: 'mod',
	async execute(message, args) {
		if (!args[0]) {
			return {
				text: 'Please put a message to announce',
			};
		}
		const msg = args.join(' ');
		if (regex.racism.test(msg)) return { text: `🤨` };
		if (regex.nonEnglish.test(msg) || regex.slurs.test(msg)) {
			return {
				text: `malformed text parameter`,
			};
		}

		await Announce(message.channelID, msg);
	},
};
