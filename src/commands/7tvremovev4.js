const { GlobalEmote } = require('../token/stvREST');
const { RemoveSTVEmote } = require('../token/stvGQL');

module.exports = {
	tags: '7tv',
	name: 'remove',
	description: 'remove 7tv emotes, |remove (emotes...mutiple)',
	cooldown: 5000,
	aliases: [],
	stv: true,
	execute: async (message, args, client, userdata, params, channelInfo, cmd, channelStvInfo) => {
		const Emote = GlobalEmote();
		if (!args[0]) {
			return {
				text: '⛔ Please specify an emote',
			};
		}

		const { emote_sets, connections } = channelStvInfo.user;
		const findChannel = connections.find((x) => x.id === message.channelID);
		if (!findChannel || emote_sets.length === 0) {
			return {
				text: `⛔ Not connected to this channel`,
			};
		}

		const findChannelEmoteSet = emote_sets.find((x) => x.id === findChannel.emote_set_id);
		if (findChannelEmoteSet?.length === 0 || !findChannelEmoteSet) {
			return {
				text: `⛔ No emote set enabled`,
			};
		}

		const inputSenderEmotes = new Set(args);
		const findEmotes = findChannelEmoteSet.emotes.filter((x) => inputSenderEmotes.has(x.name));
		if (findEmotes.length === 0 || !findEmotes) {
			return {
				text: `⛔ I could not find that emote`,
			};
		}

		const getEmoteIDsAndRemove = findEmotes.map((x) => RemoveSTVEmote(x.id, findChannelEmoteSet.id));
		let amount = 0;
		const resolved = await Promise.all(getEmoteIDsAndRemove);
		if (resolved[0].data.emoteSet !== null) {
			amount = resolved.length;
		}

		return {
			text: `${Emote} ${amount <= 1 ? `"${args[0]}"` : `${amount} emotes`} removed from ${message.channelName}`,
		};
	},
};
