const { JOIN } = require('./clients/JOIN');
const { PART } = require('./clients/PART');
const { joinChannels } = require('./clients/channels');
const sql = require('./data/db');

const showTables = async () => {
    await sql.query(
        `CREATE TABLE IF NOT EXISTS channels (id SERIAL PRIMARY KEY, username TEXT NOT NULL, channelName JSONB DEFAULT '[]'::JSONB)`
    );
};

showTables();

for (const client of [JOIN, PART, joinChannels]) {
    client();
}
