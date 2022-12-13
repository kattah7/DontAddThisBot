const { getCodeFromName } = require('../util/google/translate.js');

module.exports = {
	tags: 'moderation',
	name: 'language',
	description: 'Usage: |language <language> <text>',
	aliases: ['lang'],
	cooldown: 5000,
	async execute(message, args, client) {
		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		async function updateLanguage(language, userID) {
			await bot.SQL.query(`UPDATE users SET language = '${language}' WHERE twitch_id = '${userID}'`);
		}

		if (!args[0]) {
			return {
				text: 'Usage: |language <language>',
			};
		}

		const language = capitalizeFirstLetter(args[0]);
		const code = getCodeFromName(language);
		if (!code) {
			return {
				text: 'Invalid language',
			};
		}
		if (code === 'en') {
			updateLanguage(null, message.senderUserID);
		} else {
			updateLanguage(code, message.senderUserID);
		}

		return {
			text: `Language set to ${language}`,
		};
	},
};
