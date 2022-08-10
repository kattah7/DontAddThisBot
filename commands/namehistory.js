const got = require('got');

module.exports = {
    name: 'history',
    cooldown: 5000,
    description: 'Check name history',
    execute: async(message, args, client) => {
            const { body: pogger2, statusCode } = await got(`https://api.ivr.fi/v2/twitch/user?login=${args[0]}`, {
            throwHttpErrors: false,
            responseType: 'json',
        })
        if (!args[0]) { 
            return {
                text: 'Please provide a username.'
            }
        }
        //console.log(pogger2[0])
        if (pogger2[0] == undefined) {
            return {
                text: `${message.senderUsername}, ${args[0]} is not a valid username.`
            }
        }
        if (pogger2[0].roles.isAffiliate != true && pogger2[0].roles.isPartner != true) {
            return {
                text: `${args[0]} must be affiliate or partner to check`
            }
        }
        const query = []
            query.push({
                "operationName": "SupportPanel_CurrentSubscription",
                "variables": {
                    "giftRecipientLogin": "",
                    "login": `${args[0]}`,
                    "withStandardGifting": false,
                },
                "extensions": {
                    "persistedQuery": {
                        "version": 1,
                        "sha256Hash": "3e68467a1c2018ad6cf500193a798c6d87773cf25a7e9749cb5c62052d898fba"
                    }
                }
            })

            const { body: pogger, statusCode2 } = await got.post('https://gql.twitch.tv/gql', {
            throwHttpErrors: false,
            responseType: 'json',
            headers: {
                'Authorization': `OAuth ${process.env.TWITCH_GQL_OAUTH_KEKW}`,
                'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`,
            },
            json: query
        })
        //console.log(pogger[0].data.user)
        if (pogger[0].data.user.subscriptionProducts[0].name) {
            if (args[0].toLowerCase() == pogger[0].data.user.subscriptionProducts[0].name) {
                return {
                    text: `${args[0]} has no name change history`
                }
            }
            return {
                text: `${args[0]}'s name history since affiliate/partner: ${pogger[0].data.user.subscriptionProducts[0].name}`
            }
        };
    }
};