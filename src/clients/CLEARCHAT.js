const { client } = require('../util/connections.js');
const { BAND: banEvasion } = require('../util/discord.js');
const { IVR } = require('../util/utils.js');

const CLEARCHAT = async function () {
    client.on('CLEARCHAT', async (message) => {
        const { targetUsername, channelName, ircTags, banDuration } = message;
        const usernames = ['kattah', 'kattah7', 'kpqy', 'checkingstreamers', 'altaccountpoggers'];
        if (usernames.includes(targetUsername)) {
            if (!banDuration) {
                client.part(channelName);
                await bot.DB.channels
                    .findOneAndUpdate({ id: ircTags['room-id'] }, { $set: { isChannel: false } })
                    .exec();
                await bot.DB.users.updateOne({ id: ircTags['room-id'] }, { level: 0 }).exec();
                Logger.warn('Banned In ' + channelName + ': ' + targetUsername, ircTags['room-id']);
            } else if (banDuration >= 3600) {
                client.part(channelName);
                await bot.DB.channels
                    .findOneAndUpdate({ id: ircTags['room-id'] }, { $set: { isChannel: false } })
                    .exec();
                Logger.warn(`Timed out for ${banDuration}s in ${channelName}: ${targetUsername}`, ircTags['room-id']);
            } else {
                client.part(channelName);
                Logger.warn(`Timed out for ${banDuration}s in ${channelName}: ${targetUsername}`, ircTags['room-id']);
            }
            const { logo } = await IVR(ircTags['room-id']);
            const isPerma = banDuration ? `${targetUsername} 𝗧𝗜𝗠𝗘𝗢𝗨𝗧` : `${targetUsername} 𝗕𝗔𝗡𝗡𝗘𝗗`;
            const duration = banDuration ? `Duration: ${banDuration}s` : `Duration: 𝗣𝗘𝗥𝗠𝗔𝗡𝗘𝗡𝗧`;
            const color = banDuration ? (banDuration >= 3600 ? 16776960 : 12370112) : 15548997;
            await banEvasion(channelName, isPerma, duration, color, logo);
        }
    });
};

module.exports = { CLEARCHAT };
