const express = require('express');
const router = express.Router();
const { client } = require('../../../util/connections');
const utils = require('../../../util/utils');

router.post(`/api/bot/part`, async (req, res) => {
    const { username } = req.query;
    if (!username || !/^[A-Z_\d]{2,30}$/i.test(username)) {
        return res.status(400).json({
            success: false,
            message: 'malformed username parameter',
        });
    }
    // Look up their ID
    const id = await utils.IDByLogin(username);

    // Get user from db
    const actualUser = await bot.DB.users.findOne({ id: id }).exec();
    if (actualUser.level == 0) {
        return res.status(403).json({
            success: false,
            message: 'Forbidden',
        });
    }

    const user = await bot.DB.channels.findOne({ id: id }).exec();
    const poro = await bot.DB.poroCount.findOne({ id: id }).exec();
    if (user) {
        // If the user doesn't exist at all, join the channel.
        if (!poro) {
            try {
                await client.part(username);
            } catch (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to part chat.',
                });
            }

            // Save to DB
            try {
                await client.say(username, `Parting ${username} 👋`);
                await bot.DB.channels.findOneAndUpdate({ id: id }, { $set: { isChannel: false } }).exec();
            } catch (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to delete to datastore.',
                });
            }

            return res.status(200).json({
                success: true,
            });
        }

        try {
            await client.part(username);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to part chat.',
            });
        }

        // Save to DB
        try {
            await client.say(username, `Parting ${username} 👋`);
            await bot.DB.channels.findOneAndUpdate({ id: id }, { $set: { isChannel: false } }).exec();
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete to datastore.',
            });
        }

        return res.status(200).json({
            success: true,
        });
    }

    // A user exists and they are already joined / up to date username
    return res.status(409).json({
        success: false,
        message: 'Already parted',
    });
});

module.exports = router;
