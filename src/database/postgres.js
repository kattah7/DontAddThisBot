const { Pool } = require('pg');
const { postgres } = require('../../config.json');
const { GetStvRoles } = require('../token/stvGQL');
const { Logger, LogLevel } = require('../misc/logger');

const sql = new Pool({
	...postgres,
	database: 'dontaddthisbot',
});

sql.connect(async function () {
	Logger.log(LogLevel.INFO, 'Connected to SQL database!');
	await sql.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        twitch_id VARCHAR(255) NOT NULL,
        twitch_login VARCHAR(255) NOT NULL
    )`);
	await sql.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS language VARCHAR(255)`);

	await sql.query(`CREATE TABLE IF NOT EXISTS commands (
        id SERIAL PRIMARY KEY,
        twitch_id VARCHAR(255) NOT NULL,
        twitch_login VARCHAR(255) NOT NULL,
        command VARCHAR(50) NOT NULL,
        command_usage INT NOT NULL,
        last_used TIMESTAMP NOT NULL DEFAULT NOW()
    )`);

	await sql.query(`CREATE TABLE IF NOT EXISTS channels (
        id SERIAL PRIMARY KEY,
        twitch_login VARCHAR(255) NOT NULL,
        is_mod INT NOT NULL,
        is_vip INT NOT NULL
    )`);

	await sql.query(`CREATE TABLE IF NOT EXISTS stv_roles (
        id SERIAL PRIMARY KEY,
        stv_role VARCHAR(255) NOT NULL,
        stv_role_id VARCHAR(255) NOT NULL
    )`);

	await sql.query(`CREATE TABLE IF NOT EXISTS user_commands_settings (
        id SERIAL PRIMARY KEY,
        twitch_id VARCHAR(255) NOT NULL,
        twitch_login VARCHAR(255) NOT NULL,
        command VARCHAR(50) NOT NULL,
        aliases JSONB NOT NULL DEFAULT '[]'
    )`);

	await sql.query(`CREATE TABLE IF NOT EXISTS channel_settings (
        id SERIAL PRIMARY KEY,
        twitch_id VARCHAR(255) NOT NULL,
        twitch_login VARCHAR(255) NOT NULL,
        command VARCHAR(50) NOT NULL,
        aliases JSONB NOT NULL DEFAULT '[]',
        is_disabled INT NOT NULL DEFAULT 0
    )`);

	await sql.query(`CREATE TABLE IF NOT EXISTS stv_ids (
        id SERIAL PRIMARY KEY,
        twitch_id VARCHAR(255) NOT NULL,
        twitch_login VARCHAR(255) NOT NULL,
        stv_id VARCHAR(255) NOT NULL
    )`);

	await sql.query(`CREATE TABLE IF NOT EXISTS pubsub_events (
        id SERIAL PRIMARY KEY,
        twitch_id VARCHAR(255) NOT NULL,
        twitch_login VARCHAR(255) NOT NULL,
        event_channel_id VARCHAR(255) NOT NULL,
        event_channel_name VARCHAR(255) NOT NULL,
        event_type JSONB NOT NULL
    )`);

	await sql.query(`CREATE TABLE IF NOT EXISTS logout_token (
        id SERIAL PRIMARY KEY,
        jwt_token VARCHAR NOT NULL
    )`);

	const { roles } = await GetStvRoles();
	for (const { id, name } of roles) {
		await sql.query(
			`INSERT INTO stv_roles (stv_role, stv_role_id) SELECT * FROM (SELECT '${name}', '${id}') AS tmp WHERE NOT EXISTS (SELECT stv_role_id FROM stv_roles WHERE stv_role_id = '${id}') LIMIT 1;`,
		);
	}
});

module.exports = sql;
