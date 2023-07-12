const { JOIN } = require('./events/JOIN.js');
const { PART } = require('./events/PART.js');
const { USERSTATE } = require('./events/USERSTATE');
const { WHISPER } = require('./events/WHISPER.js');
const { CLEARCHAT } = require('./events/CLEARCHAT.js');
const { NOTICE } = require('./events/NOTICE.js');
const { PRIVMSG } = require('./events/PRIVMSG.js');
const { USERNOTICE } = require('./events/USERNOTICE.js');

const { main } = require('./JoinChannels.js');

exports.Twitch = async function () {
	for (const execute of [JOIN, PART, USERSTATE, WHISPER, CLEARCHAT, NOTICE, PRIVMSG, USERNOTICE, main]) {
		execute();
	}
};
