const { ChannelPoints } = require('../token/gql');

module.exports = {
    name: 'channelpoints',
    description: 'check if user has channelpoints.',
    cooldown: 3000,
    aliases: [],
    level: 3,
    execute: async (message, args, client) => {
        const pogger = await ChannelPoints(args[0]);
        const channelPoints = pogger.data.community.channel.communityPointsSettings.customRewards;
        const channelPointsMapped = channelPoints.map(({ cost, title, prompt, redemptionsRedeemedCurrentStream }) => ({
            title: title,
            cost: cost,
            prompt: prompt,
            redeemCountThisStream: redemptionsRedeemedCurrentStream,
        }));
        console.log(channelPointsMapped);
    },
};
