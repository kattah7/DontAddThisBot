const { getUser, GetEmotes } = require('../token/stvREST');
const { AddSTVEmote, SearchSTVEmote } = require('../token/stvGQL');

module.exports = {
    tags: '7tv',
    name: 'add',
    description: 'add 7tv emotes, |add (emote)',
    cooldown: 5000,
    stv: true,
    stvOnly: true,
    execute: async (message, args, client, userdata, params, channelInfo) => {
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

        const [url] = args;
        if (/https:\/\/(next\.)?7tv\.app\/emotes\/\w{24}/g.test(url)) {
            const linkEmote = /https:\/\/(next\.)?7tv\.app\/emotes\/(\w{24})/.exec(url);
            const addEmote = await AddSTVEmote(linkEmote[2], emote_set.id);
            if (addEmote.errors) {
                return {
                    text: `⛔ ${addEmote.errors[0].extensions.message}`,
                };
            } else {
                const { name } = await GetEmotes(linkEmote[2]);
                return {
                    text: `7tvM "${name}" added to ${message.channelName}`,
                };
            }
        }

        const isHashTag = /#/.test(args);
        const SearchEmote = await SearchSTVEmote(isHashTag ? args[1] : args[0], false);
        let findEmote;
        if (isHashTag) {
            if (/#/.test(args[0])) {
                return {
                    text: `⛔ Usage: ${channelInfo.prefix ?? `|`}add (emote) (tags)`,
                };
            }
            const xda = SearchEmote.data.emotes.items.map((x) => [x.id, x.name]);
            const findThatEmote = xda.find((x) => x[1] === args[0]);
            if (!findThatEmote) {
                return {
                    text: `⛔ No emote found for tags "${args[0]}"`,
                };
            }
            findEmote = findThatEmote;
        }

        if (SearchEmote.errors) {
            return {
                text: `⛔ ${SearchEmote.errors[0]?.extensions?.message}`,
            };
        } else {
            const { id, name } = SearchEmote.data.emotes?.items[0];
            const addEmote = await AddSTVEmote(findEmote ? findEmote[0] : id, emote_set.id);
            if (addEmote.errors) {
                return {
                    text: `⛔ ${addEmote.errors[0]?.extensions?.message}`,
                };
            } else {
                return {
                    text: `7tvM "${findEmote ? findEmote[1] : name}" added to ${message.channelName}`,
                };
            }
        }
    },
};
