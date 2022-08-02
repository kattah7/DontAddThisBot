const humanizeDuration = require('../humanizeDuration');
const got = require('got');
const utils = require('../util/utils.js');

module.exports = {
    name: 'cdr',
    cooldown: 10000,
    description: 'Reset poro timer every 3 hours',
    poro: true,
    execute: async (message, args, client) => {
        const { banned, banphrase_data } = await got
            .post(`https://forsen.tv/api/v1/banphrases/test `, { json: { message: message.senderUsername } })
            .json();
        const banned2 = await utils.Nymn(message.senderUsername);
        //console.log(banned, banphrase_data)
        const lastUsage = await bot.Redis.get(`porocdr:${message.senderUserID}`);
        const channelData = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
        if (banned2 == false) {
            if (banned == false) {
                if (lastUsage && channelData) {
                    if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 3) {
                        const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 3;
                        if (message.senderUsername == (await utils.PoroNumberOne())) {
                            client.privmsg(
                                message.channelName,
                                `.me Please wait ${humanizeDuration(
                                    ms
                                )} before doing another cooldown reset! kattahDespair`
                            );
                            return;
                        } else {
                            return {
                                text: `Please wait ${humanizeDuration(
                                    ms
                                )} before doing another cooldown reset! kattahDespair`,
                            };
                        }
                    }
                }
                await bot.DB.poroCount
                    .updateOne({ id: message.senderUserID }, { $set: { poroCount: channelData.poroCount - 5 } })
                    .exec();
                await bot.Redis.set(`porocdr:${message.senderUserID}`, Date.now(), 0);
                await bot.Redis.del(`poro:${message.senderUserID}`);
                if (message.senderUsername == (await utils.PoroNumberOne())) {
                    client.privmsg(
                        message.channelName,
                        `.me Timer Reset! ${message.senderUsername} (-5) kattahDance total [P:${
                            channelData.poroPrestige
                        }] ${channelData.poroCount - 5} meat`
                    );
                } else {
                    await client.say(
                        message.channelName,
                        `Timer Reset! ${message.senderUsername} (-5) kattahDance total [P:${
                            channelData.poroPrestige
                        }] ${channelData.poroCount - 5} meat`
                    );
                }
            } else if (banned == true) {
                return {
                    text: `banned msg lol`,
                };
            }
        } else if (banned2 == true) {
            return {
                text: `banned msg lol`,
            };
        }
    },
};
