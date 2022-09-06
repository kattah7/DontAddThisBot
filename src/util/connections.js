const { ChatClient, AlternateMessageModifier, SlowModeRateLimiter } = require("@kararty/dank-twitch-irc");
require("dotenv").config();

const client = new ChatClient({
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_OAUTH,
    rateLimits: 'verifiedBot',
    ignoreUnhandledPromiseRejections: true
});

client.use(new AlternateMessageModifier(client));
client.use(new SlowModeRateLimiter(client, 2));
client.connect()

module.exports = { client };