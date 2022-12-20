const { GetEmotes, GlobalEmote } = require('../token/stvREST');
const { AddSTVEmote, SearchSTVEmote } = require('../token/stvGQL');

module.exports = {
	tags: '7tv',
	name: 'add',
	description: 'add 7tv emotes, |add (emote), or |add (emote) (tag)',
	cooldown: 5000,
	aliases: [],
	stv: true,
	execute: async (client, msg) => {
		const Emote = GlobalEmote();
		if (!msg.args[0]) {
			return {
				text: `⛔ No emote specified`,
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

		async function AddEmote(emote, setID) {
			const isParams = msg.params.as ? msg.params.as : '';
			const addEmote = await AddSTVEmote(emote, setID, isParams);
			let text = '';
			if (addEmote.errors) {
				text = `⛔ ${addEmote.errors[0].extensions.message}`;
			} else {
				const { name } = await GetEmotes(emote);
				text = `${Emote} "${name}" added to ${msg.channel.login} ${isParams ? `as "${isParams}"` : ''}`;
			}

			return text;
		}

		const [url] = msg.args;
		if (/https:\/\/(next\.)?7tv\.app\/emotes\/\w{24}/g.test(url)) {
			const linkEmote = /https:\/\/(next\.)?7tv\.app\/emotes\/(\w{24})/.exec(url);
			const result = await AddEmote(linkEmote[2], findChannelEmoteSet.id);
			return {
				text: result,
				reply: true,
			};
		}

		const isHashTag = /#/.test(msg.args);
		const SearchEmote = await SearchSTVEmote(isHashTag ? msg.args[1] : msg.args[0], isHashTag ? false : true);
		const { data, errors } = SearchEmote;

		let findEmote;
		if (isHashTag) {
			if (/#/.test(msg.args[0])) {
				return {
					text: `⛔ Usage: ${msg.mongoChannel.prefix ?? `|`}add (emote) (tags)`,
					reply: true,
				};
			}

			const xda = data.emotes.items.map((x) => [x.id, x.name]);
			const findThatEmote = xda.find((x) => x[1] === msg.args[0]);
			if (!findThatEmote) {
				return {
					text: `⛔ No emote found for tags "${msg.args[1]}"`,
					reply: true,
				};
			}
			findEmote = findThatEmote;
		}

		if (errors) {
			return {
				text: `⛔ ${errors[0]?.extensions?.message}`,
				reply: true,
			};
		}

		if (data.emotes?.items?.length === 0) {
			return {
				text: `⛔ No emote found "${msg.args[0]}", make sure its case sensitive or use the tags feature`,
				reply: true,
			};
		} else {
			const SevenTVID = data?.emotes?.items[0].id;
			const Result = await AddEmote(findEmote ? findEmote[0] : SevenTVID, findChannelEmoteSet.id);
			return {
				text: Result,
				reply: true,
			};
		}
	},
};
