const express = require('express');
const router = express.Router();
const utils = require('../../util/utils');

router.get('/api/bot/porocount/:user', async (req, res) => {
    const {user} = req.params;
    if (!user || !/^[A-Z_\d]{4,25}$/i.test(user)) {
        return res.status(400).json({
            success: false,
            message: "malformed username parameter",
        });
    }

    const poroCount = await bot.DB.poroCount.findOne({id: await utils.IDByLogin(user)}).exec();
    if (!poroCount) {
        return res.status(400).json({
            success: false,
            message: "user not found",
        });
    }
    const poroData = await bot.DB.poroCount.find({}).exec();
    const userRank = poroData.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount).findIndex((user) => user.username == req.params.user) + 1;

    return res.status(200).json({
        success: true,
        username: poroCount.username,
        id: poroCount.id,
        poroCount: poroCount.poroCount,
        poroPrestige: poroCount.poroPrestige,
        joinedAt: poroCount.joinedAt,
        userRank: userRank,
        totalRank: poroData.length
    })
})

module.exports = router;