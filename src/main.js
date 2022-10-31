require('dotenv').config();
const nodeCron = require('node-cron');
const { client } = require('./util/connections.js');
const pubsub = require('./util/pubSub.js');
const sevenTV = require('./util/sevenTVevents.js');
const { Twitch } = require('./clients/twitch.js');

global.bot = {};
bot.Redis = require('./util/redis.js');
bot.DB = require('./util/db.js');
bot.Utils = require('./util');
Logger = require('./util/logger.js');
regex = require('./util/regex.js');

require('./apis/api/server');
require('./apis/publicapi/server.js');

client.on('ready', async () => {
    Logger.info('Connected to chat!');
    pubsub.init();
    // sevenTV.init();
    nodeCron.schedule('5 */2 * * *', () => {
        // every 2 hours at :05
        client.say('kattah', '!cookie');
    });
    Twitch();
});

client.on('372', (msg) => Logger.info(`Server MOTD is: ${msg.ircParameters[1]}`));

client.on('close', (err) => {
    if (err != null) {
        Logger.error('Client closed due to error', err);
    }
    process.exit(1);
});
