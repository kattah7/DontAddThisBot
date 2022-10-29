require('dotenv').config();
const got = require('got');

exports.loginByID = async (userID) => {
    if (!userID) return null;
    const { body } = await got(`https://api.ivr.fi/v2/twitch/user?id=${encodeURIComponent(userID)}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!body[0].id) return null;
    return body[0].login;
};

exports.IVR = async (userID) => {
    if (!userID) return null;
    const { body } = await got(`https://api.ivr.fi/v2/twitch/user?id=${encodeURIComponent(userID)}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!body[0].id) return null;
    return body[0];
};

exports.displayName = async (username) => {
    if (!username) return null;
    const { body } = await got(`https://api.ivr.fi/v2/twitch/user?login=${encodeURIComponent(username)}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!body[0].id) return null;
    return body[0].displayName;
};

exports.IDByLogin = async (username) => {
    if (!username) return null;
    const { body } = await got(`https://api.ivr.fi/v2/twitch/user?login=${encodeURIComponent(username)}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (body.length === 0) return null;
    if (!body[0].id) return null;
    return body[0].id;
};

exports.getPFP = async (username) => {
    if (!username) return null;
    const { body } = await got(`https://api.ivr.fi/v2/twitch/user?login=${encodeURIComponent(username)}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!body[0].id) return null;
    return body[0].logo;
};

exports.sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

exports.splitArray = (arr, len) => {
    var chunks = [],
        i = 0,
        n = arr.length;
    while (i < n) {
        chunks.push(arr.slice(i, (i += len)));
    }
    return chunks;
};

exports.channelEmotes = async (channel) => {
    if (!channel) return null;
    const channelData = await got(`https://api.7tv.app/v2/users/${channel}/emotes`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!channelData) return null;
    return channelData.body;
};

exports.stvNameToID = async (name) => {
    if (!name) return null;
    const nameData = await got(`https://7tv.io/v3/users/twitch/${encodeURIComponent(name)}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!nameData.body.id) return null;
    return nameData.body.user.id;
};

exports.PoroNumberOne = async (username) => {
    const poroData = await bot.DB.poroCount.find({}).exec();
    const sorted = poroData.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount);
    const top1 = sorted.slice(0, 10);
    const findTopTen = top1.find((user) => user.id === username);
    return findTopTen;
};

exports.ParseUser = async (user) => {
    const parsed = user.replace(/[@#,]/g, ''); // Remove @, #, and ,
    return parsed;
};

exports.Invest = async (symbol) => {
    const res = await got(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    ).catch((e) => console.log(e));
    if (!res) return null;
    const data = JSON.parse(res.body);
    return data;
};

exports.EmoteSets = async (username) => {
    const { body: STVInfo } = await got.post(`https://7tv.io/v3/gql`, {
        throwHttpErrors: false,
        responseType: 'json',
        headers: {
            Authorization: process.env.STV_AUTH_TOKEN,
        },
        json: {
            operationName: 'GetUser',
            variables: {
                id: username,
            },
            query: 'query GetUser($id: ObjectID!) {\n  user(id: $id) {\n    ...USER_FRAGMENT\n    __typename\n  }\n}\n\nfragment USER_FRAGMENT on User {\n  id\n  username\n  display_name\n  created_at\n  avatar_url\n  tag_color\n  biography\n  editors {\n    user {\n      id\n      username\n      display_name\n      avatar_url\n      tag_color\n      __typename\n    }\n    __typename\n  }\n  roles\n  emote_sets {\n    id\n    name\n    capacity\n    emotes {\n      id\n      name\n      emote {\n        id\n        name\n        lifecycle\n        flags\n        listed\n        images(formats: [WEBP]) {\n          name\n          format\n          url\n          __typename\n        }\n        owner {\n          id\n          display_name\n          tag_color\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    owner {\n      id\n      display_name\n      tag_color\n      avatar_url\n      __typename\n    }\n    __typename\n  }\n  connections {\n    id\n    display_name\n    platform\n    linked_at\n    emote_slots\n    emote_set_id\n    __typename\n  }\n  owned_emotes {\n    id\n    name\n    images(formats: [WEBP]) {\n      name\n      format\n      url\n      __typename\n    }\n    listed\n    __typename\n  }\n  __typename\n}',
        },
    });
    return STVInfo.data.user.emote_sets;
};

exports.STVGlobalRoles = async () => {
    const { body: STVRoles } = await got.post(`https://7tv.io/v3/gql`, {
        throwHttpErrors: false,
        responseType: 'json',
        json: {
            operationName: 'AppState',
            variables: {},
            query: 'query AppState {\n  globalEmoteSet: namedEmoteSet(name: GLOBAL) {\n    id\n    name\n    emotes {\n      id\n      name\n      flags\n      __typename\n    }\n    capacity\n    __typename\n  }\n  roles: roles {\n    id\n    name\n    allowed\n    denied\n    position\n    color\n    __typename\n  }\n}',
        },
    });
    return STVRoles.data;
};
