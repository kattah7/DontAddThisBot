const got = require('got');
const { ChatStats } = require('../token/SE.js');
const { ParseUser } = require('../util/twitch/utils.js');

module.exports = {
    tags: 'stats',
    name: 'chatstats',
    cooldown: 3000,
    description: 'Get channel emote, top chatter, top hastags and top command stats',
    execute: async (message, args, client) => {
        const targetUser = await ParseUser(args[0] ?? message.channelName);
        const data = await ChatStats(targetUser);
        if (data.error) {
            return {
                text: `⛔ ${data.message}`,
            };
        }
        const { totalMessages, chatters, twitchEmotes } = data;
        return {
            text: `This channel has (${totalMessages.toLocaleString()}) messages in total; ${
                chatters[0]['name']
            } Top Chatter; "${twitchEmotes[0]['emote']}" Top Twitch Emote with (${twitchEmotes[0][
                'amount'
            ].toLocaleString()}) uses`,
        };
    },
};
