const { GlobalEmote } = require('../token/stvREST');
const { AliasSTVEmote } = require('../token/stvGQL');

module.exports = {
	tags: '7tv',
	name: `alias`,
	description: `alias 7tv emotes, |alias (emote) (name)`,
	aliases: ['rename'],
	cooldown: 5000,
	stv: true,
	execute: async (client, msg) => {
		const Emote = GlobalEmote();
		if (!msg.args[0] || !msg.args[1]) {
			return {
				text: `⛔ Please specify an ${msg.args[0] ? `alias` : `emote`}`,
				reply: true,
			};
		}

		const { emote_sets, connections } = msg.sevenTV.user;
		const findChannel = connections.find((x) => x.id === msg.channel.id);
		if (!findChannel || emote_sets.length === 0) {
			return {
				text: `⛔ Not connected to this channel`,
				reply: true,
			};
		}

		const findChannelEmoteSet = emote_sets.find((x) => x.id === findChannel.emote_set_id);
		if (findChannelEmoteSet?.length === 0 || !findChannelEmoteSet) {
			return {
				text: `⛔ No emote set enabled`,
				reply: true,
			};
		}

		const findThatEmote = findChannelEmoteSet.emotes?.find((x) => x.name === msg.args[0]);
		if (!findThatEmote) {
			return {
				text: `⛔ I could not find that emote`,
				reply: true,
			};
		}

		const alias = await AliasSTVEmote(findThatEmote.id, findChannelEmoteSet.id, msg.args[1]);
		if (alias.errors) {
			return {
				text: `⛔ ${alias.errors[0].extensions.message}`,
				reply: true,
			};
		} else {
			return {
				text: `${Emote} "${findThatEmote.name}" renamed to "${msg.args[1]}"`,
				reply: true,
			};
		}
	},
};
