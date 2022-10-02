const got = require('got');

exports.getUser = async (name) => {
    if (!name) return null;
    const stvInfo = await got(`https://7tv.io/v3/users/twitch/${encodeURIComponent(name)}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!stvInfo.body.id) return null;
    return stvInfo.body;
};

exports.getUsernameByStvID = async (stvID) => {
    if (!stvID) return null;
    const getUsername = await got(`https://7tv.io/v3/users/${encodeURIComponent(stvID)}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!getUsername.body) return null;
    return getUsername.body;
};

exports.StvInformation = async (userID) => {
    if (!userID) return null;
    const nameData = await got(`https://7tv.io/v3/users/twitch/${encodeURIComponent(userID)}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!nameData.body.id) return null;
    return nameData.body;
};

exports.StvEmoteInformation = async (emoteID) => {
    if (!emoteID) return null;
    const emote = await got(`https://7tv.io/v3/emotes/${encodeURIComponent(emoteID)}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (emote.body.id === '000000000000000000000000') return null;
    return emote.body;
};
