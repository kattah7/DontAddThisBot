const utils = require("../util/utils.js");

module.exports = {
    name: 'remove',
    description: 'remove 7tv emotes',
    cooldown: 5000,
    stv: true,
    execute: async (message, args, client, xd, params) => {
        function removeEmote (emoteID, setID) {
            utils.RemoveSTVEmote(emoteID, setID);
        };
        
        function findEmote (emote) {
            findThatEmote = channelEmotes.data.emoteSet.emotes.find((x) => x.name == emote);
            sum += 1;
            if (!findThatEmote) { return false; }
            removeEmote(findThatEmote.id, channelEmotes.data.emoteSet.id);
        };

        if (!args[0]) {
            return {
                text: "7tvM Please specify an emote",
            }
        };

        const StvID = await utils.stvNameToID(message.channelName);
        const channelEmotes = await utils.StvChannelEmotes(StvID);

        let findThatEmote = '';
        let sum = 0;
        for (const allArgs of args) {
            findEmote(allArgs);
        };
        
        if (!findThatEmote) {
            return {
                text: `⛔ I could not find the emote`,
            }
        } else {
            const isTextLong = args.join(" ").length > 450 ? `${sum} emotes` : args.join(", ");
            return {
                text: `7tvM ${isTextLong} has been removed from ${message.channelName}`,
            }
        };
    }
};