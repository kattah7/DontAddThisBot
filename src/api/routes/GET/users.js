const express = require('express');
const router = express.Router();
const utils = require('../../../util/twitch/utils');

router.get('/api/bot/users/:user', async (req, res) => {
    const { user } = req.params;
    if (!user || !/^[A-Z_\d]{2,30}$/i.test(user)) {
        return res.status(400).json({
            success: false,
            message: 'malformed username parameter',
        });
    }

    const userInfo = await bot.DB.users.findOne({ id: await utils.IDByLogin(user) }).exec();
    if (!userInfo) {
        return res.status(404).json({
            success: false,
            message: 'user not found',
        });
    }

    const mapped = userInfo.nameChanges.map(({ username, changedAt }) => ({ username, changedAt }));
    const commandsUsed = await bot.SQL.query(`SELECT * FROM commands WHERE twitch_id = '${userInfo.id}';`);
    const commandsMapped = commandsUsed.rows.map(({ command, command_usage, last_used }) => ({
        command,
        command_usage,
        last_used,
    }));
    console.log(commandsUsed.rows);
    return res.status(200).json({
        success: true,
        username: userInfo.username,
        id: userInfo.id,
        level: userInfo.level,
        firstSeen: userInfo.firstSeen,
        nameChanges: mapped,
        commands: commandsMapped,
    });
});

module.exports = router;
