const { joiner } = require('../connections.js');
const sql = require('../data/db.js');

async function PART() {
    joiner.on('PART', async ({ channelName, partedUsername }) => {
        console.log(`${partedUsername} parted #${channelName}`);
        if (partedUsername === 'justinfan12312') {
            return;
        }

        const showTables = await sql.query(`SELECT * FROM channels WHERE username = '${partedUsername}'`);
        if (showTables.rows.length === 0) {
            console.log(`No channels found for ${partedUsername}.`);
        } else {
            const sqlQueryRemoveChannelFromArray = async () => {
                const channelNames = [...new Set(showTables.rows[0].channelname)];
                const filteredChannelNames = channelNames.filter((channel) => channel !== channelName);
                await sql.query(
                    `UPDATE channels SET channelName = '${JSON.stringify(
                        filteredChannelNames
                    )}' WHERE username = '${partedUsername}'`
                );
                console.log(`Updated ${partedUsername}'s channels.`);
            };
            sqlQueryRemoveChannelFromArray();
        }
    });
}

module.exports = { PART };
