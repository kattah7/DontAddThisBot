const got = require('got');

exports.loginByID = async (userID) => {
    if (!userID) return null
    userData = await got(`https://api.ivr.fi/twitch/resolve/${encodeURIComponent(userID)}?id=true`, { responseType: 'json', throwHttpErrors: false })
    if (!userData.body.id) return null
    return userData.body.login
};

exports.sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
};

exports.splitArray = (arr, len) => {
    var chunks = [], i = 0, n = arr.length;
    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }
    return chunks;
};
