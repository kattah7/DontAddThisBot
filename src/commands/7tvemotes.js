const { getUser, GlobalEmote } = require('../token/stvREST');
const { ParseUser, IDByLogin, sleep } = require('../util/twitch/utils');

module.exports = {
	tags: '7tv',
	name: '7tvemotes',
	aliases: ['emotes'],
	cooldown: 3000,
	description: 'Display all 7tv emotes in chat',
	botPerms: 'vip',
	execute: async (client, msg) => {
		const Emote = GlobalEmote();
		async function returnTargetID(targetName) {
			const targetUser = ParseUser(targetName);
			const getUserID = await IDByLogin(targetUser);

			return getUserID;
		}

		const user = await getUser(msg.args[0] ? await returnTargetID(msg.args[0]) : msg.channel.id);
		const isSelfOrTarget = msg.args[0] ?? msg.channel.login;
		if (!user || user === null) {
			return {
				text: `${Emote} - ${isSelfOrTarget} UNKOWN USER`,
				reply: true,
			};
		}

		const { emotes } = user.emote_set;
		if (!emotes || emotes.length === 0) {
			return {
				text: `${Emote} - ${isSelfOrTarget} has no emotes`,
				reply: true,
			};
		}

		let emotesArray = new Array();
		let emotesLength = 0;

		for (let i = 0; i < emotes.length; i++) {
			const emote = emotes[i];

			if (emotesLength + emote.name.length + 1 > 490) {
				emotesArray.push(emotesLength);
				emotesLength = 0;
			}

			emotesArray.push(emote.name);
			emotesLength += emote.name.length + 1;
		}

		emotesArray.push(emotesLength);

		let emotesString = '';
		let emotesArrayIndex = 0;
		let emotesArrayLength = emotesArray.length;

		for (let i = 0; i < emotesArrayLength; i++) {
			const emote = emotesArray[i];

			if (typeof emote === 'number') {
				emotesString += emotesArray.slice(emotesArrayIndex, i).join(' ');
				emotesArrayIndex = i + 1;
				await client.say(msg.channel.login, emotesString);
				emotesString = '';
				await sleep(30);
			}
		}

		const capacity = user.emote_capacity;
		return {
			text: `${Emote} - ${isSelfOrTarget} has ${emotes.length}/${capacity} 7tv emotes`,
			reply: true,
		};
	},
};
