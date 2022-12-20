const { getCodeFromName } = require('../util/google/translate.js');

module.exports = {
	tags: 'moderation',
	name: 'language',
	description: 'Usage: |language <language> <text>',
	aliases: ['lang'],
	cooldown: 5000,
	async execute(client, msg) {
		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		async function updateLanguage(language, userID) {
			await bot.SQL.query(`UPDATE users SET language = '${language}' WHERE twitch_id = '${userID}'`);
		}

		if (!msg.args[0]) {
			return {
				text: 'Usage: |language <language>',
				reply: false,
			};
		}

		const language = capitalizeFirstLetter(msg.args[0]);
		let code = getCodeFromName(language);

		if (!code && language === 'Random') {
			code = 'random';
		}

		if (!code) {
			return {
				text: 'Invalid language',
				reply: true,
			};
		}

		if (code === 'en') {
			updateLanguage(null, msg.user.id);
		} else {
			updateLanguage(code, msg.user.id);
		}

		return {
			text: `Language set to ${language}`,
			reply: true,
		};
	},
};
