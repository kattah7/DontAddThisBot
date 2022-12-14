const { GetEmotes, GlobalEmote } = require('../token/stvREST');
const { AddSTVEmote, SearchSTVEmote } = require('../token/stvGQL');

module.exports = {
	tags: '7tv',
	name: 'add',
	description: 'add 7tv emotes, |add (emote), or |add (emote) (tag)',
	cooldown: 5000,
	aliases: [],
	stv: true,
	execute: async (message, args, client, userdata, params, channelInfo, cmd, channelStvInfo) => {
		const Emote = GlobalEmote();
		if (!args[0]) {
			return {
				text: `⛔ No emote specified`,
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

		async function AddEmote(emote, setID) {
			const isParams = params.as ? params.as : '';
			const addEmote = await AddSTVEmote(emote, setID, isParams);
			let text = '';
			if (addEmote.errors) {
				text = `⛔ ${addEmote.errors[0].extensions.message}`;
			} else {
				const { name } = await GetEmotes(emote);
				text = `${Emote} "${name}" added to ${message.channelName} ${isParams ? `as "${isParams}"` : ''}`;
			}

			return text;
		}

		const [url] = args;
		if (/https:\/\/(next\.)?7tv\.app\/emotes\/\w{24}/g.test(url)) {
			const linkEmote = /https:\/\/(next\.)?7tv\.app\/emotes\/(\w{24})/.exec(url);
			const result = await AddEmote(linkEmote[2], findChannelEmoteSet.id);
			return {
				text: result,
			};
		}

		const isHashTag = /#/.test(args);
		const SearchEmote = await SearchSTVEmote(isHashTag ? args[1] : args[0], isHashTag ? false : true);
		const { data, errors } = SearchEmote;

		let findEmote;
		if (isHashTag) {
			if (/#/.test(args[0])) {
				return {
					text: `⛔ Usage: ${channelInfo.prefix ?? `|`}add (emote) (tags)`,
				};
			}

			const xda = data.emotes.items.map((x) => [x.id, x.name]);
			const findThatEmote = xda.find((x) => x[1] === args[0]);
			if (!findThatEmote) {
				return {
					text: `⛔ No emote found for tags "${args[1]}"`,
				};
			}
			findEmote = findThatEmote;
		}

		if (errors) {
			return {
				text: `⛔ ${errors[0]?.extensions?.message}`,
			};
		}

		if (data.emotes?.items?.length === 0) {
			return {
				text: `⛔ No emote found "${args[0]}", make sure its case sensitive or use the tags feature`,
			};
		} else {
			const { id } = data.emotes?.items[0];
			const Result = await AddEmote(findEmote ? findEmote[0] : id, findChannelEmoteSet.id);
			return {
				text: Result,
			};
		}
	},
};
