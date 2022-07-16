require("dotenv").config();
const got = require('got');

exports.loginByID = async (userID) => {
    if (!userID) return null
    userData = await got(`https://api.ivr.fi/twitch/resolve/${encodeURIComponent(userID)}?id=true`, { responseType: 'json', throwHttpErrors: false })
    if (!userData.body.id) return null
    return userData.body.login
};

exports.IDByLogin = async (userID) => {
    if (!userID) return null
    userData = await got(`https://api.ivr.fi/twitch/resolve/${encodeURIComponent(userID)}`, { responseType: 'json', throwHttpErrors: false })
    if (!userData.body.id) return null
    return userData.body.id
};

exports.getPFP = async (userID) => {
    if (!userID) return null
    userData = await got(`https://api.ivr.fi/twitch/resolve/${encodeURIComponent(userID)}`, { responseType: 'json', throwHttpErrors: false })
    if (!userData.body.id) return null
    return userData.body.logo
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

exports.IDtoEmote = async (emote) => {
    if (!emote) return null
    const emoteData = await got(`https://api.7tv.app/v2/emotes/${emote}`, { responseType: 'json', throwHttpErrors: false })
    if (!emoteData.body.id) return null
    return emoteData.body.name
}

exports.NameToID = async (name) => {
    if (!name) return null
    const nameData = await got(`https://api.7tv.app/v2/users/${name}`, { responseType: 'json', throwHttpErrors: false })
    if (!nameData.body.id) return null
    return nameData.body.id
}

exports.channelEmotes = async (channel) => {
    if (!channel) return null
    const channelData = await got(`https://api.7tv.app/v2/users/${channel}/emotes`, { responseType: 'json', throwHttpErrors: false })
    if (!channelData) return null
    return channelData.body
}