const { client } = require('../util/twitch/connections.js');

const WHISPER = async function () {
    client.on('WHISPER', async ({ messageText, senderUsername, senderUserID }) => {
        console.log('xd');
    });
};

module.exports = { WHISPER };
