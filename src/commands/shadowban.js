const got = require('got');
const { integrity } = require('../token/integrity.js');
const { gql } = require('../token/gql.js');

module.exports = {
    tags: 'moderation',
    name: 'restrict',
    description: 'restrict a user (Requires Mod)',
    cooldown: 1500,
    permission: 1,
    botPerms: 'mod',
    async execute(message, args, client) {
        if (!args[0]) {
            return {
                text: `insert name to restrict lol`,
            };
        }
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/v2/twitch/user?login=${targetUser}`, {
            timeout: 10000,
            throwHttpErrors: false,
            responseType: 'json',
        });
        //console.log(userData)

        const query = [];
        query.push({
            operationName: 'UpdateLowTrustUserTreatment',
            variables: {
                input: {
                    channelID: `${message.channelID}`,
                    targetID: `${userData[0].id}`,
                    treatment: 'RESTRICTED',
                },
            },
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash: '5ff4591da4a7b5c39344b551f32ceeca45f480f1d034510d430a29f760d57dec',
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
            text: `Restricted ${targetUser}`,
        };
    },
};
