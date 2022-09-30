const utils = require('../util/utils.js');
const { ChangeColor } = require('../token/helix');
const fs = require('fs/promises');

module.exports = {
    tags: 'poro',
    name: `changecolor`,
    cooldown: 5000,
    aliases: ['changecolour', 'setcolor', 'setcolour'],
    description: 'Change the bot color with 50 poro meat',
    poro: true,
    poroRequire: true,
    execute: async (message, args, client) => {
        if (!args[0]) {
            return {
                text: `Please insert a color! kattahBAT`,
            };
        }

        var reg = /^#[0-9A-F]{6}$/i;
        if (!reg.test(args[0])) {
            return {
                text: `Please insert a valid color! kattahBAT`,
            };
        }

        const color = await utils.IVR(`790623318`);
        if (color.chatColor == args[0]) {
            return {
                text: `That color is already being used! kattahBAT`,
            };
        }

        const channelData = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
        if (channelData.poroCount < 50) {
            return {
                text: `Not enough poro meat! ${message.senderUsername} kattahHappy You need 50 poro meat | [P:${channelData.poroPrestige}] ${channelData.poroCount} meat total! 🥩`,
            };
        } else {
            await bot.DB.poroCount
                .updateOne({ id: message.senderUserID }, { $set: { poroCount: channelData.poroCount - 50 } })
                .exec();
            await ChangeColor(args[0]);
            await client.say(
                message.channelName,
                `Color changed to ${args[0]}! PoroSad [P:${channelData.poroPrestige}] ${
                    channelData.poroCount - 50
                } meat total! 🥩`
            );
            var botColor = {
                color: args[0],
            };
            await fs.writeFile('src/util/botcolor.json', JSON.stringify(botColor) + '\n', (encoding = 'utf8'));
        }
    },
};
