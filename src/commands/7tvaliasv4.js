const { getUser, GlobalEmote } = require('../token/stvREST');
const { AliasSTVEmote, GetAllEmoteSets } = require('../token/stvGQL');

module.exports = {
	tags: '7tv',
	name: `alias`,
	description: `alias 7tv emotes, |alias (emote) (name)`,
	aliases: ['rename'],
	cooldown: 5000,
	stv: true,
	execute: async (message, args, client, userdata, params, channelInfo, cmd, channelStvInfo) => {
		const Emote = GlobalEmote();
		if (!args[0] || !args[1]) {
			return {
				text: `⛔ Please specify an ${args[0] ? `alias` : `emote`}`,
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
		const findThatEmote = findThatEmoteSet.emotes?.find((x) => x.name === args[0]);
		if (!findThatEmote) {
			return {
				text: `⛔ Emote not found`,
			};
		}

		const alias = await AliasSTVEmote(findThatEmote.id, emote_set.id, args[1]);
		if (alias.errors) {
			return {
				text: `⛔ ${alias.errors[0].extensions.message}`,
			};
		} else {
			return {
				text: `${Emote} "${findThatEmote.name}" renamed to "${args[1]}"`,
			};
		}
	},
};
