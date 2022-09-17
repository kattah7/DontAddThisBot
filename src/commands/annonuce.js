const { integrity } = require('../token/integrity.js');
const { gql } = require('../token/gql.js');

module.exports = {
    name: 'announce',
    description: 'annoucement in chat (Requires Mod)',
    cooldown: 3000,
    permission: 1,
    aliases: ['ann'],
    botPerms: 'mod',
    async execute(message, args) {
        if (args[0] == '.me') {
            return {
                text: `kekw`,
            };
        }
        const query = [];
        query.push({
            operationName: 'SendAnnouncementMessage',
            variables: {
                input: {
                    channelID: `${message.channelID}`,
                    message: `${args.join(' ')}`,
                    color: 'PRIMARY',
                },
            },
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash: 'f9e37b572ceaca1475d8d50805ae64d6eb388faf758556b2719f44d64e5ba791',
                },
            },
        });

        await gql.post({
            headers: {
                'client-integrity': await integrity(),
            },
            json: query,
        });
    },
};
