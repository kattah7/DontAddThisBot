const got = require('got');
const { twitch } = require('../../config.json');

const gql = got.extend({
	url: 'https://7tv.io/v3/gql',
	throwHttpErrors: false,
	responseType: 'json',
	headers: {
		Authorization: `Bearer ${twitch.stv_token}`,
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

exports.AddSTVEmote = async (emote, channel, name) => {
	const query = {
		operationName: 'ChangeEmoteInSet',
		query: 'mutation ChangeEmoteInSet($id: ObjectID!, $action: ListItemAction!, $emote_id: ObjectID!, $name: String) {\n  emoteSet(id: $id) {\n    id\n    emotes(id: $emote_id, action: $action, name: $name) {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}',
		variables: {
			action: 'ADD',
			emote_id: emote,
			id: channel,
			name: name || null,
		},
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
				ignore_tags: false,
			},
		},
		operationName: 'SearchEmotes',
		query: 'query SearchEmotes($query: String!, $page: Int, $limit: Int, $filter: EmoteSearchFilter) {\n  emotes(query: $query, page: $page, limit: $limit, filter: $filter) {\n    count\n    items {\n      id\n      name\n      listed\n      trending\n      owner {\n        id\n        username\n        display_name\n        style {\n          color\n          __typename\n        }\n        __typename\n      }\n      flags\n      host {\n        url\n        files {\n          name\n          format\n          width\n          height\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}',
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
	};
	const removeEmote = await makeRequest(query);
	return removeEmote;
};

exports.GetAllEmoteSets = async (channel) => {
	const query = {
		operationName: 'GetUserEmoteData',
		query: 'query GetUserEmoteData($id: ObjectID!, $formats: [ImageFormat!]) {\n  user(id: $id) {\n    emote_sets {\n      id\n      name\n      capacity\n      emotes {\n        id\n        name\n        actor {\n          id\n          username\n          display_name\n          avatar_url\n          style {\n            color\n            __typename\n          }\n          __typename\n        }\n        data {\n          id\n          name\n          lifecycle\n          listed\n          flags\n          host {\n            url\n            files(formats: $formats) {\n              name\n              format\n              __typename\n            }\n            __typename\n          }\n          owner {\n            id\n            display_name\n            style {\n              color\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      owner {\n        id\n        display_name\n        style {\n          color\n          __typename\n        }\n        avatar_url\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}',
		variables: {
			id: channel,
		},
	};
	const allEmoteSets = await makeRequest(query);
	return allEmoteSets;
};

exports.GetEditorOfChannels = async (stvID) => {
	const query = {
		operationName: 'GetUserEditorOf',
		query: 'query GetUserEditorOf($id: ObjectID!) {\n  user(id: $id) {\n    id\n    editor_of {\n      user {\n        id\n        username\n        display_name\n        roles\n        style {\n          color\n          __typename\n        }\n        avatar_url\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}',
		variables: {
			id: stvID,
		},
	};
	const { data } = await makeRequest(query);
	return data;
};

exports.GetStvRoles = async () => {
	const query = {
		operationName: 'AppState',
		query: 'query AppState {\n  globalEmoteSet: namedEmoteSet(name: GLOBAL) {\n    id\n    name\n    emotes {\n      id\n      name\n      flags\n      __typename\n    }\n    capacity\n    __typename\n  }\n  roles: roles {\n    id\n    name\n    allowed\n    denied\n    position\n    color\n    invisible\n    __typename\n  }\n}',
	};
	const { data } = await makeRequest(query);
	return data;
};
