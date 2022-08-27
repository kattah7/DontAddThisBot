const utils = require("../util/utils.js");

module.exports = {
    name: 'add',
    description: 'add 7tv emotes',
    cooldown: 5000,
    stv: true,
    execute: async (message, args, client, xd, params) => {
        const StvID = await utils.stvNameToID(message.channelName);
        const channelEmotes = await utils.EmoteSets(StvID);
        const SearchEmote = await utils.SearchSTVEmote(args[0], true);
        if (params.emote == "all") {
            const SearchEmoteParams = await utils.SearchSTVEmote(args[0], false);
            if (SearchEmoteParams.errors) {
                return {
                    text: `⛔ ${SearchEmoteParams.errors[0].extensions.message}`,
                };
            };

            for (const emotes of SearchEmoteParams.data.emotes.items) {
                utils.AddSTVEmote(emotes.id, StvID);
            };

            return {
                text: `7tvM Added all emotes related to "${args[0]}", Note that this may be buggy.`,
            };
        }

        if (SearchEmote.errors) {
            return {
                text: `⛔ ${SearchEmote.errors[0].extensions.message}`,
            };
        };

        if (params.set) {
            const findParamEmoteSet = channelEmotes.find((x) => x.name == params.set);
            if (!findParamEmoteSet) {
                return {
                    text: `⛔ set "${params.set}" Not found.`,
                };
            };

            const addEmote = await utils.AddSTVEmote(SearchEmote.data.emotes.items[0].id, findParamEmoteSet.id);
            if (addEmote.errors) {
                return {
                    text: `⛔ ${addEmote.errors[0].extensions.message}`,
                };
            } else {
                return {
                    text: `7tvM ${args[0]} added to ${params.set}`,
                };
            };
        };

        const findChannel = channelEmotes.find((x) => x.id == StvID);
        if (!findChannel) {
            return {
                text: `⛔ ${message.channelName} Not found.`,
            }
        };

        const [url] = args;
        if (/https:\/\/(next\.)?7tv\.app\/emotes\/\w{24}/g.test(url)) {
            const linkEmote = /https:\/\/(next\.)?7tv\.app\/emotes\/(\w{24})/.exec(url);
            const addEmote = await utils.AddSTVEmote(linkEmote[2], findChannel.id);
            if (addEmote.errors) {
                return {
                    text: `⛔ ${addEmote.errors[0].extensions.message}`,
                };
            } else {
                const channelEmotes = addEmote.data.emoteSet.emotes;
                const findAddedEmote = channelEmotes.find((x) => x.id == linkEmote[2]);
                return {
                    text: `7tvM "${findAddedEmote.name}" added to ${message.channelName}`,
                };
            };
        };

        const addEmote = await utils.AddSTVEmote(SearchEmote.data.emotes.items[0].id, findChannel.id);
        if (addEmote.errors) {
            return {
                text: `⛔ ${addEmote.errors[0].extensions.message}`,
            };
        } else {
            return {
                text: `7tvM "${args[0]}" added to ${message.channelName}`,
            };
        };

    }
};