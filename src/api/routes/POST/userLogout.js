const express = require('express');
const router = express.Router();
const { middleWare } = require('../../middleWare');

router.post('/api/twitch/logout', middleWare, (req, res) => {
    res.clearCookie('connect.sid');
    res.clearCookie('token');
    res.clearCookie('current');
    return res.status(200).send({ success: true });
});

module.exports = router;
