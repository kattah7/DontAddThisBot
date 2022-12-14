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
	execute: async (message, args, client, userdata, params, channelInfo, cmd, channelStvInfo) => {
		const Emote = GlobalEmote();
		if (!args[0] || !params.from) {
			return {
				text: `⛔ Please specify an ${args[0] ? 'channel, Usage: |yoink <emotes...mutiple> from:<channel>' : 'emote'}`,
			};
		}

		const { emote_sets, connections } = channelStvInfo.user;
		const findChannel = connections.find((x) => x.id === message.channelID);
		if (!findChannel || emote_sets.length === 0) {
			return {
				text: `⛔ Not connected to this channel`,
			};
		}

		const targetChannel = (await ParseUser(params.from)).toLowerCase();
		const targetChannelID = await IDByLogin(targetChannel);
		if (!targetChannelID || targetChannelID === null) {
			return {
				text: `⛔ Channel not found on Twitch`,
			};
		}

		const targetChannelStv = await getUserRest(targetChannelID);
		if (!targetChannelStv || targetChannelStv === null) {
			return {
				text: `⛔ Channel never logged into 7tv`,
			};
		}

		const { emote_set } = targetChannelStv;
		const senderInputEmotes = new Set(args);
		const findEmotes = emote_set.emotes?.filter((x) => senderInputEmotes.has(x.name));
		if (!findEmotes || findEmotes.length === 0) {
			return {
				text: `⛔ No emotes found`,
			};
		}

		const findChannelEmoteSet = emote_sets.find((x) => x.id === findChannel.emote_set_id);
		if (findChannelEmoteSet?.length === 0 || !findChannelEmoteSet) {
			return {
				text: `⛔ No emote set enabled`,
			};
		}

		let pushEmotes = [];
		let pushAliases = [];
		let errorMessage = '';
		let errorCode = 0;
		await Promise.all(
			findEmotes.map(async (x) => {
				const addEmote = await AddSTVEmote(x.id, findChannelEmoteSet.id);
				if (addEmote?.data?.emoteSet != null) {
					pushEmotes.push(x.name);
				} else {
					errorCode = addEmote.errors[0].extensions.code;
					errorMessage = `${addEmote.errors[0]?.extensions?.message}`;
				}

				if (x.name != x.data.name) {
					const aliasEmote = await AliasSTVEmote(x.id, findChannelEmoteSet.id, x.name);
					if (aliasEmote?.data?.emoteSet != null) {
						pushAliases.push(x.name);
					}
				}
			}),
		);

		if (findEmotes.length === 1) {
			if (errorMessage) {
				return {
					text: `⛔ ${errorMessage}`,
				};
			} else {
				return {
					text: `${Emote} Added "${pushEmotes[0]}" to your emote set`,
				};
			}
		}

		if (pushEmotes.length === 0) {
			if (errorCode) {
				return {
					text: `⛔ ${errorMessage}`,
				};
			}
		}

		return {
			text: `${Emote} Added ${pushEmotes.length} emotes from ${targetChannel} to your emote set${pushAliases.length > 0 ? `, and auto-aliased ${pushAliases.length} emote` : ''}`,
		};
	},
};
