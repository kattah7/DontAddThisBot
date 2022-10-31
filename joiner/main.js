const { JOIN } = require('./clients/JOIN');
const { PART } = require('./clients/PART');
const { joinChannels } = require('./clients/channels');
const sql = require('./data/db');

const showTables = async () => {
    // create a new database table that stores with json objects and arrays
    await sql.query(
        `CREATE TABLE IF NOT EXISTS channels (id SERIAL PRIMARY KEY, username TEXT NOT NULL, channelName JSONB)`
    );
};

showTables();

for (const client of [JOIN, PART, joinChannels]) {
    client();
}
