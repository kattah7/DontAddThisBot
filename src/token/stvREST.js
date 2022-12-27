const got = require('got');

exports.getUser = async (name) => {
	if (!name) return null;
	const stvInfo = await got(`https://7tv.io/v3/users/twitch/${encodeURIComponent(name)}`, {
		responseType: 'json',
		throwHttpErrors: false,
		headers: {
			'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
		},
	});
	if (!stvInfo.body.id) return null;
	return stvInfo.body;
};

exports.getUsernameByStvID = async (stvID) => {
	if (!stvID) return null;
	const getUsername = await got(`https://7tv.io/v3/users/${encodeURIComponent(stvID)}`, {
		responseType: 'json',
		throwHttpErrors: false,
		headers: {
			'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
		},
	});
	if (!getUsername.body) return null;
	return getUsername.body;
};

exports.GetEmotes = async (emoteID) => {
	if (!emoteID) return null;
	const emote = await got(`https://7tv.io/v3/emotes/${encodeURIComponent(emoteID)}`, {
		responseType: 'json',
		throwHttpErrors: false,
		headers: {
			'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
		},
	});
	if (emote.body.id === '000000000000000000000000') return null;
	return emote.body;
};

exports.GlobalEmote = () => {
	return '(7TV)';
};
