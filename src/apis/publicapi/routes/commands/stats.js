const express = require('express');
const router = express.Router();
const { readdirSync } = require('fs');

router.get('/api/bot/commands/stats', (req, res) => {
    let commands = [];
    for (let file of readdirSync('./src/commands').filter((file) => file.endsWith('.js'))) {
        let command = require(`../../../../commands/${file}`);
        const { tags, name, aliases, cooldown, description } = command;
        if (tags == 'stats') {
            commands.push({
                name: name,
                aliases: aliases ?? null,
                cooldown: cooldown ?? null,
                description: description ?? null,
            });
        }
    }

    return res.status(200).json({ success: true, commands: commands });
});

module.exports = router;
