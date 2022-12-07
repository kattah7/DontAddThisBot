const got = require('got');
const utils = require('../util/utils.js');

module.exports = {
    name: `changecolor`,
    cooldown: 10000,
    aliases: ['changecolour', 'setcolor', 'setcolour'],
    description: 'Change the bot color with 50 poro meat',
    execute: async (message, args, client) => {
        var reg = /^#[0-9A-F]{6}$/i;
        const channelData = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
        const { banned, banphrase_data } = await got
            .post(`https://forsen.tv/api/v1/banphrases/test `, { json: { message: message.senderUsername } })
            .json();
        console.log(banned, banphrase_data);
        if (banned == false) {
            if (channelData.poroCount < 50) {
                if (message.senderUsername == (await utils.PoroNumberOne())) {
                    return client.privmsg(
                        message.channelName,
                        `.me Not enough poro meat! ${message.senderUsername} kattahHappy You need 50 poro meat | [P:${channelData.poroPrestige}] ${channelData.poroCount} meat total! 🥩`
                    );
                }
                return {
                    text: `Not enough poro meat! ${message.senderUsername} kattahHappy You need 50 poro meat | [P:${channelData.poroPrestige}] ${channelData.poroCount} meat total! 🥩`,
                };
            } else if (!reg.test(args[0])) {
                if (message.senderUsername == (await utils.PoroNumberOne())) {
                    return client.privmsg(
                        message.channelName,
                        `.me Invalid color, please use hex color code with # kattahDance`
                    );
                }
                return {
                    text: `Invalid color, please use hex color code with # kattahDance`,
                };
            } else {
                await bot.DB.poroCount
                    .updateOne({ id: message.senderUserID }, { $set: { poroCount: channelData.poroCount - 50 } })
                    .exec();
                client.privmsg(message.channelName, `.color ${args[0]}`);
                if (message.senderUsername == (await utils.PoroNumberOne())) {
                    return client.privmsg(
                        message.channelName,
                        `.me Color changed! PoroSad [P:${channelData.poroPrestige}] ${
                            channelData.poroCount - 50
                        } meat total! 🥩`
                    );
                }
                return {
                    text: `Color changed! PoroSad [P:${channelData.poroPrestige}] ${
                        channelData.poroCount - 50
                    } meat total! 🥩`,
                };
            }
        } else if (banned == true) {
            return {
                text: `banned msg lol`,
            };
        }
    },
};
