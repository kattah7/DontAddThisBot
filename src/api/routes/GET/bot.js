const express = require('express');
const router = express.Router();

router.get('/api/bot/info', async (req, res) => {
    const botInfo = await bot.SQL.query(`SELECT * FROM channels;`);
    let mods = 0;
    let vips = 0;

    for (const { is_mod, is_vip } of botInfo.rows) {
        if (is_mod) {
            mods++;
        }
        if (is_vip) {
            vips++;
        }
    }

    return res.status(200).json({
        success: true,
        data: {
            channels_with_roles: botInfo.rows.length,
            mods: mods,
            vips: vips,
        },
    });
});

module.exports = router;
