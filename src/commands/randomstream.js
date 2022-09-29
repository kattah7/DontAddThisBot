const humanizeDuration = require('../util/humanizeDuration');
const { GetGames, GetStreams } = require('../token/helix');

module.exports = {
    tags: 'stats',
    name: 'randomstream',
    aliases: ['rs'],
    cooldown: 5000,
    description: 'Fetches a random streamer from any game category',
    execute: async (message, args, client) => {
        if (!args[0]) {
            return {
                text: `Pls write a category lol`,
            };
        }

        const { id } = (await GetGames(args.join(' ')))[0];
        const data2 = await GetStreams(100, id);

        var random = data2[Math.floor(Math.random() * data2.length)];
        const ms = new Date().getTime() - Date.parse(random.started_at);

        if (args[0].toLowerCase()) {
            return {
                text: `${random.user_name} been live for ${humanizeDuration(ms)} playing ${random.game_name} with ${
                    random.viewer_count
                } viewers. Title: ${random.title}. twitch.tv/${random.user_login} kattahSpin`,
            };
        }
    },
};
