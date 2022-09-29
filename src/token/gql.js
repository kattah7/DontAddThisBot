const got = require('got');

const gql = got.extend({
    url: 'https://gql.twitch.tv/gql',
    throwHttpErrors: false,
    responseType: 'json',
    headers: {
        'authorization': `OAuth ${process.env.TWITCH_GQL_TOKEN}`,
        'client-id': `kimne78kx3ncx6brgo4mv6wki5h1ko`,
        'x-device-id': `${process.env.TWITCH_DEVICE_ID}`,
    },
});

exports.ViewerList = async (channel) => {
    // make gql request
    const data = await gql
        .post({
            json: [
                {
                    operationName: 'CommunityTab',
                    variables: {
                        login: channel,
                    },
                    extensions: {
                        persistedQuery: {
                            version: 1,
                            sha256Hash: '2e71a3399875770c1e5d81a9774d9803129c44cf8f6bad64973aa0d239a88caf',
                        },
                    },
                },
            ],
        })
        .json();
    return data[0].data.user.channel;
};
