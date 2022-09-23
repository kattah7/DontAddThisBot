const fetch = require('node-fetch');
const utils = require('../util/utils');

module.exports = {
    name: 'ezgif',
    cooldown: 5000,
    aliases: ['resize'],
    description: 'ezgif twitch, 7tv emotes (Usage: |ezgif (emote), bttv and ffz not supported)',
    execute: async (message, args, client) => {
        if (!args[0]) {
            return {
                text: `⛔ Please specify an emote`,
            };
        }

        const [url] = args;
        if (/https:\/\/(next\.)?7tv\.app\/emotes\/\w{24}/g.test(url)) {
            const linkEmote = /https:\/\/(next\.)?7tv\.app\/emotes\/(\w{24})/.exec(url);
            return {
                text: `https://ezgif.com/resize?url=https://cdn.7tv.app/emote/${linkEmote[2]}/4x`,
            };
        }
        const twitchEmote = message.emotes[0];
        if (twitchEmote) {
            return {
                text: `https://ezgif.com/resize?url=https://static-cdn.jtvnw.net/emoticons/v2/${twitchEmote['id']}/default/dark/3.0`,
            };
        } else {
            const getEmote = await fetch(`https://api.ivr.fi/v2/twitch/emotes/${args[0]}`).then((res) => res.json());
            if (getEmote.error) {
                const { emote_set } = await fetch(`https://7tv.io/v3/users/twitch/${message.channelID}`).then((res) =>
                    res.json()
                );
                const findEmote = emote_set['emote'].find((e) => e['name'] === args[0]);
                if (!findEmote) {
                    const searchEmote = await utils.SearchSTVEmote(args[0], false);
                    if (searchEmote.errors) {
                        return {
                            text: `⛔ ${searchEmote.errors[0].extensions.message}`,
                        };
                    }
                    return {
                        text: `https://ezgif.com/resize?url=https://cdn.7tv.app/emote/${searchEmote['data']['emotes']['items'][0]['id']}/4x`,
                    };
                }

                return {
                    text: `https://ezgif.com/resize?url=https://cdn.7tv.app/emote/${findEmote['id']}/4x`,
                };
            }

            return {
                text: `https://ezgif.com/resize?url=${getEmote.emoteURL.replace('1.0', '4.0')}`,
            };
        }
    },
};
