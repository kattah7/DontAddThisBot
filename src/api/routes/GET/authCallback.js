const express = require('express');
const router = express.Router();
const { backend, token } = require('../../../../config.json');
const { getTwitchProfile } = require('../../../token/helix');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

const TWITCH_CLIENT_ID = backend.client_id;
const TWITCH_SECRET = backend.client_secret;
const CALLBACK_URL = backend.callback_url;

router.get('/auth/twitch/callback', async (req, res, next) => {
    const { current } = req.cookies;
    if (req.cookies?.token) {
        return res.redirect(backend.origin + current);
    }

    const { code, state } = req.query;

    const searchParams = new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: CALLBACK_URL,
        state,
    });

    const { access_token, refresh_token } = await fetch(
        'https://id.twitch.tv/oauth2/token?' + searchParams.toString(),
        {
            method: 'POST',
        }
    ).then((res) => res.json());

    const profile = await getTwitchProfile(access_token, TWITCH_CLIENT_ID);
    if (!profile) {
        return res.redirect(backend.origin + current);
    }

    const info = {
        id: profile[0].id,
        login: profile[0].login,
    };

    const signJWT = jwt.sign(info, token.key);
    res.cookie('token', signJWT, {
        httpOnly: true,
        secure: true,
    });

    return res.redirect(backend.origin + current);
});

module.exports = router;
