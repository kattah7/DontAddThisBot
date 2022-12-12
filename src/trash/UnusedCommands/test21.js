require('dotenv').config();
const got = require('got');

const getData = async () => {
	try {
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
					action: 'ADD',
					emote_id: '6102216f04c025a23eeb538b',
					id: '60ae7a3b2d2ea639d684d955',
				},
				type: 'connection_init',
			},
		});
		console.log(poggers);
	} catch (err) {
		console.log(err);
	}
};
getData();
