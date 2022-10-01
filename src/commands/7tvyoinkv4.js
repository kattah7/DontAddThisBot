const { getUser } = require('../token/stvREST');
const { AddSTVEmote } = require('../token/stvGQL');
const { ParseUser, IDByLogin } = require('../util/utils');

module.exports = {
    tags: '7tv',
    name: 'yoink',
    description: 'yoink 7tv emotes, Usage: |yoink <emotes...mutiple> from:<channel>',
    cooldown: 5000,
    stv: true,
    stvOnly: true,
    execute: async (message, args, client, userdata, params) => {
        if (!args[0] || !params.from) {
            return {
                text: `⛔ Please specify an ${
                    args[0] ? 'channel, Usage: |yoink <emotes...mutiple> from:<channel>' : 'emote'
                }`,
            };
        }

        const user = await getUser(message.channelID);
        if (user === null) {
            return {
                text: `⛔ This channel never logged into 7tv`,
            };
        }

        const channel = await ParseUser(params.from);
        const userID = await IDByLogin(channel);
        if (userID === null) {
            return {
                text: `⛔ Channel not found`,
            };
        }

        const channelStv = await getUser(userID);
        if (channelStv === null) {
            return {
                text: `⛔ Channel never logged into 7tv`,
            };
        }
        const { emote_set } = channelStv;
        const emotes = new Set(args);
        const findEmotes = emote_set.emotes.filter((x) => emotes.has(x.name));
        if (findEmotes.length === 0) {
            return {
                text: `⛔ No emotes found`,
            };
        }

        const getEmoteIDsAndAdd = findEmotes.map((x) => AddSTVEmote(x.id, user.emote_set.id));
        const resolved = await Promise.all(getEmoteIDsAndAdd);
        let amount = 0;
        if (resolved[0].data.emoteSet !== null) {
            amount = resolved.length;
        }

        if (amount === 0) {
            return {
                text: `⛔ No emotes added`,
            };
        }

        const isItNovember = new Date().getMonth() === 10 ? '7tvH' : '7tvM';
        return {
            text: `${isItNovember} ${amount === 1 ? `"${findEmotes[0].name}"` : `${amount} emotes`} yoinked to ${
                message.channelName
            } from ${channel}`,
        };
    },
};
