const utils = require("../util/utils.js");

module.exports = {
    name: 'remove',
    description: 'remove 7tv emotes',
    stv: true,
    execute: async (message, args, client, xd, params) => {
        async function removeEmote (emoteID, setID) {
            await utils.RemoveSTVEmote(emoteID, setID);
        };

        function findEmote (emote) {
            const findThatEmote = channelEmotes.data.emoteSet.emotes.find((x) => x.name == emote);
            console.log(findThatEmote);
            removeEmote(findThatEmote.id, channelEmotes.data.emoteSet.id);
        };

        if (!args[0]) {
            return {
                text: "7tvM Please specify an emote",
            }
        };

        const StvID = await utils.stvNameToID(message.channelName);
        const channelEmotes = await utils.StvChannelEmotes(StvID);
        for (const allArgs of args) {
            findEmote(allArgs);
        };

        try {
            return {
                text: `7tvM ${args.join(", ")} has been removed from ${message.channelName}`,
            }
        } catch (error) {
            console.log(error);
            return {
                text: `bruh`
            }
        }

    }
};