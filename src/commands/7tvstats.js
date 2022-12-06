const fetch = require('node-fetch');
const { ParseUser } = require('../util/twitch/utils');

module.exports = {
    tags: '7tv',
    name: 'stats',
    aliases: ['7tvstats'],
    description: 'Check your 7tv emote usage stats',
    aliases: [],
    cooldown: 5000,
    stvOnly: true,
    execute: async (message, args, client, userdata, params) => {
        const { channelName } = message;
        const user = await ParseUser(args[0] ?? channelName);
        const emoteStats = await fetch(`https://api.kattah.me/c/${user.toLowerCase()}`, {
            method: 'GET',
        }).then((res) => res.json());
        const { success, data } = emoteStats;

        if (success) {
            const listTop5Emotes = data.slice(0, 5);

            const top5Text = listTop5Emotes
                .map(
                    (emote, index) =>
                        `${index == 0 ? `🥇` : index == 1 ? `🥈` : index == 2 ? `🥉` : ``} ${
                            emote.name
                        } (Usage: ${emote.usage.toLocaleString()})`
                )
                .join(' | ');

            return {
                text: `${top5Text} More info ==> stats.kattah.me/c/${user}`,
            };
        } else {
            return {
                text: `Channel ${user} not found, authorize here ==> https://stats.kattah.me/auth/twitch`,
            };
        }
    },
};
