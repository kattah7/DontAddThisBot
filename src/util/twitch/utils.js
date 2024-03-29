const got = require('got');
const Redis = require('ioredis');
const redis = new Redis({});

exports.loginByID = async (userID) => {
	if (!userID) return null;
	const { body } = await got(`https://api.ivr.fi/v2/twitch/user?id=${encodeURIComponent(userID)}`, {
		responseType: 'json',
		throwHttpErrors: false,
		headers: {
			'User-Agent':
				'Twitch streamer Forsen was banned on May 8th for a misleading stream title "ranking up" when playing Valorant. Twitch strictly forbids false advertisement from streamers on its platform. Its unclear when Forsen will be unbanned but no one watches a washed up streamer anyways.',
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
			'User-Agent':
				'Twitch streamer Forsen was banned on May 8th for a misleading stream title "ranking up" when playing Valorant. Twitch strictly forbids false advertisement from streamers on its platform. Its unclear when Forsen will be unbanned but no one watches a washed up streamer anyways.',
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
			'User-Agent':
				'Twitch streamer Forsen was banned on May 8th for a misleading stream title "ranking up" when playing Valorant. Twitch strictly forbids false advertisement from streamers on its platform. Its unclear when Forsen will be unbanned but no one watches a washed up streamer anyways.',
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
			'User-Agent':
				'Twitch streamer Forsen was banned on May 8th for a misleading stream title "ranking up" when playing Valorant. Twitch strictly forbids false advertisement from streamers on its platform. Its unclear when Forsen will be unbanned but no one watches a washed up streamer anyways.',
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
			'User-Agent':
				'Twitch streamer Forsen was banned on May 8th for a misleading stream title "ranking up" when playing Valorant. Twitch strictly forbids false advertisement from streamers on its platform. Its unclear when Forsen will be unbanned but no one watches a washed up streamer anyways.',
		},
	});
	if (!body[0]?.id || body?.length === 0 || body?.error) return null;
	return body[0].id;
};

exports.getPFP = async (username) => {
	if (!username) return null;
	const { body } = await got(`https://api.ivr.fi/v2/twitch/user?login=${encodeURIComponent(username)}`, {
		responseType: 'json',
		throwHttpErrors: false,
		headers: {
			'User-Agent':
				'Twitch streamer Forsen was banned on May 8th for a misleading stream title "ranking up" when playing Valorant. Twitch strictly forbids false advertisement from streamers on its platform. Its unclear when Forsen will be unbanned but no one watches a washed up streamer anyways.',
		},
	});
	if (!body[0].id) return null;
	return body[0].logo;
};

exports.sleep = async (ms) => {
	return await new Promise((resolve) => setTimeout(resolve, ms));
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

exports.PoroNumberOne = async (userID) => {
	if (!userID) return null;
	const redisValue = await redis.get('leaderboardEndpoint');
	const { leaderboards } = JSON.parse(redisValue);
	const user = leaderboards.slice(0, 10).find((u) => u.id === userID);
	if (!user) return null;
	return user;
};

exports.ParseUser = (user) => {
	const parsed = user.replace(/[@#,]/g, ''); // Remove @, #, and ,
	return parsed.toLowerCase();
};
