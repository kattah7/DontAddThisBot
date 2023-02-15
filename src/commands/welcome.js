const { ParseUser } = require('../util/twitch/utils.js');

module.exports = {
	tags: 'moderation',
	name: 'welcome',
	aliases: [],
	cooldown: 3000,
	description: 'Give a new viewer a welcoming message <3',
	botPerms: 'vip',
	canOptout: true,
	target: null,
	execute: async (client, msg) => {
		if (!msg.args[0]) {
			return {
				text: `Usage: !welcome <message>`,
				reply: true,
			};
		}
		const targetUser = ParseUser(msg.args[0].toLowerCase());
		const channelName = msg.channel.login;
		client.say(channelName, `https://www.twitchdatabase.com/following/${targetUser}`);
		client.say(channelName, `https://twitchtracker.com/${targetUser}`);
		client.say(channelName, `https://logs.zzls.xyz/?channel=${channelName}&username=${targetUser}`);
		client.say(channelName, `https://logs.ivr.fi/?channel=${channelName}&username=${targetUser}`);
		client.say(channelName, `https://logs.zneix.eu/?channel=${channelName}&username=${targetUser}`);
		client.say(channelName, `https://justlog.kkx.one//?channel=${channelName}&username=${targetUser}`);
		client.say(channelName, `https://logs.mmattbot.com//?channel=${channelName}&username=${targetUser}`);
		client.say(channelName, `https://logs.magichack.xyz//?channel=${channelName}&username=${targetUser}`);
		client.say(channelName, `https://justlog.kkx.one//?channel=${channelName}&username=${targetUser}`);
		client.say(channelName, `https://vtlogs.moe//?channel=${channelName}&username=${targetUser}`);
		client.say(channelName, `https://logs.fuchsty.de//?channel=${channelName}&username=${targetUser}`);
		client.say(channelName, `https://logs.supa.codes//?channel=${channelName}&username=${targetUser}`);
		client.say(channelName, `https://modlookup.3v.fi/u/${targetUser}`);
		client.say(channelName, `https://www.twitchdatabase.com/roles/${targetUser}`);
	},
};
