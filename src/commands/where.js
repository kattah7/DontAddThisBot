const sql = require('../../joiner/data/db.js');
const { ParseUser } = require('../util/utils');
const { UserInfo } = require('../token/helix.js');
const got = require('got');
const fs = require('fs/promises');

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
        delete require.cache[require.resolve('../../joiner/data/users.json')];
        const { tracking_users } = require('../../joiner/data/users.json');
        const isUserInTracking = tracking_users.includes(user);
        if (isUserInTracking) {
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
        } else {
            const isReal = await UserInfo(user);
            if (!isReal || isReal.length === 0) {
                return {
                    text: `User "${user}" does not exist.`,
                };
            } else {
                fs.writeFile('./joiner/data/users.json', JSON.stringify({ tracking_users: [...tracking_users, user] }));
                return {
                    text: `Add ${user} to tracking list...`,
                };
            }
        }
    },
};
