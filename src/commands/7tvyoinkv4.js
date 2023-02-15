const { getUser: getUserRest, GlobalEmote } = require('../token/stvREST');
const { AddSTVEmote, AliasSTVEmote } = require('../token/stvGQL');
const { ParseUser, IDByLogin } = require('../util/twitch/utils');

module.exports = {
	tags: '7tv',
	name: 'yoink',
	description: 'yoink 7tv emotes, Usage: |yoink (emotes...mutiple) from:(channel)',
	cooldown: 5000,
	aliases: [],
	stv: true,
	execute: async (client, msg) => {
		const Emote = GlobalEmote();
		const target = msg.params.from ?? msg.hashtag[0];
		if (!msg.args[0] || !target || target.length === 0) {
			return {
				text: `⛔ Please specify an ${msg.args[0] ? 'channel, Usage: |yoink <emotes...mutiple> from:<channel> or specify channel using #forsen' : 'emote'}`,
				reply: false,
			};
		}

		const { emote_sets, connections } = msg.sevenTV.user;
		const findChannel = connections.find((x) => x.id === msg.channel.id);
		if (!findChannel || emote_sets.length === 0) {
			return {
				text: `⛔ Not connected to this channel`,
				reply: false,
			};
		}

		const targetChannel = ParseUser(target);
		const targetChannelID = await IDByLogin(targetChannel);
		if (!targetChannelID || targetChannelID === null) {
			return {
				text: `⛔ Channel not found on Twitch`,
				reply: false,
			};
		}

		const targetChannelStv = await getUserRest(targetChannelID);
		if (!targetChannelStv || targetChannelStv === null) {
			return {
				text: `⛔ Channel never logged into 7tv`,
				reply: false,
			};
		}

		const { emote_set } = targetChannelStv;
		const senderInputEmotes = new Set(msg.args);
		const findEmotes = emote_set.emotes?.filter((x) => senderInputEmotes.has(x.name));
		if (!findEmotes || findEmotes.length === 0) {
			return {
				text: `⛔ No emotes found`,
				reply: false,
			};
		}

		const findChannelEmoteSet = emote_sets.find((x) => x.id === findChannel.emote_set_id);
		if (findChannelEmoteSet?.length === 0 || !findChannelEmoteSet) {
			return {
				text: `⛔ No emote set enabled`,
				reply: false,
			};
		}

		let pushEmotes = [];
		let pushAliases = [];
		let errorMessage = '';
		let errorCode = 0;
		await Promise.all(
			findEmotes.map(async (x) => {
				const isSameName = x.name !== x.data.name ? x.name : null;
				const addEmote = await AddSTVEmote(x.id, findChannelEmoteSet.id, isSameName);
				if (addEmote?.data?.emoteSet != null) {
					pushEmotes.push(x.name);
				} else {
					errorCode = addEmote.errors[0].extensions.code;
					errorMessage = `${addEmote.errors[0]?.extensions?.message}`;
				}

				if (x.name !== x.data.name) {
					pushAliases.push(x.name);
				}
			}),
		);

		if (findEmotes.length === 1) {
			if (errorMessage) {
				return {
					text: `⛔ ${errorMessage}`,
					reply: false,
				};
			} else {
				return {
					text: `${Emote} Added "${pushEmotes[0]}" to your emote set`,
					reply: false,
				};
			}
		}

		if (pushEmotes.length === 0) {
			if (errorCode) {
				return {
					text: `⛔ ${errorMessage}`,
					reply: false,
				};
			}
		}

		return {
			text: `${Emote} Added ${pushEmotes.length} emotes from ${targetChannel} to your emote set${pushAliases.length > 0 ? `, and auto-aliased ${pushAliases.length} emote` : ''}`,
			reply: false,
		};
	},
};
