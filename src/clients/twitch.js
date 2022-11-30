const { JOIN } = require('./JOIN.js');
const { PART } = require('./PART.js');
const { WHISPER } = require('./WHISPER.js');
const { CLEARCHAT } = require('./CLEARCHAT.js');
const { NOTICE } = require('./NOTICE.js');
const { PRIVMSG } = require('./PRIVMSG.js');
const { USERSTATE } = require('./USERSTATE');
const { main } = require('./JoinChannels.js');

exports.Twitch = async function () {
    for (const execute of [JOIN, PART, WHISPER, CLEARCHAT, NOTICE, PRIVMSG, main, USERSTATE]) {
        await execute();
    }
};
