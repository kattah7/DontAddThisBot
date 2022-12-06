const { Pool } = require('pg');
const { postgres } = require('../../../config.json');
const { GetStvRoles } = require('../../token/stvGQL');
const { startCmds } = require('../../clients/modules/commands.js');

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

    const channels = await bot.DB.channels.find({ isChannel: true }).exec();
    for (const { poroOnly, stvOnly, id, username } of channels) {
        if (!poroOnly && !stvOnly) continue;
        console.log(username, id);
        const { commands } = await startCmds();
        for (let asd of commands) {
            const dontAllowTheseCommands = [
                'disable',
                'ping',
                'setprefix',
                'datb',
                'optout',
                'join',
                'part',
                'offlineonly',
            ];
            if (dontAllowTheseCommands.includes(asd[1].name)) continue;
            if (asd[1].level) continue;
            if (!asd[1].aliases) continue;
            await sql.query(
                `INSERT INTO channel_settings (twitch_id, twitch_login, command, is_disabled) SELECT * FROM (SELECT '${id}', '${username}', '${asd[1].name}', 1) AS tmp WHERE NOT EXISTS (SELECT command FROM channel_settings WHERE command = '${asd[1].name}' AND twitch_id = '${id}') LIMIT 1;`
            );

            if (poroOnly) {
                if (asd[1].poro) {
                    await sql.query(
                        `UPDATE channel_settings SET is_disabled = 0 WHERE command = '${asd[1].name}' AND twitch_id = '${id}'`
                    );
                }
            }
            if (stvOnly) {
                if (asd[1].stvOnly) {
                    console.log(asd[1].name);
                    await sql.query(
                        `UPDATE channel_settings SET is_disabled = 0 WHERE command = '${asd[1].name}' AND twitch_id = '${id}'`
                    );
                }
            }
        }
    }

    const { roles } = await GetStvRoles();
    for (const { id, name } of roles) {
        await sql.query(
            `INSERT INTO stv_roles (stv_role, stv_role_id) SELECT * FROM (SELECT '${name}', '${id}') AS tmp WHERE NOT EXISTS (SELECT stv_role_id FROM stv_roles WHERE stv_role_id = '${id}') LIMIT 1;`
        );
    }
});

module.exports = sql;
