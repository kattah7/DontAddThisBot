const { client } = require('../util/connections.js');

const CLEARCHAT = async function () {
    client.on('CLEARCHAT', async (message) => {
        if (
            message.targetUsername == 'kattah' ||
            message.targetUsername == 'kattah7' ||
            message.targetUsername == 'kpqy' ||
            message.targetUsername == 'checkingstreamers' ||
            message.targetUsername == 'altaccountpoggers'
        ) {
            await bot.DB.channels.findOneAndDelete({ id: message.ircTags['room-id'] }).exec();
            await bot.DB.users.updateOne({ id: message.ircTags['room-id'] }, { level: 0 }).exec();
            await client.part(message.channelName);
            Logger.info(message.channelName + ': ' + message.targetUsername, message.ircTags['room-id']);
        }
    });
};

module.exports = { CLEARCHAT };
