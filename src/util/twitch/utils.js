const got = require('got');
const Redis = require('ioredis');
const redis = new Redis({});

exports.loginByID = async (userID) => {
	if (!userID) return null;
	const { body } = await got(`https://api.ivr.fi/v2/twitch/user?id=${encodeURIComponent(userID)}`, {
		responseType: 'json',
		throwHttpErrors: false,
		headers: {
			'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
		},
	});
	if (!body[0].id) return null;
	return body[0].login;
};

exports.IVR = async (userID) => {
	if (!userID) return null;
	const { body } = await got(`https://api.ivr.fi/v2/twitch/user?id=${encodeURIComponent(userID)}`, {
		responseType: 'json',
		throwHttpErrors: false,
		headers: {
			'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
		},
	});
	if (!body[0].id) return null;
	return body[0];
};

exports.IVRByLogin = async (username) => {
	if (!username) return null;
	const { body } = await got(`https://api.ivr.fi/v2/twitch/user?login=${encodeURIComponent(username)}`, {
		responseType: 'json',
		throwHttpErrors: false,
		headers: {
			'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
		},
	});
	if (!body[0]?.id) return null;
	return body[0];
};

exports.displayName = async (username) => {
	if (!username) return null;
	const { body } = await got(`https://api.ivr.fi/v2/twitch/user?login=${encodeURIComponent(username)}`, {
		responseType: 'json',
		throwHttpErrors: false,
		headers: {
			'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
		},
	});
	if (!body[0].id) return null;
	return body[0].displayName;
};

exports.IDByLogin = async (username) => {
	if (!username) return null;
	const { body } = await got(`https://api.ivr.fi/v2/twitch/user?login=${encodeURIComponent(username)}`, {
		responseType: 'json',
		throwHttpErrors: false,
		headers: {
			'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
		},
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
		headers: {
			'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
		},
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

exports.PoroNumberOne = async (userID) => {
	if (!userID) return null;
	const redisValue = await redis.get('leaderboardEndpoint');
	const { leaderboards } = JSON.parse(redisValue);
	const user = leaderboards.find((u) => u.id === userID);
	if (!user) return null;
	return user;
};

exports.ParseUser = async (user) => {
	const parsed = user.replace(/[@#,]/g, ''); // Remove @, #, and ,
	return parsed;
};

exports.Invest = async (symbol) => {
	const res = await got(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`).catch((e) => console.log(e));
	if (!res) return null;
	const data = JSON.parse(res.body);
	return data;
};
