const utils = require('../util/utils.js');
const { integrity } = require('../token/integrity.js');
const { gql } = require('../token/gql.js');

module.exports = {
    name: 'changename',
    description: "Change the bot's name with 50 poro pts",
    cooldown: 5000,
    aliases: [],
    poro: true,
    poroRequire: true,
    execute: async (message, args, client) => {
        if (!args[0]) {
            return {
                text: `Please insert a name! kattahBAT`,
            };
        }

        if (!/^[dontaddthisbot]{14}$/i.test(args[0])) {
            return {
                text: `kattahBAT you can only change the display name kattahBAT`,
            };
        }

        const displayName = await utils.displayName('dontaddthisbot');
        if (displayName === args[0]) {
            return {
                text: `That display name is already being used! kattahBAT`,
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
            const query = [];
            query.push({
                operationName: 'UpdateUserProfile',
                variables: {
                    input: {
                        description: 'DontAddThisBot is a multi-channel variety and utility moderation/fun chat-bot. ',
                        displayName: `${args[0]}`,
                        userID: '790623318',
                    },
                },
                extensions: {
                    persistedQuery: {
                        version: 1,
                        sha256Hash: '991718a69ef28e681c33f7e1b26cf4a33a2a100d0c7cf26fbff4e2c0a26d15f2',
                    },
                },
            });

            await gql.post('https://gql.twitch.tv/gql', {
                headers: {
                    'client-integrity': await integrity(),
                },
                json: query,
            });

            return {
                text: `Name Changed to ${args[0]}! PoroSad [P:${channelData.poroPrestige}] ${
                    channelData.poroCount - 50
                } meat total! 🥩`,
            };
        }
    },
};
