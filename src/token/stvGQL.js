const got = require('got');

const gql = got.extend({
    url: 'https://7tv.io/v3/gql',
    throwHttpErrors: false,
    responseType: 'json',
    headers: {
        Authorization: process.env.STV_AUTH_TOKEN,
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

exports.AddSTVEmote = async (emote, channel) => {
    const query = {
        operationName: 'ChangeEmoteInSet',
        query: 'mutation ChangeEmoteInSet($id: ObjectID!, $action: ListItemAction!, $emote_id: ObjectID!, $name: String) {\n  emoteSet(id: $id) {\n    id\n    emotes(id: $emote_id, action: $action, name: $name) {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}',
        variables: {
            action: 'ADD',
            emote_id: emote,
            id: channel,
        },
        type: 'connection_init',
    };
    const addEmote = await makeRequest(query);
    return addEmote;
};

exports.SearchSTVEmote = async (emote, Boolean) => {
    const query = {
        variables: {
            query: emote,
            limit: 300,
            page: 1,
            filter: {
                case_sensitive: true,
                category: `TOP`,
                exact_match: Boolean,
                ignore_tags: true,
            },
        },
        operationName: 'SearchEmotes',
        query: 'query SearchEmotes($query: String!, $page: Int, $limit: Int, $filter: EmoteSearchFilter) {\n  emotes(query: $query, page: $page, limit: $limit, filter: $filter) {\n    count\n    items {\n      id\n      name\n      listed\n      trending\n      owner {\n        id\n        username\n        display_name\n        tag_color\n        __typename\n      }\n      flags\n      images {\n        name\n        format\n        url\n        width\n        height\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}',
    };
    const searchEmote = await makeRequest(query);
    return searchEmote;
};

exports.AliasSTVEmote = async (emote, setID, name) => {
    const query = {
        operationName: 'ChangeEmoteInSet',
        query: 'mutation ChangeEmoteInSet($id: ObjectID!, $action: ListItemAction!, $emote_id: ObjectID!, $name: String) {\n  emoteSet(id: $id) {\n    id\n    emotes(id: $emote_id, action: $action, name: $name) {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}',
        variables: {
            action: 'UPDATE',
            emote_id: emote,
            id: setID,
            name: name,
        },
        type: 'connection_init',
    };
    const aliasEmote = await makeRequest(query);
    return aliasEmote;
};

exports.RemoveSTVEmote = async (emote, channel) => {
    const query = {
        operationName: 'ChangeEmoteInSet',
        query: 'mutation ChangeEmoteInSet($id: ObjectID!, $action: ListItemAction!, $emote_id: ObjectID!, $name: String) {\n  emoteSet(id: $id) {\n    id\n    emotes(id: $emote_id, action: $action, name: $name) {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}',
        variables: {
            action: 'REMOVE',
            emote_id: emote,
            id: channel,
        },
        type: 'connection_init',
    };
    const removeEmote = await makeRequest(query);
    return removeEmote;
};