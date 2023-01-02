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

exports.GetUser = async (user) => {
	const query = {
		operationName: 'GetUser',
		query: `query GetUser($id: ObjectID!) {
		user(id: $id) {
			id
			username
			emote_sets {
				id
				name
				capacity
				emotes {
					id
					name
					data {
						id
						name
					}
				}
			}
			editors {
				user {
					id
					username
				}
			}
			connections {
				platform
				emote_set_id
				id
			}
		}
		}`,
		variables: {
			id: user,
		},
	};

	const userInfo = await makeRequest(query);
	return userInfo;
};

exports.SearchUser = async (user) => {
	const query = {
		operationName: 'SearchUsers',
		query: `query SearchUsers($query: String!) {
		users(query: $query) {
			id
			username
			connections {
				platform
				emote_set_id
				id
			}
		}
		}`,
		variables: {
			query: user,
		},
	};

	const userInfo = await makeRequest(query);
	return userInfo;
};

exports.AddSTVEmote = async (emote, channel, name) => {
	const query = {
		operationName: 'ChangeEmoteInSet',
		query: `mutation ChangeEmoteInSet($id: ObjectID!, $action: ListItemAction!, $emote_id: ObjectID!, $name: String) {
			emoteSet(id: $id) {
				id
				emotes(id: $emote_id, action: $action, name: $name) {
					id
					name
				}
			}
		}`,
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
		query: `query SearchEmotes($query: String!, $page: Int, $limit: Int, $filter: EmoteSearchFilter) {
		emotes(query: $query, page: $page, limit: $limit, filter: $filter) {
			count
			items {
				id
				name
				listed
				owner {
					id
					username
					display_name
				}
			}
		}
		}`,
	};
	const searchEmote = await makeRequest(query);
	return searchEmote;
};

exports.AliasSTVEmote = async (emote, setID, name) => {
	const query = {
		operationName: 'ChangeEmoteInSet',
		query: `mutation ChangeEmoteInSet($id: ObjectID!, $action: ListItemAction!, $emote_id: ObjectID!, $name: String) {
			emoteSet(id: $id) {
				id
				emotes(id: $emote_id, action: $action, name: $name) {
					id
					name
				}
			}
		}`,
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
		query: `mutation ChangeEmoteInSet($id: ObjectID!, $action: ListItemAction!, $emote_id: ObjectID!, $name: String) {
			emoteSet(id: $id) {
				id
				emotes(id: $emote_id, action: $action, name: $name) {
					id
					name
				}
			}
		}`,
		variables: {
			action: 'REMOVE',
			emote_id: emote,
			id: channel,
		},
	};
	const removeEmote = await makeRequest(query);
	return removeEmote;
};

exports.SwitchEmoteSet = async (connectionID, emoteSetID, sevenTVId) => {
	const query = {
		operationName: 'SwitchEmoteSet',
		query: `mutation SwitchEmoteSet($id: ObjectID!, $conn_id: String!, $d: UserConnectionUpdate!) {
			user(id: $id) {
				connections(id: $conn_id, data: $d) {
					id
					platform
					display_name
					emote_set_id
				}
			}
		}`,
		variables: {
			conn_id: connectionID,
			d: {
				emote_set_id: emoteSetID,
			},
			id: sevenTVId,
		},
	};

	const SwitchSet = await makeRequest(query);
	return SwitchSet;
};

exports.GetEditorOfChannels = async (stvID) => {
	const query = {
		operationName: 'GetUserEditorOf',
		query: `query GetUserEditorOf($id: ObjectID!) {
			user(id: $id) {
				id
				editor_of {
					user {
						id
						username
						display_name
						roles
					}
				}
			}
		}`,
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
		query: `query AppState {
			roles: roles {
				id
				name
				allowed
				color
			}
		}`,
	};
	const { data } = await makeRequest(query);
	return data;
};
