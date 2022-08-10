const humanizeDuration = require('../humanizeDuration');
const utils = require('../util/utils.js');

module.exports = {
    name: 'redeem',
    cooldown: 10000,
    description: 'Redeem poro meat with speical codes',
    poro: true,
    execute: async (message, args, client) => {
        if (!args[0]) {
            return {
                text: `insert code lol`,
            };
        }
        const lastUsage = await bot.Redis.get(`pororedeem:${message.senderUserID}`);
        const channelData = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
        const input = args[0];
        const availableBadges = [process.env.PORO_CODE];

        if (message.channelName == 'forsen') {
            if (await utils.ForsenTV(message.senderUsername)) {
                return {
                    text: `banned msg lol`,
                };
            } else {
                if (lastUsage) {
                    if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 24) {
                        const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 24;
                        return {
                             text: `${
                                    message.senderUsername
                                }, You have already redeemed the code! Come back in ${humanizeDuration(
                                    ms
                                )} for daily codes`,
                        }
                    }
                }
                if (!availableBadges.includes(input)) {
                    return {
                        text: `${message.senderUsername}, Wrong code :p`,
                    };
                }
                await bot.DB.poroCount
                    .updateOne({ id: message.senderUserID }, { $set: { poroCount: channelData.poroCount + 50 } })
                    .exec();
                await bot.Redis.set(`pororedeem:${message.senderUserID}`, Date.now(), 0);
                await client.say(message.channelName,`Code Redeemed! ${message.senderUsername} (+50) kattahDance2 total [P:${channelData.poroPrestige}] ${channelData.poroCount + 50}meat`);return;
            }
        }

        if (message.channelName == 'nymn') {
            if (await utils.Nymn(message.senderUsername)) {
                return {
                    text: `banned msg lol`,
                };
            } else {
                if (lastUsage) {
                    if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 24) {
                        const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 24;
                            return {
                                text: `${
                                    message.senderUsername
                                }, You have already redeemed the code! Come back in ${humanizeDuration(
                                    ms
                                )} for daily codes`,
                            };
                    }
                }
                if (!availableBadges.includes(input)) {
                    return {
                        text: `${message.senderUsername}, Wrong code :p`,
                    };
                }
                await bot.DB.poroCount
                    .updateOne({ id: message.senderUserID }, { $set: { poroCount: channelData.poroCount + 50 } })
                    .exec();
                await bot.Redis.set(`pororedeem:${message.senderUserID}`, Date.now(), 0);
                    await client.say(
                        message.channelName,
                        `Code Redeemed! ${message.senderUsername} (+50) kattahDance2 total [P:${
                            channelData.poroPrestige
                        }] ${channelData.poroCount + 50} meat`
                    );
                    return;
            }
        }

        if (message.channelName == message.channelName) {
            if (lastUsage) {
                if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 24) {
                    const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 24;
                        return {
                            text: `${
                                message.senderUsername
                            }, You have already redeemed the code! Come back in ${humanizeDuration(
                                ms
                            )} for daily codes`,
                        };
                }
            }
            if (!availableBadges.includes(input)) {
                return {
                    text: `${message.senderUsername}, Wrong code :p`,
                };
            }
            await bot.DB.poroCount
                .updateOne({ id: message.senderUserID }, { $set: { poroCount: channelData.poroCount + 50 } })
                .exec();
            await bot.Redis.set(`pororedeem:${message.senderUserID}`, Date.now(), 0);
                await client.say(
                    message.channelName,
                    `Code Redeemed! ${message.senderUsername} (+50) kattahDance2 total [P:${
                        channelData.poroPrestige
                    }] ${channelData.poroCount + 50} meat`
                );
                return;
        }
    },
};
