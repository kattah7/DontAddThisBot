const got = require('got');

module.exports = {
    name: 'stats',
    cooldown: 3000,
    description: 'get stats from twitchinsight.net/games',
    execute: async (message, args, client) => {
        let { body: userData, statusCode } = await got(`https://api.twitchinsights.net/v1/game/all`, {
            timeout: 10000,
            throwHttpErrors: false,
            responseType: 'json',
        });
        let xd = 0;
        let xd2 = 0;
        //console.log(userData)
        for (const data of userData.games) {
            try {
                xd += data.streamers;
                xd2 += data.viewers;
            } catch (err) {
                console.error(`error`, err);
            }
        }
        return {
            text: `Currently ${xd.toLocaleString()} streamers are live, ${xd2.toLocaleString()} total viewers on twitch. Total ${userData.total.toLocaleString()} categories OMGScoots`,
        };
    },
};