const got = require('got');

module.exports = {
    name: 'hostingyou',
    cooldown: 3000,
    description: 'Check if someone is hosting you',
    execute: async(message, args, client) => {
        const query = [];
        query.push({
            operationName: 'HostingYouQuery',
            variables: {
                id: '137199626',
            },
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash: '90ece9e45b1df29021d60614eec23a6d708d0b81419657e3e1959a2c741b4d5c',
                },
            },
        });

        const { body: pogger, statusCode2 } = await got.post('https://gql.twitch.tv/gql', {
            throwHttpErrors: false,
            responseType: 'json',
            headers: {
                'Authorization': `OAuth ${process.env.TWITCH_GQL_TOKEN}`,
                'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`,
            },
            json: query,
        });
        console.log(pogger[0].data.user.hostedBy.edges)
    }
}