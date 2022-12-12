const express = require('express');
const router = express.Router();
const { readdirSync } = require('fs');

router.get('/api/bot/commands', async (req, res) => {
	let stvCommands = [];
	let moderationCommands = [];
	let poroCommands = [];
	let statsCommands = [];
	for (let file of readdirSync('./src/commands').filter((file) => file.endsWith('.js'))) {
		let pull = require(`../../../commands/${file}`);
		const { tags, name, aliases, cooldown, description, permission, botPerms, stv } = pull;
		if (tags == '7tv') {
			stvCommands.push({
				name: name,
				aliases: aliases ?? null,
				cooldown: cooldown ?? null,
				description: description ?? null,
				permission: permission ?? null,
				botPerms: botPerms ?? null,
				requireEditor: stv ? true : false,
			});
		} else if (tags == 'moderation') {
			moderationCommands.push({
				name: name,
				aliases: aliases ?? null,
				cooldown: cooldown ?? null,
				description: description ?? null,
				permission: permission ?? null,
				botPerms: botPerms ?? null,
			});
		} else if (tags == 'poro') {
			poroCommands.push({
				name: name,
				aliases: aliases ?? null,
				cooldown: cooldown ?? null,
				description: description ?? null,
			});
		} else if (tags == 'stats') {
			statsCommands.push({
				name: name,
				aliases: aliases ?? null,
				cooldown: cooldown ?? null,
				description: description ?? null,
			});
		}
	}
	return res.status(200).json({
		success: true,
		commands: { stv: stvCommands, mods: moderationCommands, poro: poroCommands, stats: statsCommands },
	});
});

module.exports = router;
