const { getUser } = require('../token/stvREST');
const { RemoveSTVEmote } = require('../token/stvGQL');

module.exports = {
    tags: '7tv',
    name: 'remove',
    description: 'remove 7tv emotes, |remove (emotes...mutiple)',
    cooldown: 5000,
    stv: true,
    stvOnly: true,
    execute: async (message, args, client, userdata, params) => {
        if (!args[0]) {
            return {
                text: '⛔ Please specify an emote',
            };
        }

        const user = await getUser(message.channelID);
        if (user === null) {
            return {
                text: `⛔ Unknown user`,
            };
        }

        const { emote_set } = user;
        const isItNovember = new Date().getMonth() === 10 ? '7tvH' : '7tvM';
        const emotes = new Set(args);
        const findEmotes = emote_set.emotes.filter((x) => emotes.has(x.name));
        if (findEmotes.length === 0) {
            return {
                text: `⛔ No emotes found`,
            };
        }
        const getEmoteIDsAndRemove = findEmotes.map((x) => RemoveSTVEmote(x.id, emote_set.id));
        let amount = 0;
        const resolved = await Promise.all(getEmoteIDsAndRemove);
        if (resolved[0].data.emoteSet !== null) {
            amount = resolved.length;
        }
        return {
            text: `${isItNovember} ${amount === 1 ? `"${args[0]}"` : `${amount} emotes`} removed from ${
                message.channelName
            }`,
        };
    },
};