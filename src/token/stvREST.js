const got = require('got');
const { twitch } = require('../../config.json');

exports.getUser = async (name) => {
	if (!name) return null;
	const stvInfo = await got(`https://7tv.io/v3/users/twitch/${encodeURIComponent(name)}`, {
		responseType: 'json',
		throwHttpErrors: false,
		headers: {
			'User-Agent':
				'Twitch streamer Forsen was banned on May 8th for a misleading stream title "ranking up" when playing Valorant. Twitch strictly forbids false advertisement from streamers on its platform. Its unclear when Forsen will be unbanned but no one watches a washed up streamer anyways.',
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
			'User-Agent':
				'Twitch streamer Forsen was banned on May 8th for a misleading stream title "ranking up" when playing Valorant. Twitch strictly forbids false advertisement from streamers on its platform. Its unclear when Forsen will be unbanned but no one watches a washed up streamer anyways.',
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
			'User-Agent':
				'Twitch streamer Forsen was banned on May 8th for a misleading stream title "ranking up" when playing Valorant. Twitch strictly forbids false advertisement from streamers on its platform. Its unclear when Forsen will be unbanned but no one watches a washed up streamer anyways.',
		},
	});
	if (emote.body.id === '000000000000000000000000') return null;
	return emote.body;
};

exports.GlobalEmote = () => {
	return '(7TV)';
};

exports.uploadEmote = async (bufValue, emoteName, senderName, channelName) => {
	const data = {
		name: emoteName,
		flags: 0,
		tags: ['uploaded', `${senderName}`, 'inchannel', `${channelName}`],
	};

	try {
		const uploadEmote = await fetch(`https://7tv.io/v3/emotes`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${twitch.stv_token}`,
				'Content-Type': 'YEAHBUTAVIF',
				'X-Emote-Data': JSON.stringify(data),
				'Content-Length': bufValue.byteLength.toString(10),
			},
			body: bufValue,
		}).then((res) => res.json());
		return uploadEmote;
	} catch (err) {
		return {
			text: `Error uploading emote to 7TV`,
			success: false,
		};
	}
};
