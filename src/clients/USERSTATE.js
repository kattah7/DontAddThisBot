const { client } = require('../util/twitch/connections.js');

const USERSTATE = async function () {
    client.on('USERSTATE', async ({ badges, channelName }) => {
        badges.forEach(async ({ name }) => {
            if (name === 'moderator') {
                await bot.SQL.query(
                    `INSERT INTO channels (twitch_login, is_mod, is_vip) SELECT * FROM (SELECT '${channelName}', 1, 0) AS tmp WHERE NOT EXISTS (SELECT twitch_login FROM channels WHERE twitch_login = '${channelName}') LIMIT 1;`
                );

                await bot.SQL.query(`UPDATE channels SET is_mod = 1, is_vip = 0 WHERE twitch_login = '${channelName}'`);
            } else if (name === 'vip') {
                await bot.SQL.query(
                    `INSERT INTO channels (twitch_login, is_mod, is_vip) SELECT * FROM (SELECT '${channelName}', 0, 1) AS tmp WHERE NOT EXISTS (SELECT twitch_login FROM channels WHERE twitch_login = '${channelName}') LIMIT 1;`
                );
                await bot.SQL.query(`UPDATE channels SET is_mod = 0, is_vip = 1 WHERE twitch_login = '${channelName}'`);
            }
        });
    });
};

module.exports = { USERSTATE };
