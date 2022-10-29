const express = require('express');
const router = express.Router();
const utils = require('../../../util/utils');

router.get('/api/bot/porocount/:user', async (req, res) => {
    const { user } = req.params;
    if (!user || !/^[A-Z_\d]{3,25}$/i.test(user)) {
        return res.status(400).json({
            success: false,
            message: 'malformed username parameter',
        });
    }

    const UID = await utils.IDByLogin(user);
    const poroCount = await bot.DB.poroCount.findOne({ id: UID }).exec();
    if (!poroCount) {
        return res.status(400).json({
            success: false,
            message: 'user not found',
        });
    }
    const poroData = await bot.DB.poroCount.find({}).exec();
    const userRank =
        poroData
            .filter((a) => a.poroPrestige > 0)
            .sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroRank - a.poroRank || b.poroCount - a.poroCount)
            .findIndex((user) => user.username == req.params.user) + 1;
    const poroLastUsage = await bot.Redis.get(`poro:${UID}`);
    const poroCdrLastUsage = await bot.Redis.get(`porocdr:${UID}`);
    const poroRedeemLastUsage = await bot.Redis.get(`pororedeem:${UID}`);

    function obj(key) {
        return {
            isAvailable: false,
            lastUsage: key,
        };
    }

    function IHateMath(key, time) {
        return Math.abs(new Date().getTime() - new Date(key).getTime()) > 1000 * 60 * 60 * time;
    }

    const cooldownsMapped = {
        poro: IHateMath(poroLastUsage, 2) ? true : obj(poroLastUsage),
        poroCdr: IHateMath(poroCdrLastUsage, 3) ? true : obj(poroCdrLastUsage),
        poroRedeem: IHateMath(poroRedeemLastUsage, 24) ? true : obj(poroRedeemLastUsage),
    };

    return res.status(200).json({
        success: true,
        username: poroCount.username,
        id: poroCount.id,
        poroCount: poroCount.poroCount,
        poroPrestige: poroCount.poroPrestige,
        joinedAt: poroCount.joinedAt,
        userRank: userRank,
        totalRank: poroData.length,
        cooldowns: cooldownsMapped,
    });
});

module.exports = router;
