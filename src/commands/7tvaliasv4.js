const { GlobalEmote } = require('../token/stvREST');
const { AliasSTVEmote } = require('../token/stvGQL');

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

		const findThatEmote = findChannelEmoteSet.emotes?.find((x) => x.name === args[0]);
		if (!findThatEmote) {
			return {
				text: `⛔ I could not find that emote`,
			};
		}

		const alias = await AliasSTVEmote(findThatEmote.id, findChannelEmoteSet.id, args[1]);
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
