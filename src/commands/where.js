const sql = require('../../joiner/data/db.js');
const { ParseUser } = require('../util/utils');
const got = require('got');

module.exports = {
    tags: 'stats',
    name: 'where',
    description: 'Where is user in viewerlist',
    cooldown: 5000,
    execute: async (message, args, client, userdata, params) => {
        async function pasteBin(channels) {
            const { key } = await got.post('https://paste.ivr.fi/documents', { body: channels.join('\n') }).json();
            return `https://paste.ivr.fi/${key}`;
        }
        const targetUser = (args[0] ?? message.senderUsername).toLowerCase();
        const user = await ParseUser(targetUser);
        const showTables = await sql.query(`SELECT * FROM channels WHERE username = '${user}'`);
        if (showTables.rows.length === 0) {
            return {
                text: `User ${user} is not in any viewerlist that im tracking.`,
            };
        } else {
            const channelNames = [...new Set(showTables.rows[0].channelname)];
            return {
                text: `${user} is in (${channelNames.length}) Channels: ${
                    channelNames.join(', ').length > 500
                        ? await pasteBin(channelNames)
                        : channelNames.map((name) => name[0] + '\u{E0000}' + name.slice(1)).join(', ')
                }`,
            };
        }
    },
};
