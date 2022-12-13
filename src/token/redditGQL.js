const got = require('got');
const { reddit } = require('../../config.json');

const reddit = got.extend({
	url: 'https://gql.reddit.com',
	throwHttpErrors: false,
	responseType: 'json',
	headers: {
		Authorization: `Bearer ${reddit.gql_token}`,
	},
});

async function makeRequest(query) {
	const gqlReq = await reddit
		.post({
			json: query,
		})
		.json();
	return gqlReq;
}

exports.UserInfo = async (user) => {
	const query = {
		id: 'db6eb1356b13',
		variables: {
			name: user,
		},
	};
	const { data } = await makeRequest(query);
	return data;
};
