const got = require('got');

const SE = got.extend({
    prefixUrl: 'https://api.streamelements.com/kappa/v2/',
    throwHttpErrors: false,
    responseType: 'json',
});

exports.ChatStats = async (user) => {
    const data = await SE.get(`chatstats/${user}/stats`).json();
    return data;
};
