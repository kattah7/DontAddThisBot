const { JOIN } = require('./clients/JOIN');
const { PART } = require('./clients/PART');
const { joinChannels } = require('./clients/channels');
const sql = require('./data/db');

async function joiner() {
    const showTables = async () => {
        // create a new database table that stores with json objects and arrays
        await sql.query(
            `CREATE TABLE IF NOT EXISTS channels (id SERIAL PRIMARY KEY, username TEXT NOT NULL, channelName JSONB NOT NULL)`
        );
    };

    showTables();

    for (const client of [JOIN, PART, joinChannels]) {
        client();
    }
}

module.exports = { joiner };
