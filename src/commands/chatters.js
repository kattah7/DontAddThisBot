const got = require('got');
const { ParseUser } = require('../util/twitch/utils.js');
const fetch = require('node-fetch');

module.exports = {
	tags: 'stats',
	name: 'chatters',
	cooldown: 3000,
	aliases: [],
	description: 'Check active/viewerlist count',
	execute: async (client, msg) => {
		const targetUser = await ParseUser(msg.args[0] ?? msg.user.login);
		const { chatter_count } = await got(`http://tmi.twitch.tv/group/user/${targetUser.toLowerCase()}/chatters`).json();
		const { messages } = await fetch(`https://recent-messages.robotty.de/api/v2/recent-messages/${targetUser.toLowerCase()}`, {
			method: 'GET',
			headers: {
				'Cotent-Type': 'application/json',
			},
		}).then((res) => res.json());

		if (!messages) {
			return {
				text: `${targetUser} currently has ${chatter_count.toLocaleString()} users in viewerlist.`,
				reply: true,
			};
		}

		const users = [];
		const re = /^.+@(.+)\.tmi.twitch.tv\sPRIVMSG\s#.+$/i;

		for (let message of messages) {
			re.lastIndex = 0;
			const match = re.exec(message);
			if (match) {
				const user = match[1];
				if (!users.includes(user)) {
					users.push(user);
				}
			}
		}

		return {
			text: `${targetUser} currently has ${users.length} users chatted, ${chatter_count.toLocaleString()} users in viewerlist.`,
			reply: true,
		};
	},
};
