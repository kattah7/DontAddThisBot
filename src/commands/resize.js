const fetch = require('node-fetch');
const { SearchSTVEmote } = require('../token/stvGQL');

module.exports = {
	tags: '7tv',
	name: 'ezgif',
	cooldown: 5000,
	aliases: ['resize'],
	description: 'ezgif twitch, 7tv emotes (Usage: |ezgif (emote), bttv and ffz not supported)',
	execute: async (client, msg) => {
		if (!msg.args[0]) {
			return {
				text: `⛔ Please specify an emote`,
				reply: true,
			};
		}

		const ezGif = 'https://ezgif.com/reszie?url=';
		const [url] = msg.args;
		if (/https:\/\/(next\.)?7tv\.app\/emotes\/\w{24}/g.test(url)) {
			const linkEmote = /https:\/\/(next\.)?7tv\.app\/emotes\/(\w{24})/.exec(url);
			return {
				text: ezGif + `https://cdn.7tv.app/emote/${linkEmote[2]}/4x`,
			};
		}

		const twitchEmote = msg.emotes[0];
		if (twitchEmote) {
			return {
				text: ezGif + `https://static-cdn.jtvnw.net/emoticons/v2/${twitchEmote['id']}/default/dark/3.0`,
				reply: true,
			};
		} else {
			const getEmote = await fetch(`https://api.ivr.fi/v2/twitch/emotes/${msg.args[0]}`).then((res) => res.json());
			if (getEmote.error) {
				const { emote_set } = await fetch(`https://7tv.io/v3/users/twitch/${msg.channel.id}`).then((res) => res.json());
				const findEmote = emote_set['emotes'].find((e) => e['name'] === msg.args[0]);
				if (!findEmote) {
					const searchEmote = await SearchSTVEmote(msg.args[0], false);
					if (searchEmote.errors) {
						return {
							text: `⛔ ${searchEmote.errors[0].extensions.message}`,
							reply: true,
						};
					}

					return {
						text: ezGif + `https://cdn.7tv.app/emote/${searchEmote['data']['emotes']['items'][0]['id']}/4x`,
						reply: true,
					};
				}

				return {
					text: ezGif + `https://cdn.7tv.app/emote/${findEmote['id']}/4x`,
					reply: true,
				};
			}

			return {
				text: ezGif + `${getEmote.emoteURL.replace('1.0', '4.0')}`,
				reply: true,
			};
		}
	},
};
