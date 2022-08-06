const express = require('express');
const router = express.Router();
const utils = require('../../util/utils');

router.post('/api/bot/unban', async (req, res) => {
    const { username } = req.query;
    if (!username || !/^[A-Z_\d]{4,25}$/i.test(username)) {
        return res.status(400).json({
            success: false,
            message: "malformed username parameter",
        });
    }

    const id = await utils.IDByLogin(username);
    const user = await bot.DB.users.findOne({ id: id }).exec();

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "user not found",
        });
    }

    if (user.level != 0) {
        return res.status(409).json({
            success: false,
            message: 'Not blacklisted',
        });
    }

    if (user) {
        try {
            await bot.DB.users.updateOne({ id: id }, { level: 1 }).exec();
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to update datastore.',
            });
        }

        return res.status(200).json({
            success: true,
        });
    }
})

module.exports = router;