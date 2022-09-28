const express = require('express');
const router = express.Router();
const { readdirSync } = require('fs');

router.get('/api/bot/commands/moderation', async (req, res) => {
    let commands = [];
    for (let file of readdirSync('./src/commands').filter((file) => file.endsWith('.js'))) {
        let pull = require(`../../../commands/${file}`);
        const { tags, name, aliases, cooldown, description, permission, botPerms } = pull;
        if (tags == 'moderation') {
            commands.push({
                name: name,
                aliases: aliases ?? null,
                cooldown: cooldown ?? null,
                description: description ?? null,
                permission: permission ?? null,
                botPerms: botPerms ?? null,
            });
        }
    }
    return res.status(200).json({ success: true, commands });
});

module.exports = router;
