const { ChatClient } = require('@kararty/dank-twitch-irc');

const joiner = new ChatClient({
    username: 'justinfan12312',
    password: 'oauth:kekw',
    rateLimits: 'verifiedBot',
    ignoreUnhandledPromiseRejections: true,
    connectionRateLimits: {
        parallelConnections: 6,
        releaseTime: 1000,
    },
    requestMembershipCapability: true,
});

joiner.connect();

module.exports = { joiner };
