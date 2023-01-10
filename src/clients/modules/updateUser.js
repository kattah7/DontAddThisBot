const { updateUser } = require('../../database/db');

const updateTable = async function (table, senderUsername, senderUserID) {
	await bot.SQL.query(`UPDATE ${JSON.stringify(table)} SET twitch_login = '${senderUsername}' WHERE twitch_id = '${senderUserID}'`);
};

const updateEntireDB = async (login, id) => {
	try {
		await updateTable('users', login, id);
		await updateTable('commands', login, id);
		await updateTable('user_commands_settings', login, id);
		await updateTable('channel_settings', login, id);
		await updateTable('stv_ids', login, id);
		await updateTable('pubsub_events', login, id);

		await updateUser('users', login, id);
		await updateUser('channels', login, id);
		await updateUser('poroCount', login, id);
		await updateUser('stable', login, id);
	} catch (err) {
		console.log(err);
	}
};

module.exports = { updateEntireDB };
