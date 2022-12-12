const { JOIN } = require('./JOIN.js');
const { PART } = require('./PART.js');
const { USERSTATE } = require('./USERSTATE');
const { WHISPER } = require('./WHISPER.js');
const { CLEARCHAT } = require('./CLEARCHAT.js');
const { NOTICE } = require('./NOTICE.js');
const { PRIVMSG } = require('./PRIVMSG.js');
const { main } = require('./JoinChannels.js');

exports.Twitch = async function () {
	for (const execute of [JOIN, PART, USERSTATE, WHISPER, CLEARCHAT, NOTICE, PRIVMSG, main]) {
		await execute();
	}
};
