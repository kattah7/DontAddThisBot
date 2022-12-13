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

		await bot.SQL.query(`UPDATE users SET language = '${code}' WHERE twitch_id = '${message.senderUserID}'`);
		return {
			text: `Language set to ${language}`,
		};
	},
};
