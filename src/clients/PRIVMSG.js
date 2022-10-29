const { client } = require('../util/connections.js');
const { startCmds } = require('./modules/commands.js');
const { handler } = require('./modules/handler.js');

const PRIVMSG = async function () {
    client.on('PRIVMSG', async (message) => {
        const { commands, aliases } = await startCmds();
        await handler(commands, aliases, message, client);
    });
};

module.exports = { PRIVMSG };
