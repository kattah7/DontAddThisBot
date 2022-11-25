const express = require('express');
const router = express.Router();

router.post('/api/bot/checkadmin', async (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res.status(404).json({
            success: false,
            message: 'malformed id parameter',
        });
    }
    const user = await bot.DB.users.findOne({ id: id }).exec();
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'user not found',
        });
    }

    return res.status(200).json({
        success: true,
        isAdmin: user.level > 1,
    });
});

module.exports = router;
