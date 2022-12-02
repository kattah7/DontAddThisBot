const { getUser, GetEmotes, GlobalEmote } = require('../token/stvREST');
const { AddSTVEmote, SearchSTVEmote } = require('../token/stvGQL');

module.exports = {
    tags: '7tv',
    name: 'add',
    description: 'add 7tv emotes, |add (emote), or |add (emote) (tag)',
    cooldown: 5000,
    stv: true,
    stvOnly: true,
    execute: async (message, args, client, userdata, params, channelInfo) => {
        const Emote = GlobalEmote();
        if (!args[0]) {
            return {
                text: `⛔ No emote specified`,
            };
        }

        const xd = await getUser(message.channelID);
        if (xd === null) {
            return {
                text: `⛔ Unknown user`,
            };
        }

        const { emote_set } = xd;
        const isParams = params.as ? params.as : '';

        const [url] = args;
        if (/https:\/\/(next\.)?7tv\.app\/emotes\/\w{24}/g.test(url)) {
            const linkEmote = /https:\/\/(next\.)?7tv\.app\/emotes\/(\w{24})/.exec(url);
            const addEmote = await AddSTVEmote(linkEmote[2], emote_set.id, isParams);
            if (addEmote.errors) {
                return {
                    text: `⛔ ${addEmote.errors[0].extensions.message}`,
                };
            } else {
                const { name } = await GetEmotes(linkEmote[2]);
                return {
                    text: `${Emote} "${name}" added to ${message.channelName} ${isParams ? `as "${isParams}"` : ''}`,
                };
            }
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
                text: `⛔ ${errors[0]?.extensions?.message}; Use the tags feature for accurate results, ${
                    channelInfo.prefix ?? `|`
                }add (emote) (tags)`,
            };
        } else if (data.emotes?.items?.length === 0) {
            return {
                text: `⛔ No emote found "${args[0]}", make sure its case sensitive or use the tags feature`,
            };
        } else {
            const { id, name } = data.emotes?.items[0];
            const addEmote = await AddSTVEmote(findEmote ? findEmote[0] : id, emote_set.id, isParams);
            if (addEmote.errors) {
                return {
                    text: `⛔ ${addEmote.errors[0]?.extensions?.message}`,
                };
            } else {
                return {
                    text: `${Emote} "${findEmote ? findEmote[1] : name}" added to ${message.channelName} ${
                        isParams ? `as "${isParams}"` : ''
                    }`,
                };
            }
        }
    },
};
