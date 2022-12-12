const got = require('got');

module.exports = {
	tags: 'moderation',
	name: 'massping',
	cooldown: 3000,
	permission: 2,
	aliases: [],
	description: ':tf:',
	botPerms: 'vip',
	execute: async (message, args, client) => {
		if (!args[0]) {
			return {
				text: 'Please provide a message to send.',
			};
		}
		if (/[^\x00-\x7F]/i.test(args.join(' '))) return { text: `malformed text parameter` };
		if (regex.racism.test(args.join(' '))) return { text: `🤨` };
		const { chatters } = await got(`https://tmi.twitch.tv/group/user/${message.channelName}/chatters`).json();
		for (const chatter of [
			...chatters.broadcaster,
			...chatters.moderators,
			...chatters.vips,
			...chatters.viewers,
		]) {
			client.say(message.channelName, `${chatter} ${args.join(' ')}`);
			await new Promise((resolve) => setTimeout(resolve, 30));
		}
	},
};
