const got = require('got');

module.exports = {
    name: "channelpoints",
    description: "check if user has channelpoints.",
    cooldown: 3000,
    description:"",
    execute: async (message, args, client) => {
        const query = [];
        query.push({
            operationName: 'ChannelPointsContext',
            variables: {
                channelLogin: args[0],
            },
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash: '1530a003a7d374b0380b79db0be0534f30ff46e61cffa2bc0e2468a909fbc024',
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
        const channelPoints = pogger[0].data.community.channel.communityPointsSettings.customRewards
        const channelPointsMapped = channelPoints.map(({cost, title, prompt, redemptionsRedeemedCurrentStream}) => ({title: title, cost: cost, prompt: prompt, redeemCountThisStream: redemptionsRedeemedCurrentStream}))
        console.log(channelPointsMapped)
        //console.log(pogger[0].data.community.channel.communityPointsSettings.customRewards)
    },
};