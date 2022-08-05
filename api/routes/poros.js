const express = require('express');
const router = express.Router();
const humanizeDuration = require('../../humanizeDuration');
const utils = require('../../util/utils');

router.get('/lookup/:user', async (req, res) => {
    if (!req.params.user) {
        return res.status(400).send('No user specified');
    }

    const poroData = await bot.DB.poroCount.findOne({ id: await utils.IDByLogin(req.params.user) }).exec();
    const channelData = await bot.DB.users.findOne({ id: await utils.IDByLogin(req.params.user) }).exec();

    if (channelData) {
        if (poroData) {
            res.json({
                username: channelData.username,
                level: channelData.level,
                firstSeen: channelData.firstSeen,
                poros: {
                    username: poroData.username,
                    id: poroData.id,
                    joinedAt: poroData.joinedAt,
                    poroCount: poroData.poroCount,
                    poroPrestige: poroData.poroPrestige,
                },
            });
        } else {
            res.json({
                username: channelData.username,
                level: channelData.level,
                firstSeen: channelData.firstSeen,
                poros: null,
            });
        }
    } else {
        res.json({
            Error: null,
        });
    }
});

module.exports = router;
