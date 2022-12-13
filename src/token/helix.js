const got = require('got');
const fetch = require('node-fetch');
const { twitch } = require('../../config.json');

const helix = got.extend({
	prefixUrl: 'https://api.twitch.tv/helix/',
	throwHttpErrors: false,
	responseType: 'json',
	headers: {
		'Client-ID': twitch.client_id,
		Authorization: `Bearer ${twitch.access_token}`,
	},
});

exports.ChangeColor = async (color) => {
	const urlEncodeHex = (hex) => {
		return hex.replace('#', '%23');
	};
	await helix.put(`chat/color?user_id=790623318&color=${urlEncodeHex(color)}`);
};

exports.GetGames = async (name) => {
	const { data } = await helix.get(`games?name=${name}`).json();
	return data;
};

exports.GetFirstStreams = async (number, game) => {
	const { data } = await helix.get(`streams?first=${number}&game_id=${game}`).json();
	return data;
};

exports.Announce = async (channel, args) => {
	await helix.post(`chat/announcements?broadcaster_id=${channel}&moderator_id=790623318`, {
		json: {
			message: args,
			color: 'purple',
		},
	});
};

exports.UserInfo = async (user) => {
	const { data } = await helix.get(`users?login=${user}`).json();
	return data;
};

exports.GetClips = async (channel) => {
	const { data } = await helix.get(`clips?broadcaster_id=${channel}`).json();
	return data;
};

exports.GetStreams = async (channel, Boolean) => {
	// true = login, false = id
	const { data } = await helix.get(`streams?user_${Boolean ? 'login' : 'id'}=${channel}`).json();
	return data;
};

exports.GetTopGames = async (amount) => {
	const { data } = await helix.get(`games/top?first=${amount}`).json();
	return data;
};

exports.getTwitchProfile = async (accessToken, clientID, userID) => {
	const { data } = await fetch(`https://api.twitch.tv/helix/users${userID ? `?id=${userID}` : ''}`, {
		method: 'GET',
		headers: {
			'Client-ID': clientID,
			Accept: 'application/vnd.twitchtv.v5+json',
			Authorization: 'Bearer ' + accessToken,
		},
	}).then((res) => res.json());
	return data;
};
