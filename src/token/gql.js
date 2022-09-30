const got = require('got');

const gql = got.extend({
    url: 'https://gql.twitch.tv/gql',
    throwHttpErrors: false,
    responseType: 'json',
    headers: {
        'authorization': `OAuth ${process.env.TWITCH_GQL_TOKEN}`,
        'client-id': `kimne78kx3ncx6brgo4mv6wki5h1ko`,
    },
});

async function makeRequest(query) {
    const gqlReq = await gql
        .post({
            json: query,
        })
        .json();
    return gqlReq;
}

exports.ViewerList = async (channel) => {
    const query = [];
    query.push({
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
    });
    const list = await makeRequest(query);
    return list[0].data.user.channel;
};

exports.ChannelPoints = async (channel) => {
    const query = [];
    query.push({
        operationName: 'ChannelPointsContext',
        variables: {
            channelLogin: channel,
        },
        extensions: {
            persistedQuery: {
                version: 1,
                sha256Hash: '1530a003a7d374b0380b79db0be0534f30ff46e61cffa2bc0e2468a909fbc024',
            },
        },
    });
    const pts = await makeRequest(query);
    return pts[0];
};

exports.NameHistory = async (channel) => {
    const query = [];
    query.push({
        operationName: 'SupportPanel_CurrentSubscription',
        variables: {
            giftRecipientLogin: '',
            login: channel,
            withStandardGifting: false,
        },
        extensions: {
            persistedQuery: {
                version: 1,
                sha256Hash: '3e68467a1c2018ad6cf500193a798c6d87773cf25a7e9749cb5c62052d898fba',
            },
        },
    });
    const history = await makeRequest(query);
    return history[0];
};

exports.Achievements = async (channelID) => {
    const query = [];
    query.push({
        operationName: 'UseQuestsHook',
        variables: {
            channelID: channelID,
        },
        extensions: {
            persistedQuery: {
                version: 1,
                sha256Hash: 'e8b929fa512631579421bb08114072c1cd3be15095034ac0649d726bcffb8404',
            },
        },
    });
    const achievements = await makeRequest(query);
    return achievements[0];
};

exports.GetClips = async (targetUser, UserID) => {
    const query = [];
    query.push({
        operationName: 'ClipsManagerTable_User',
        variables: {
            limit: 20,
            login: targetUser,
            criteria: {
                curatorID: UserID,
                period: `ALL_TIME`,
                sort: `CREATED_AT_ASC`,
            },
        },
        extensions: {
            persistedQuery: {
                version: 1,
                sha256Hash: '604a53d7404bda99ce534bff450d46140354d1b4716b8cf81be372689928c1a0',
            },
        },
    });

    const clips = await makeRequest(query);
    return clips[0];
};

exports.GetBadges = async (user) => {
    const query = [];
    query.push({
        operationName: 'ViewerCard',
        variables: {
            channelID: '716887171',
            channelLogin: `altaccountpoggers`,
            giftRecipientLogin: user,
            hasChannelID: 'true',
            isViewerBadgeCollectionEnabled: 'true',
            withStandardGifting: 'true',
        },
        extensions: {
            persistedQuery: {
                version: 1,
                sha256Hash: '9afddab81b8b216f9370f3f96662d4cefe9eb5312dc4c133ace70fa0a24ec2af',
            },
        },
    });

    const badges = await makeRequest(query);
    return badges[0];
};

exports.GetFirstFollows = async (user) => {
    const query = [];
    query.push({
        query: `{
                user(login: "${user}") {
                    followers(order: ASC, first: 10) {
                        edges {
                            followedAt
                            node {
                                login
                            }
                        }
                    }
                }
            }`,
    });

    const firstFollows = await makeRequest(query);
    return firstFollows[0];
};

exports.GetChannelRoles = async (channelID) => {
    const query = [];
    query.push({
        operationName: 'UserRolesCacheQuery',
        variables: {
            channelID: channelID,
            includeArtists: true,
            includeEditors: false,
            includeMods: false,
            includeVIPs: false,
        },
        extensions: {
            persistedQuery: {
                version: 1,
                sha256Hash: 'a0a9cd40e047b86927bf69b801e0a78745487e9560f3365fed7395e54ca82117',
            },
        },
    });

    const roles = await makeRequest(query);
    return roles[0];
};
