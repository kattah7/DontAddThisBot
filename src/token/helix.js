const got = require('got');

const helix = got.extend({
    prefixUrl: 'https://api.twitch.tv/helix/',
    throwHttpErrors: false,
    responseType: 'json',
    headers: {
        'Client-ID': process.env.CLIENT_ID,
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
    },
});

module.exports = { helix };
