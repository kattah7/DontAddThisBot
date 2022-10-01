const humanizeDuration = require('../util/humanizeDuration');
const { GetFirstStreams, GetTopGames } = require('../token/helix');

module.exports = {
    tags: 'stats',
    name: 'randomstream',
    aliases: ['rs'],
    cooldown: 5000,
    description: 'Fetches a random streamer from any game category',
    execute: async (message, args, client) => {
        const topgames = await GetTopGames(100);
        const getRandomGame = topgames[Math.floor(Math.random() * topgames.length)];
        const data2 = await GetFirstStreams(100, getRandomGame['id']);
        const random = data2[Math.floor(Math.random() * data2.length)];
        const { user_name, started_at, game_name, viewer_count, user_login, title } = random;
        const ms = new Date().getTime() - Date.parse(started_at);

        return {
            text: `${user_name} been live for ${humanizeDuration(
                ms
            )} playing ${game_name} with ${viewer_count} viewers. Title: ${title}. twitch.tv/${user_login} kattahSpin`,
        };
    },
};
