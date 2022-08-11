require('dotenv').config();
const got = require('got');

exports.loginByID = async (userID) => {
    if (!userID) return null;
    userData = await got(`https://api.ivr.fi/twitch/resolve/${encodeURIComponent(userID)}?id=true`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!userData.body.id) return null;
    return userData.body.login;
};

exports.IVR = async (userID) => {
    if (!userID) return null;
    userData = await got(`https://api.ivr.fi/twitch/resolve/${encodeURIComponent(userID)}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!userData.body.id) return null;
    return userData.body;
};

exports.displayName = async (userID) => {
    if (!userID) return null;
    userData = await got(`https://api.ivr.fi/twitch/resolve/${encodeURIComponent(userID)}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!userData.body.id) return null;
    return userData.body.displayName;
};

exports.IDByLogin = async (userID) => {
    if (!userID) return null;
    userData = await got(`https://api.ivr.fi/twitch/resolve/${encodeURIComponent(userID)}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!userData.body.id) return null;
    return userData.body.id;
};

exports.getPFP = async (userID) => {
    if (!userID) return null;
    userData = await got(`https://api.ivr.fi/twitch/resolve/${encodeURIComponent(userID)}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!userData.body.id) return null;
    return userData.body.logo;
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

exports.IDtoEmote = async (emote) => {
    if (!emote) return null;
    const emoteData = await got(`https://api.7tv.app/v2/emotes/${emote}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!emoteData.body.id) return null;
    return emoteData.body.name;
};

exports.NameToID = async (name) => {
    if (!name) return null;
    const nameData = await got(`https://api.7tv.app/v2/users/${name}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!nameData.body.id) return null;
    return nameData.body.id;
};

exports.STVIDtoName = async (id) => {
    if (!id) return null;
    const nameData = await got(`https://api.7tv.app/v2/users/${encodeURIComponent(id)}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!nameData.body.id) return null;
    return nameData.body;
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
    const nameData = await got(`https://api.7tv.app/v2/users/${encodeURIComponent(name)}`, {
        responseType: 'json',
        throwHttpErrors: false,
    });
    if (!nameData.body.id) return null;
    return nameData.body.id;
};

exports.PoroNumberOne = async () => {
    const poroData = await bot.DB.poroCount.find({}).exec();
    const sorted = poroData.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount);
    const top1 = sorted.slice(0, 1);
    for (const xd of top1) {
        return xd.username;
    }
};

exports.ParseUser = async (user) => {
    const parsed = user.replace(/[@#,]/g, ''); // Remove @, #, and ,
    return parsed;
};

exports.ForsenTV = async (text) => {
    const { banned, banphrase_data } = await got
        .post(`https://forsen.tv/api/v1/banphrases/test `, { json: { message: text } })
        .json();
    return banned;
};

exports.Nymn = async (text) => {
    const { banned, banphrase_data } = await got
        .post(`https://nymn.pajbot.com/api/v1/banphrases/test `, { json: { message: text } })
        .json();
    return banned;
};

exports.StvEditors = async (user) => {
    const { body: pogger, statusCode2 } = await got.post(`https://api.7tv.app/v2/gql`, {
        // find editors
        throwHttpErrors: false,
        responseType: 'json',
        json: {
            query: 'query GetUser($id: String!) {user(id: $id) {...FullUser,, banned, youtube_id}}fragment FullUser on User {id,email, display_name, login,description,role {id,name,position,color,allowed,denied},emote_aliases,emotes { id, name, status, visibility, width, height },owned_emotes { id, name, status, visibility, width, height },emote_ids,editor_ids,editors {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},editor_in {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},follower_count,broadcast {type,title,game_name,viewer_count,},twitch_id,broadcaster_type,profile_image_url,created_at,emote_slots,audit_entries {id,type,timestamp,action_user_id,action_user {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},changes {key, values},target {type,data,id},reason}}',
            variables: {
                id: user,
            },
        },
    });
    return pogger;
};

exports.StvChannelEmotes = async (user) => {
    const { body: STVEmotesInChannel, error } = await got.post(`https://7tv.io/v3/gql`, {
        // find emotes
        throwHttpErrors: false,
        responseType: 'json',
        json: {
            operationName: 'WatchEmoteSetMin',
            query: 'subscription WatchEmoteSetMin($id: ObjectID!, $init: Boolean) {\n  emoteSet(id: $id, init: $init) {\n    id\n    name\n    capacity\n    emotes {\n      id\n      name\n      __typename\n    }\n    owner {\n      id\n      display_name\n      tag_color\n      avatar_url\n      __typename\n    }\n    __typename\n  }\n}',
            variables: {
                id: user,
                init: true,
            },
        },
    });
    return STVEmotesInChannel;
};

exports.AliasSTVEmote = async (emote, userID, name) => {
    const { body: poggers } = await got.post(`https://7tv.io/v3/gql`, {
        throwHttpErrors: false,
        responseType: 'json',
        headers: {
            Authorization: process.env.STV_AUTH,
        },
        json: {
            extensions: {},
            operationName: 'ChangeEmoteInSet',
            query: 'mutation ChangeEmoteInSet($id: ObjectID!, $action: ListItemAction!, $emote_id: ObjectID!, $name: String) {\n  emoteSet(id: $id) {\n    id\n    emotes(id: $emote_id, action: $action, name: $name) {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}',
            variables: {
                action: 'UPDATE',
                emote_id: emote,
                id: userID,
                name: name,
            },
            type: 'connection_init',
        },
    });
    return poggers;
};

exports.AddSTVEmote = async (emote, channel) => {
    const { body: poggers2 } = await got.post(`https://7tv.io/v3/gql`, {
        throwHttpErrors: false,
        responseType: 'json',
        headers: {
            Authorization: process.env.STV_AUTH,
        },
        json: {
            extensions: {},
            operationName: 'ChangeEmoteInSet',
            query: 'mutation ChangeEmoteInSet($id: ObjectID!, $action: ListItemAction!, $emote_id: ObjectID!, $name: String) {\n  emoteSet(id: $id) {\n    id\n    emotes(id: $emote_id, action: $action, name: $name) {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}',
            variables: {
                action: 'ADD',
                emote_id: emote,
                id: channel,
            },
            type: 'connection_init',
        },
    });
    return poggers2;
};

exports.RemoveSTVEmote = async (emote, channel) => {
    const { body: poggers3 } = await got.post(`https://7tv.io/v3/gql`, {
        // remove emote
        throwHttpErrors: false,
        responseType: 'json',
        headers: {
            Authorization: process.env.STV_AUTH,
        },
        json: {
            extensions: {},
            operationName: 'ChangeEmoteInSet',
            query: 'mutation ChangeEmoteInSet($id: ObjectID!, $action: ListItemAction!, $emote_id: ObjectID!, $name: String) {\n  emoteSet(id: $id) {\n    id\n    emotes(id: $emote_id, action: $action, name: $name) {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}',
            variables: {
                action: 'REMOVE',
                emote_id: emote,
                id: channel,
            },
            type: 'connection_init',
        },
    });
    return poggers3;
};

exports.SearchSTVEmote = async (emote) => {
    const { body: poggers4 } = await got.post(`https://7tv.io/v3/gql`, {
        // remove emote
        throwHttpErrors: false,
        responseType: 'json',
        headers: {
            Authorization: process.env.STV_AUTH,
        },
        json: {
            variables: {
                query: emote,
                limit: 300,
            },
            extensions: {},
            operationName: 'SearchEmotes',
            query: 'query SearchEmotes($query: String!, $page: Int, $limit: Int) {\n  emotes(query: $query, page: $page, limit: $limit) {\n    count\n    items {\n      id\n      name\n      listed\n      owner {\n        id\n        username\n        display_name\n        tag_color\n        __typename\n      }\n      flags\n      images {\n        name\n        format\n        url\n        width\n        height\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}',
        },
    });
    return poggers4;
};

exports.StvEmoteIDToEmoteName = async (emoteID) => {
    const { body: poggers5 } = await got.post(`https://7tv.io/v3/gql`, {
        // remove emote
        throwHttpErrors: false,
        responseType: 'json',
        headers: {
            Authorization: process.env.STV_AUTH,
        },
        json: {
            variables: {
                id: emoteID,
            },
            extensions: {},
            operationName: 'Emote',
            query: 'query Emote($id: ObjectID!) {\n  emote(id: $id) {\n    id\n    created_at\n    name\n    lifecycle\n    owner {\n      id\n      username\n      display_name\n      avatar_url\n      tag_color\n      __typename\n    }\n    flags\n    versions {\n      id\n      name\n      description\n      created_at\n      lifecycle\n      images {\n        name\n        format\n        url\n        width\n        height\n        __typename\n      }\n      __typename\n    }\n    animated\n    __typename\n  }\n}',
        },
    });
    return poggers5;
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
            Authorization: process.env.STV_AUTH,
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

exports.VThreeEditors = async (username) => {
    const { body: STVInfo } = await got.post(`https://7tv.io/v3/gql`, {
        throwHttpErrors: false,
        responseType: 'json',
        headers: {
            Authorization: process.env.STV_AUTH,
        },
        json: {
            operationName: 'GetUser',
            variables: {
                id: username,
            },
            query: 'query GetUser($id: ObjectID!) {\n  user(id: $id) {\n    ...USER_FRAGMENT\n    __typename\n  }\n}\n\nfragment USER_FRAGMENT on User {\n  id\n  username\n  display_name\n  created_at\n  avatar_url\n  tag_color\n  biography\n  editors {\n    user {\n      id\n      username\n      display_name\n      avatar_url\n      tag_color\n      __typename\n    }\n    __typename\n  }\n  roles\n  emote_sets {\n    id\n    name\n    capacity\n    emotes {\n      id\n      name\n      emote {\n        id\n        name\n        lifecycle\n        flags\n        listed\n        images(formats: [WEBP]) {\n          name\n          format\n          url\n          __typename\n        }\n        owner {\n          id\n          display_name\n          tag_color\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    owner {\n      id\n      display_name\n      tag_color\n      avatar_url\n      __typename\n    }\n    __typename\n  }\n  connections {\n    id\n    display_name\n    platform\n    linked_at\n    emote_slots\n    emote_set_id\n    __typename\n  }\n  owned_emotes {\n    id\n    name\n    images(formats: [WEBP]) {\n      name\n      format\n      url\n      __typename\n    }\n    listed\n    __typename\n  }\n  __typename\n}',
        },
    });
    return STVInfo.data.user.editors;
};

exports.V3ChannelEmotes = async (username) => {
    const { body: STVInfo } = await got.post(`https://7tv.io/v3/gql`, {
        throwHttpErrors: false,
        responseType: 'json',
        headers: {
            Authorization: process.env.STV_AUTH,
        },
        json: {
            operationName: 'GetUser',
            variables: {
                id: username,
            },
            query: 'query GetUser($id: ObjectID!) {\n  user(id: $id) {\n    ...USER_FRAGMENT\n    __typename\n  }\n}\n\nfragment USER_FRAGMENT on User {\n  id\n  username\n  display_name\n  created_at\n  avatar_url\n  tag_color\n  biography\n  editors {\n    user {\n      id\n      username\n      display_name\n      avatar_url\n      tag_color\n      __typename\n    }\n    __typename\n  }\n  roles\n  emote_sets {\n    id\n    name\n    capacity\n    emotes {\n      id\n      name\n      emote {\n        id\n        name\n        lifecycle\n        flags\n        listed\n        images(formats: [WEBP]) {\n          name\n          format\n          url\n          __typename\n        }\n        owner {\n          id\n          display_name\n          tag_color\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    owner {\n      id\n      display_name\n      tag_color\n      avatar_url\n      __typename\n    }\n    __typename\n  }\n  connections {\n    id\n    display_name\n    platform\n    linked_at\n    emote_slots\n    emote_set_id\n    __typename\n  }\n  owned_emotes {\n    id\n    name\n    images(formats: [WEBP]) {\n      name\n      format\n      url\n      __typename\n    }\n    listed\n    __typename\n  }\n  __typename\n}',
        },
    });
    return STVInfo.data.user;
};
