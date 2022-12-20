const { client } = require('../../util/twitch/connections.js');

async function UPDATEDB(channel, is_mod, is_vip) {
	await bot.SQL.query(
		`INSERT INTO channels (twitch_login, is_mod, is_vip) SELECT * FROM (SELECT '${channel}', ${is_mod}, ${is_vip}) AS tmp WHERE NOT EXISTS (SELECT twitch_login FROM channels WHERE twitch_login = '${channel}') LIMIT 1;`,
	);

	await bot.SQL.query(`UPDATE channels SET is_mod = ${is_mod}, is_vip = ${is_vip} WHERE twitch_login = '${channel}'`);
}

const USERSTATE = async function () {
	client.on('USERSTATE', async ({ badges, channelName }) => {
		let status = [];
		badges.forEach(async ({ name }) => {
			status.push(name);
			if (name === 'moderator') {
				await UPDATEDB(channelName, 1, 0);
			} else if (name === 'vip') {
				await UPDATEDB(channelName, 0, 1);
			}
		});

		if (!status.includes('moderator') && !status.includes('vip')) {
			await UPDATEDB(channelName, 0, 0);
		}
	});
};

module.exports = { USERSTATE };
