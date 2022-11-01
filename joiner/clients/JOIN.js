const { joiner } = require('../connections.js');
const sql = require('../data/db.js');
const Logger = require('../.././src/util/logger');

const JOIN = async function () {
    joiner.on('JOIN', async ({ joinedUsername, channelName }) => {
        if (joinedUsername === 'justinfan12312') {
            return;
        }
        Logger.info(`Joined ${joinedUsername} to ${channelName}`);

        const showTables = await sql.query(`SELECT * FROM channels WHERE username = '${joinedUsername}'`);

        if (showTables.rows.length === 0) {
            await sql.query(
                `INSERT INTO channels (username, channelName) VALUES ('${joinedUsername}', '["${channelName}"]')`
            );
            Logger.info(`Freshly Added Joined ${joinedUsername} to ${channelName}`);
        } else {
            await new Promise((r) => setTimeout(r, 1000));
            await sql.query(
                `UPDATE channels SET channelName = jsonb_set(channelName, '{${showTables.rows[0].channelname.length}}', '"${channelName}"') WHERE username = '${joinedUsername}'`
            );
            Logger.info(`Added ${channelName} to ${joinedUsername}'s channels.`);
        }
    });
};

module.exports = { JOIN };
