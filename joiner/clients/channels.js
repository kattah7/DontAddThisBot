const { joiner } = require('../connections');
const fetch = require('node-fetch');

async function joinChannels() {
    const { channels } = await fetch(`https://api.poros.lol/api/bot/channels`, {
        method: 'GET',
    }).then((res) => res.json());
    for (const channel of channels) {
        joiner.join(channel);
    }
}

module.exports = { joinChannels };
