const { client } = require('../util/connections.js');

const NOTICE = async function () {
    client.on('NOTICE', async ({ channelName, messageID }) => {
        if (!messageID) return;

        if (messageID == 'msg_rejected_mandatory') {
            client.say(channelName, `That message violates the channel's moderation settings`);
            return;
        } else if (messageID == 'msg_banned') {
            Logger.warn(`Banned from channel ${channelName}`);
            await bot.DB.channels
                .updateOne({ username: channelName }, { isChannel: false })
                .catch((err) => Logger.error(err));
        } else if (messageID == 'msg_channel_suspended') {
            Logger.warn(`Suspended channel ${channelName}`);
        }
    });
};

module.exports = { NOTICE };
