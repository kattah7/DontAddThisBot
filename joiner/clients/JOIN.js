const { joiner } = require('../connections.js');
const sql = require('../data/db.js');

const JOIN = async function () {
    joiner.on('JOIN', async ({ joinedUsername, channelName }) => {
        if (joinedUsername === 'justinfan12312') {
            return;
        }
        const showTables = await sql.query(`SELECT * FROM channels WHERE username = '${joinedUsername}'`);
        if (showTables.rows.length === 0) {
            await sql.query(
                `INSERT INTO channels (username, channelName) VALUES ('${joinedUsername}', '["${channelName}"]')`
            );
        } else {
            const sqlQueryAddNewChannelToArray = async () => {
                const channelNames = [...new Set(showTables.rows[0].channelname)];
                channelNames.push(channelName);
                await sql.query(
                    `UPDATE channels SET channelName = '${JSON.stringify(
                        channelNames
                    )}' WHERE username = '${joinedUsername}'`
                );
            };
            sqlQueryAddNewChannelToArray();
        }
    });
};

module.exports = { JOIN };
