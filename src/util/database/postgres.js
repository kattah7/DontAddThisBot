const { Pool } = require('pg');
const { postgres } = require('../../../config.json');

const sql = new Pool({
    ...postgres,
    database: 'dontaddthisbot',
});

sql.connect(async function () {
    Logger.info('Connected to SQL database!');
    await sql.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        twitch_id VARCHAR(255) NOT NULL,
        twitch_login VARCHAR(255) NOT NULL
    )`);

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
});

module.exports = sql;
