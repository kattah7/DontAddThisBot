const humanizeDuration = require('../util/humanizeDuration');
const utils = require('../util/utils.js');

module.exports = {
    tags: 'poro',
    name: 'porocount',
    cooldown: 5000,
    aliases: ['poros'],
    description: 'check poro count of user',
    poro: true,
    execute: async (message, args, client, userdata, params, channelData) => {
        if (!args[0]) {
            const selfPoroData = await bot.DB.poroCount.findOne({ id: message.senderUserID });
            if (!selfPoroData) {
                return {
                    text: `kattahHappy you arent registered! ${message.senderUsername} type ${
                        channelData.prefix ?? `|`
                    }poro to get started.`,
                };
            }

            const { poroCount, poroPrestige, joinedAt } = selfPoroData;
            const parsedTime = Math.abs(new Date().getTime() - new Date(joinedAt).getTime());
            return {
                text: `${
                    message.senderUsername
                } has ${poroCount} poro(s) and ${poroPrestige} prestige. kattahHappy Registered (${humanizeDuration(
                    parsedTime
                )})`,
            };
        } else {
            const targetUser = await utils.ParseUser(args[0]?.toLowerCase());
            const userPoroData = await bot.DB.poroCount.findOne({ id: await utils.IDByLogin(targetUser) });
            if (!userPoroData) {
                return {
                    text: `kattahHappy @${targetUser} isnt registered!`,
                };
            }

            const { poroCount, poroPrestige, joinedAt } = userPoroData;
            const parsedTime = Math.abs(new Date().getTime() - new Date(joinedAt).getTime());
            return {
                text: `${targetUser} has ${poroCount} poro(s) and ${poroPrestige} prestige. kattahHappy Registered (${humanizeDuration(
                    parsedTime
                )})`,
            };
        }
    },
};
