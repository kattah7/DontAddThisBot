const got = require('got');
const { NameHistory } = require('../token/gql.js');

module.exports = {
    tags: 'stats',
    name: 'history',
    cooldown: 5000,
    description: 'Check name history',
    execute: async (message, args, client) => {
        const { body: pogger2 } = await got(`https://api.ivr.fi/v2/twitch/user?login=${args[0]}`, {
            throwHttpErrors: false,
            responseType: 'json',
        });
        if (!args[0]) {
            return {
                text: 'Please provide a username.',
            };
        }
        if (pogger2[0] == undefined) {
            return {
                text: `${message.senderUsername}, ${args[0]} is not a valid username.`,
            };
        }
        if (pogger2[0].roles.isAffiliate != true && pogger2[0].roles.isPartner != true) {
            return {
                text: `${args[0]} must be affiliate or partner to check`,
            };
        }
        const pogger = await NameHistory(args[0]);
        const { subscriptionProducts } = pogger.data.user;
        if (subscriptionProducts[0].name) {
            if (args[0].toLowerCase() == subscriptionProducts[0].name) {
                return {
                    text: `${args[0]} has no name change history`,
                };
            }
            return {
                text: `${args[0]}'s name history since affiliate/partner: ${subscriptionProducts[0].name}`,
            };
        }
    },
};
