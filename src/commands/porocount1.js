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
        const displayPoroRankByName = {
            1: 'Raw',
            2: 'Rare',
            3: 'Medium Rare',
            4: 'Medium',
            5: 'Medium Well',
            6: 'Well Done',
            7: 'Cooked',
        };

        const { senderUserID, senderUsername } = message;
        const targetUser = await utils.ParseUser(args[0]?.toLowerCase() ?? senderUsername);
        const selfPoroData = await bot.DB.poroCount.findOne({ id: await utils.IDByLogin(targetUser) });
        if (!selfPoroData) {
            const pronouns =
                args.length > 0
                    ? `kattahHappy @${targetUser} isnt registered!`
                    : `kattahHappy you arent registered! ${senderUsername} type ${
                          channelData.prefix ?? `|`
                      }poro to get started.`;
            return {
                text: pronouns,
            };
        }

        const { poroCount, poroPrestige, joinedAt, poroRank } = selfPoroData;
        const parsedTime = Math.abs(new Date().getTime() - new Date(joinedAt).getTime());
        const successPronouns =
            args.length > 0
                ? `${targetUser} => [P${poroPrestige}: ${
                      displayPoroRankByName[poroRank]
                  }] ${poroCount} poro(s). kattahHappy Registered (${humanizeDuration(parsedTime)})`
                : `${senderUsername} => [P${poroPrestige}: ${
                      displayPoroRankByName[poroRank]
                  }] ${poroCount} poro(s). kattahHappy Registered (${humanizeDuration(parsedTime)})`;
        return {
            text: successPronouns,
        };
    },
};
