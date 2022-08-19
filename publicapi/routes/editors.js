const express = require('express');
const router = express.Router();
const got = require('got');
const utils = require('../../util/utils');

router.get('/api/twitch/artist/:user', async (req, res) => {
    const { user } = req.params;
    if (!user || !/^[A-Z_\d]{2,26}$/i.test(user)) {
        return res.status(400).json({
            success: false,
            message: "malformed username parameter",
        });
    }

    const userID = await utils.IDByLogin(user);
    const query = [];
        query.push({
            operationName: 'UserRolesCacheQuery',
            variables: {
                channelID: userID,
                includeArtists: true,
                includeEditors: false,
                includeMods: false,
                includeVIPs: false,
            },
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash: 'a0a9cd40e047b86927bf69b801e0a78745487e9560f3365fed7395e54ca82117',
                },
            },
        });

        const { body: pogger } = await got.post('https://gql.twitch.tv/gql', {
            throwHttpErrors: false,
            responseType: 'json',
            headers: {
                'Authorization': `OAuth ${process.env.TWITCH_GQL_OAUTH_KEKW}`,
                'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`,
            },
            json: query,
        });
        const {artists} = pogger[0].data;
        const artistsMapped = artists.edges.map(({node, grantedAt}) => ({id: node.id, login: node.login, displayName: node.displayName, grantedAt: grantedAt}));
        return res.status(200).json({
            success: true,
            artists: artistsMapped
        });
})

module.exports = router;