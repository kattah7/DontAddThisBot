const got = require('got');

const helix = got.extend({
    prefixUrl: 'https://api.twitch.tv/helix/',
    throwHttpErrors: false,
    responseType: 'json',
    headers: {
        'authorization': `OAuth ${process.env.TWITCH_GQL_TOKEN}`,
        'client-id': `kimne78kx3ncx6brgo4mv6wki5h1ko`,
        'x-device-id': `${process.env.TWITCH_DEVICE_ID}`,
    },
});

module.exports = { helix };
