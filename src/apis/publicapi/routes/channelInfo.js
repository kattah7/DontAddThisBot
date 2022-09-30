const express = require('express');
const router = express.Router();
const utils = require('../../../util/utils');

router.get('/api/bot/channel/:user', async (req, res) => {
    const { user } = req.params;
    if (!user || !/^[A-Z_\d]{4,25}$/i.test(user)) {
        return res.status(400).json({
            success: false,
            message: 'malformed username parameter',
        });
    }

    const channelInfo = await bot.DB.channels.findOne({ id: await utils.IDByLogin(user) }).exec();
    if (!channelInfo) {
        return res.status(400).json({
            success: false,
            message: 'user not found',
        });
    }

    const mapped = channelInfo.editors.map(({ username, id, grantedAt }) => ({ username, id, grantedAt }));
    return res.status(200).json({
        success: true,
        username: channelInfo.username,
        id: channelInfo.id,
        joinedAt: channelInfo.joinedAt,
        editors: mapped,
        offlineOnly: channelInfo.offlineOnly,
        poroOnly: channelInfo.poroOnly,
        stvOnly: channelInfo.stvOnly,
        isChannel: channelInfo.isChannel,
    });
});

module.exports = router;
