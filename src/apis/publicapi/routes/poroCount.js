const express = require('express');
const router = express.Router();
const utils = require('../../../util/utils');

router.get('/api/bot/porocount/:user', async (req, res) => {
    const { user } = req.params;
    if (!user || !/^[A-Z_\d]{2,30}$/i.test(user)) {
        return res.status(400).json({
            success: false,
            message: 'malformed username parameter',
        });
    }

    const UID = await utils.IDByLogin(user);
    const poroCount = await bot.DB.poroCount.findOne({ id: UID }).exec();
    if (!poroCount) {
        return res.status(404).json({
            success: false,
            message: 'user not found',
        });
    }
    const poroLastUsage = await bot.Redis.get(`poro:${UID}`);
    const poroCdrLastUsage = await bot.Redis.get(`porocdr:${UID}`);
    const poroRedeemLastUsage = await bot.Redis.get(`pororedeem:${UID}`);

    function obj(Boolean, key) {
        return {
            isAvailable: Boolean,
            lastUsage: key,
        };
    }

    function IHateMath(key, time) {
        return Math.abs(new Date().getTime() - new Date(key).getTime()) > 1000 * 60 * 60 * time;
    }

    const cooldownsMapped = {
        poro: IHateMath(poroLastUsage, 2) ? obj(true, poroLastUsage) : obj(false, poroLastUsage),
        poroCdr: IHateMath(poroCdrLastUsage, 3) ? obj(true, poroLastUsage) : obj(false, poroCdrLastUsage),
        poroRedeem: IHateMath(poroRedeemLastUsage, 24) ? obj(true, poroLastUsage) : obj(false, poroRedeemLastUsage),
    };

    const { username, id, poroCount: Count, poroPrestige, poroRank, joinedAt } = poroCount;

    return res.status(200).json({
        success: true,
        username: username,
        id: id,
        poroCount: Count,
        poroPrestige: poroPrestige,
        poroRank: poroRank,
        joinedAt: joinedAt,
        cooldowns: cooldownsMapped,
    });
});

module.exports = router;
