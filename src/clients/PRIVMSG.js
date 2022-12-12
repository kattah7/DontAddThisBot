const { client } = require('../util/twitch/connections.js');
const { startCmds } = require('./modules/commands.js');
const { handler } = require('./modules/handler.js');
const { getTimers } = require('./modules/timers.js');

const PRIVMSG = async function () {
	getTimers();
	client.on('PRIVMSG', async (message) => {
		const { commands, aliases } = await startCmds();
		await handler(commands, aliases, message, client);
	});
};

module.exports = { PRIVMSG };
