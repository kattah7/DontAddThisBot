const utils = require('../util/utils.js');

module.exports = {
    name: `alias`,
    description: `alias 7tv emotes`,
    aliases: ['rename'],
    cooldown: 5000,
    stv: true,
    stvOnly: true,
    execute: async (msg, args, client, xd, params) => {
        function findEmote (emote) {
            const findThatEmoteSet = channelEmotes.find((x) => x.owner.id == StvID);
            const findThatEmote = findThatEmoteSet.emotes.find((x) => x.name == emote);
            if (!findThatEmote) { return client.say(msg.channelName, `⛔ Emote "${args[0]}" not found in ${msg.channelName}`); }
            aliasEmote(findThatEmote.id, channelEmotes[0].id, args[1]);
        }

        function findEmoteParams (emote) {
            const findParamEmoteSet = channelEmotes.find((x) => x.name == params.set);
            if (!findParamEmoteSet) { return client.say(msg.channelName, `⛔ Emote set "${params.set}" not found`); }
            const findThatEmote = findParamEmoteSet.emotes.find((x) => x.name == emote);
            if (!findThatEmote) { return client.say(msg.channelName, `⛔ Emote "${args[0]}" not found in set ${params.set}`); }
            aliasEmote(findThatEmote.id, findParamEmoteSet.id, args[1]);
        }

        async function aliasEmote (emoteID, setID, aliasName) {
            renameEmote = await utils.AliasSTVEmote(emoteID, setID, aliasName);
            if (renameEmote.errors) {
                const { message, fields} = renameEmote.errors[0].extensions
                client.say(msg.channelName, `⛔ ${message}`);
                return false;
            } else {
                if (params.set) {
                    return client.say(msg.channelName, `7tvM Emote "${args[0]}" in set ${params.set} has been aliased to "${args[1]}"`);
                } else {
                    return client.say(msg.channelName, `7tvM Emote "${args[0]}" has been aliased to "${args[1]}"`);
                }
            }
        }

        if (!args[0] || !args[1]) {
            const doesArgsExist = args[0] ? `alias` : `emote`
            return {
                text: `7tvM Please specify an ${doesArgsExist}`,
            };
        }

        var regex = (/^set:(.*)$/g);
        if (regex.test(args[0]) || regex.test(args[1])) {
            var doesEmoteExist = regex.test(args[0]) || regex.test(args[1]) ? `alias` : `emote`
            return {
                text: `7tvM Please specify an correct ${doesEmoteExist}`,
            }
        }

        const StvID = await utils.stvNameToID(msg.channelID);
        const channelEmotes = await utils.EmoteSets(StvID);
        if (params.set) {
            findEmoteParams(args[0]);
        } else {
            findEmote(args[0]);
        }

    }
}