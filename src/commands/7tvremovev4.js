const { getUser, GlobalEmote } = require('../token/stvREST');
const { RemoveSTVEmote, GetAllEmoteSets } = require('../token/stvGQL');

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

		const { emote_set, user } = channelStvInfo;
		if (!emote_set) {
			return {
				text: `⛔ No emote set found`,
			};
		}

		const { data } = await GetAllEmoteSets(user.id);
		const findThatEmoteSet = data.user.emote_sets.find((set) => set.id === emote_set.id);
		const emotes = new Set(args);
		const findEmotes = findThatEmoteSet.emotes?.filter((x) => emotes.has(x.name));

		if (findEmotes?.length === 0) {
			return {
				text: `⛔ No emotes found`,
			};
		}

		const getEmoteIDsAndRemove = findEmotes.map((x) => RemoveSTVEmote(x.id, emote_set.id));
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
