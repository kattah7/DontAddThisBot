const express = require('express');
const router = express.Router();
const { backend, token } = require('../../../../config.json');
const fetch = require('node-fetch');
const { getTwitchProfile } = require('../../../token/helix');
const { updateEntireDB } = require('../../../clients/modules/updateUser');
const jwt = require('jsonwebtoken');

const TWITCH_CLIENT_ID = backend.client_id;
const TWITCH_SECRET = backend.client_secret;
const CALLBACK_URL = backend.callback_url;

router.post('/authenticate', async (req, res) => {
	const { code, state } = req.body;
	if (!code || !state) return res.status(400).send({ success: false, message: 'Bad Request' });

	const searchParams = new URLSearchParams({
		client_id: TWITCH_CLIENT_ID,
		client_secret: TWITCH_SECRET,
		code,
		grant_type: 'authorization_code',
		redirect_uri: CALLBACK_URL,
		state,
	});

	const { access_token, refresh_token } = await fetch('https://id.twitch.tv/oauth2/token?' + searchParams.toString(), {
		method: 'POST',
	}).then((res) => res.json());

	const profile = await getTwitchProfile(access_token, TWITCH_CLIENT_ID);
	if (!profile) {
		return res.status(401).send({ success: false, message: 'Unauthorized' });
	}

	const { id, login } = profile[0];
	const getUser = await bot.DB.users.findOne({ id: id }).exec();
	if (getUser && getUser.username !== login) {
		await updateEntireDB(login, id);
	}

	const info = {
		id: id,
		login: login,
	};

	const signJWT = jwt.sign(info, token.key);
	return res.status(200).send({ success: true, token: signJWT });
});

module.exports = router;
