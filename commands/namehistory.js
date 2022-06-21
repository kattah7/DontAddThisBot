const got = require('got');
const regex = require('../util/regex.js');

module.exports = {
    name: 'history',
    cooldown: 5000,
    description: 'Check name history',
    execute: async(message, args, client) => {
        if (!regex.racism.test(args[0])) {
            const { body: pogger2, statusCode } = await got(`https://api.ivr.fi/v2/twitch/user?login=${args[0]}`, {
            throwHttpErrors: false,
            responseType: 'json',
        })
        console.log(pogger2[0])
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
        if (!args[0]) { 
            return {
                text: 'Please provide a username.'
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
        console.log(pogger[0].data.user)
        if (pogger[0].data.user.subscriptionProducts[0].name) {
            if (args[0].toLowerCase() == pogger[0].data.user.subscriptionProducts[0].name) {
                return {
                    text: `${args[0]} has no name change history`
                }
            }
            return {
                text: `${args[0]}'s name history since affiliate/partner: ${pogger[0].data.user.subscriptionProducts[0].name}`
            }
        }
        console.log(pogger[0].data.user.subscriptionProducts[0].name)
    }   else { 
        const XD = 'https://discord.com/api/webhooks/987735146297962497/Kvhez5MjG5Y-XiYQo9EUGbhiVd6UODyOf58WjkAZwRQMglOX_cpiW436mXZLLD8T7oFA'
        const msg2 = {
            embeds: [{
                color: 0x0099ff,
                title: `Sent by ${message.senderUsername}(UID:${message.senderUserID}) in #${message.channelName}`,
                author: {
                    name: 'racist detected',
                    icon_url: 'https://i.nuuls.com/g8l2r.png',
                },
                description: `${args.join(" ")}`,
                timestamp: new Date(),
                footer: {
                    text: 'Pulled time',
                    icon_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/89049925-b020-436f-bf9e-6262c0bc6419-profile_image-600x600.png ',
                }
            }]
        }
        fetch(XD + "?wait=true", 
        {"method":"POST", 
        "headers": {"content-type": "application/json"},
        "body": JSON.stringify(msg2)})
        .then(a=>a.json()).then(console.log)
        return {
            text: 'That message violates the terms of service.'
        }
    } 
    }
}