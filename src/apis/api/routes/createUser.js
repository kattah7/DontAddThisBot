const express = require('express');
const router = express.Router();

router.post('/api/bot/create/:userid/:username', async (req, res) => {
    const { userid } = req.params;
    const { username } = req.params;
    if (!username || !/^[A-Z_\d]{2,29}$/i.test(username)) {
        return res.status(400).json({
            success: false,
            message: 'malformed username parameter',
        });
    }

    const userDB = await bot.DB.users
        .findOne({
            id: userid,
        })
        .exec();

    if (userDB) {
        return res.status(409).json({
            success: false,
            message: 'User already exist',
        });
    } else {
        try {
            await bot.DB.users.create({
                id: userid,
                username: username,
                firstSeen: new Date(),
                prefix: '|',
                level: 1,
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create user',
            });
        }
    }

    return res.status(200).json({
        success: true,
        message: `User ${userid} created`,
    });
});

module.exports = router;
