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
            const sqlQueryAddChannelToArray = async () => {
                const channelNames = [...new Set(showTables.rows[0].channelname)];
                const newChannelNames = JSON.stringify([...new Set(channelNames.concat(channelName))]);
                await sql.query(
                    `UPDATE channels SET channelName = '${newChannelNames}' WHERE username = '${joinedUsername}'`
                );
                Logger.info(`Added ${channelName} to ${joinedUsername}'s channels.`);
            };
            sqlQueryAddChannelToArray();
        }
    });
};

module.exports = { JOIN };
