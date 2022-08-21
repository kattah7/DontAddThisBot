const express = require('express');
const router = express.Router();
const { client } = require('../../util/connections')
const utils = require('../../util/utils');
const discord = require('../../util/discord')

router.post(`/api/bot/join`, async (req, res) => {
    const { username } = req.query;
    if (!username || !/^[A-Z_\d]{4,25}$/i.test(username)) {
        return res.status(400).json({
            success: false,
            message: "malformed username parameter",
        });
    }
    // Look up their ID
    const id = await utils.IDByLogin(username);

    // Get user from db
    const actualUser = await bot.DB.users.findOne({ id: id }).exec();
    if (actualUser.level == 0) {
        return res.status(403).json({
            success: false,
            message: "Forbidden",
        });
    }

    const poro = await bot.DB.poroCount.findOne({ id: id }).exec();
    const user = await bot.DB.channels.findOne({ id: id }).exec();

    if (!user) {
        // If the user doesn't exist at all, join the channel.
        if (!poro) {
            try {
                await client.join(username);
                await client.say(username, `Joined channel, ${username} kattahSpin Also check @DontAddThisBot panels for info!`);
            } catch (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to join chat.',
                });
            }
    
            // Save to DB
            try {
                await new bot.DB.channels({
                    username: username,
                    id: id,
                    joinedAt: new Date(),
                }).save();
            } catch (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to save to datastore.',
                });
            }
    
            return res.status(200).json({
                success: true,
            });
        } 
        try {
            await client.join(username);
            await client.say(username, `Joined channel, ${username} kattahSpin Also check @DontAddThisBot panels for info!`);
            await bot.DB.poroCount.updateOne({ id: id }, { $set: { poroCount: poro.poroCount + 100 } } ).exec();
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to join chat.',
            });
        }

        // Save to DB
        try {
            await new bot.DB.channels({
                username: username,
                id: id,
                joinedAt: new Date(),
            }).save();
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to save to datastore.',
            });
        }

        await discord.newChannel(username, id, "null", new Date());
        return res.status(200).json({
            success: true,
        });
    }

    // We know a user does exist from this point on.
    if (user.username != username) {
        // If the username has changed for the same ID,
        // the user has changed their username.

        // Part old channel
        try {
            await client.part(user.username);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to part chat.',
            });
        }

        // Join new channel
        try {
            await client.join(username);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to join chat.',
            });
        }

        // Save to DB
        try {
            // Update username
            user.username = username;
            await user.save();
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to save to datastore.',
            });
        }

        return res.status(200).json({
            success: true,
        });
    }

    // A user exists and they are already joined / up to date username
    return res.status(409).json({
        success: false,
        message: 'Already joined',
    });
});

module.exports = router;