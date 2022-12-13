const { TwitterApi } = require('twitter-api-v2');
const { twitter } = require('../../../config.json');

const client = new TwitterApi({
	appKey: twitter.app_key,
	appSecret: twitter.app_secret,
	accessToken: twitter.access_token,
	accessSecret: twitter.access_secret,
});

const rwClient = client.readWrite;

module.exports = rwClient;
