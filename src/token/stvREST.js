const got = require('got');

exports.getUser = async (name) => {
    if (!name) return null;
    const nameData = await got(`https://7tv.io/v3/users/twitch/${encodeURIComponent(name)}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!nameData.body.id) return null;
    return nameData.body;
};
