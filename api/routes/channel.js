const express = require('express');
const router = express.Router();
const { client } = require('../../util/connections')
const utils = require('../../util/utils');

router.get(`/addbot/${process.env.API_PASSWORD}/:user`, async (req, res) => {
    if (!req.params.user) {
        return res.status(400).send('No user specified');
    }
    const channelData = await bot.DB.channels.findOne({ id: await utils.IDByLogin(req.params.user) }).exec();
    if (channelData) {
        res.json({
            Error: "Already in channel"
        })
    } else {
        try {
            await client.join(req.params.user)
            const newChannel = new bot.DB.channels({
                username: req.params.user,
                id: await utils.IDByLogin(req.params.user),
                joinedAt: new Date()
            });
            await newChannel.save();
            res.json({
                Success: `Joined channel, ${req.params.user}`
            })
        } catch (err) {
            console.log(err);
            return res.status(500).send('Failed to join channel');
        }
    }
});

router.get(`/partbot/${process.env.API_PASSWORD}/:user`, async (req, res) => {
    if (!req.params.user) {
        return res.status(400).send('No user specified');
    }
    const channelData = await bot.DB.channels.findOne({ id: await utils.IDByLogin(req.params.user) }).exec();
    if (!channelData) {
        res.json({
            Error: "Not in channel"
        })
    } else {
        try {
            await client.part(req.params.user)
            await bot.DB.channels.findOneAndDelete({ id: await utils.IDByLogin(req.params.user) }).exec();
            res.json({
                Success: `Parting channel, ${req.params.user}`
            })
        } catch (err) {
            console.log(err);
            return res.status(500).send('Failed to part channel');
        }
    }
});

module.exports = router;
