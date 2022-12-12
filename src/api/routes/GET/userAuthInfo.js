const express = require('express');
const router = express.Router();
const { middleWare } = require('../../middleWare');
const { token } = require('../../../../config.json');
const { getTwitchProfile } = require('../../../token/helix');

router.get('/api/twitch', middleWare, async (req, res) => {
	try {
		const userInfo = await getTwitchProfile(token.access_token, token.client_id, req.user.id);
		return res.status(200).send({ success: true, id: { data: userInfo } });
	} catch (err) {
		return res.status(500).send({ success: false, message: err });
	}
});

module.exports = router;
