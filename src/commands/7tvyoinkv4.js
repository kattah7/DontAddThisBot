const { getUser, GetEmotes } = require('../token/stvREST');
const { AddSTVEmote, AliasSTVEmote } = require('../token/stvGQL');
const { ParseUser, IDByLogin } = require('../util/utils');

module.exports = {
    tags: '7tv',
    name: 'yoink',
    description: 'yoink 7tv emotes, Usage: |yoink (emotes...mutiple) from:(channel)',
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
        const findEmotes = emote_set.emotes?.filter((x) => emotes.has(x.name));
        if (!findEmotes) {
            return {
                text: `⛔ That channel's emote set has no emotes at all`,
            };
        }
        if (findEmotes.length === 0) {
            return {
                text: `⛔ No emotes found, please try again until 7tv caches the emotes (10-30s)`,
            };
        }

        let pushEmotes = [];
        let pushAliases = [];
        let errorMessage = new Set('');
        let errorCode = 0;
        await Promise.all(
            findEmotes.map(async (x) => {
                const addEmote = await AddSTVEmote(x.id, user.emote_set.id);
                if (addEmote?.data?.emoteSet != null) {
                    pushEmotes.push(x.name);
                } else {
                    errorCode = addEmote.errors[0].extensions.code;
                    errorMessage = `${addEmote.errors[0]?.extensions?.message}`;
                }
                const emote = await GetEmotes(x.id);
                if (emote.name != x.name) {
                    const aliasEmote = await AliasSTVEmote(x.id, user.emote_set.id, x.name);
                    if (aliasEmote?.data?.emoteSet != null) {
                        pushAliases.push(x.name);
                    }
                }
            })
        );

        if (findEmotes.length === 1) {
            if (errorMessage) {
                return {
                    text: `⛔ ${errorMessage}`,
                };
            }
        }

        if (pushEmotes.length === 0) {
            if (errorCode) {
                return {
                    text: `⛔ ${errorMessage}`,
                };
            }

            return {
                text: `⛔ No emotes found, please try again until 7tv caches the emotes (10-30s)`,
            };
        }

        return {
            text: `✅ Added ${pushEmotes.length} emotes from ${channel} to your emote set${
                pushAliases.length > 0 ? `, and auto-aliased ${pushAliases.length} emote` : ''
            }`,
        };
    },
};
