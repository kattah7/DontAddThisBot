const got = require('got');

exports.ForsenTV = async (text) => {
	const { banned } = await got.post(`https://forsen.tv/api/v1/banphrases/test `, { json: { message: text } }).json();
	return banned;
};
