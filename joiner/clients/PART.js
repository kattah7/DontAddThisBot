const { joiner } = require('../connections.js');
const sql = require('../data/db.js');
const Logger = require('../.././src/util/logger');

async function PART() {
    joiner.on('PART', async ({ channelName, partedUsername }) => {
        if (partedUsername === 'justinfan12312') {
            return;
        }
        Logger.info(`Parted ${partedUsername} from ${channelName}`);
        const showTables = await sql.query(`SELECT * FROM channels WHERE username = '${partedUsername}'`);
        if (showTables.rows.length === 0) {
            await sql.query(`INSERT INTO channels (username, channelName) VALUES ('${partedUsername}', '[]')`);
            Logger.info(`Freshly Added Parted ${partedUsername} to ${channelName}`);
        } else {
            await new Promise((r) => setTimeout(r, 1000));
            const channelNames = [...new Set(showTables.rows[0].channelname)];
            const filteredChannelNames = channelNames.filter((channel) => channel !== channelName);
            const newChannelNames = JSON.stringify([...new Set(filteredChannelNames)]);
            await sql.query(
                `UPDATE channels SET channelName = '${newChannelNames}' WHERE username = '${partedUsername}'`
            );
            Logger.info(`Removed ${channelName} from ${partedUsername}'s channels.`);
        }
    });
}

module.exports = { PART };
