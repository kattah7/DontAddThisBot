const express = require('express');
const router = express.Router();
const { client } = require('../../../util/twitch/connections');
const { middleWare } = require('../../middleWare');

router.post('/api/bot/join', middleWare, async (req, res) => {
    const { id, login } = req.user;
    if (!login || !/^[A-Z_\d]{2,30}$/i.test(login)) {
        return res.status(400).json({
            success: false,
            message: 'malformed username parameter',
        });
    }

    const userLevel = await bot.DB.users.findOne({ id: id }).exec();
    if (!userLevel || userLevel.level == 0) {
        return res.status(403).json({
            success: false,
            message: 'Forbidden',
        });
    }

    const channelInfo = await bot.DB.channels.findOne({ id: id }).exec();
    if (!channelInfo) {
        const poroInfo = await bot.DB.poroCount.findOne({ id: id }).exec();
        if (poroInfo) {
            await bot.DB.poroCount.findOneAndUpdate({ id: id }, { $inc: { poroCount: 100 } }).exec();
        }

        try {
            await client.join(login);
            await client.say(
                login,
                `Joined channel, ${login} kattahPoro Also check the bot's panels or https://docs.poros.lol for info!`
            );
            await new bot.DB.channels({
                username: login,
                id: id,
                joinedAt: new Date(),
                isChannel: true,
            }).save();
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to join chat.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Joined channel.',
        });
    }

    if (!channelInfo.isChannel) {
        if (channelInfo.username !== login) {
            await bot.DB.channels.findOneAndUpdate({ id: id }, { $set: { username: login } }).exec();
        }

        try {
            await client.join(login);
            await client.say(
                login,
                `Re-Joined channel, ${login} kattahPoro Check the bot's panels or https://docs.poros.lol for info!`
            );
            await bot.DB.channels.findOneAndUpdate({ id: id }, { $set: { isChannel: true } }).exec();
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to join chat.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Re-Joined channel',
        });
    }

    return res.status(409).json({
        success: false,
        message: 'Already joined',
    });
});

module.exports = router;
