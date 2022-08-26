const utils = require("../util/utils.js");

module.exports = {
    name: 'remove',
    description: 'remove 7tv emotes',
    cooldown: 5000,
    stv: true,
    execute: async (message, args, client, xd, params) => {
        function removeEmote (emoteID, setID) {
            removeChannelEmote = utils.RemoveSTVEmote(emoteID, setID);
        };
        
        function findEmote (emote) {
            findThatEmoteSet = channelEmotes.find((x) => x.id == StvID);
            findThatEmote = findThatEmoteSet.emotes.find((x) => x.name == emote);
            if (!findThatEmote) { return false; }
            sum += 1;
            removeEmote(findThatEmote.id, findThatEmoteSet.id);
        };

        function findEmoteParam (emote) {
            findParamEmoteSet = channelEmotes.find((x) => x.name == params.set);
            if (!findParamEmoteSet) { return false; }
            if (emote.length == 0) { return false; }
            findThatEmote = findParamEmoteSet.emotes.find((x) => x.name == emote);
            if (!findThatEmote) { return false; }
            sum += 1;
            removeEmote(findThatEmote.id, findParamEmoteSet.id);
        }

        if (!args[0]) {
            return {
                text: "7tvM Please specify an emote",
            }
        };

        const StvID = await utils.stvNameToID(message.channelName);
        const channelEmotes = await utils.EmoteSets(StvID);

        let findThatEmote = '';
        let sum = 0;

        for (const allArgs of args) {
            if (params.set) {
                findEmoteParam(allArgs.replace(/set:(.*)$/g, ''));
            } else {
                findEmote(allArgs);
            }
        };

        if (params.set) {
            if (!findParamEmoteSet) {
                return {
                    text: `⛔ "${params.set}" is not a valid set`,
                };
            }
        };
        
        const isParams = params.set ? `"${params.set}" set` : message.channelName;
        if (!findThatEmote) {
            const certainEmotes = args[1] ? `certain emotes` : `"${args[0]}"`;
            const singleOrMutiple = sum == 1 ? `` : `s`;
            return {
                text: `⛔ I could not find ${certainEmotes} in ${isParams} but removed ${sum} emote${singleOrMutiple}`,
            }
        } else {
            const isTextLong = args.join(" ").length > 450 ? `${sum} emotes` : `"${args.join(", ").replace(/set:(.*)$/g, '')}"`;
            return {
                text: `7tvM ${isTextLong} has been removed from ${isParams}`,
            }
        };

        
    }
};