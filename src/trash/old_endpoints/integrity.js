const got = require('got');

exports.integrity = async () => {
	const { body } = await got.post({
		url: 'https://gql.twitch.tv/integrity',
		throwHttpErrors: false,
		responseType: 'json',
		headers: {
			authorization: `OAuth ${process.env.TWITCH_GQL_TOKEN}`,
			'client-id': `kimne78kx3ncx6brgo4mv6wki5h1ko`,
			'x-device-id': `${process.env.TWITCH_DEVICE_ID}`,
		},
	});
	return body.token;
};
