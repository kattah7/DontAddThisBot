const got = require('got');
const fetch = require('node-fetch');

module.exports = {
	tags: 'stats',
	name: 'suggest',
	aliases: ['suggestion'],
	cooldown: 5000,
	description: 'Suggestion to the bot',
	execute: async (client, msg) => {
		if (!msg.args[0]) {
			return {
				text: 'Usage: |suggest <suggestion>',
				reply: true,
			};
		}
		let { body: userData } = await got(`https://api.ivr.fi/twitch/resolve/${msg.user.login}`, {
			timeout: 10000,
			throwHttpErrors: false,
			responseType: 'json',
		});

		const pfp = userData.logo;
		const XD = 'https://discord.com/api/webhooks/987635741523869757/MyyRLZ6MV-GSLjuzHEU2JJ5fyWcimcFiT_NGiLRfp-ibv5KpUF2kzHH-kNDgfHfU1leY';
		const KEKW = {
			embeds: [
				{
					color: 0x0099ff,
					title: `Sent by ${msg.user.login} in #${msg.channel.login}`,
					author: {
						name: 'New suggestion',
						icon_url: 'https://i.nuuls.com/nRGtC.png',
					},
					description: `${msg.args.join(' ')}`,
					thumbnail: {
						url: `${pfp}`,
					},
					timestamp: new Date(),
					footer: {
						text: 'Pulled time',
						icon_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/89049925-b020-436f-bf9e-6262c0bc6419-profile_image-600x600.png ',
					},
				},
			],
		};
		fetch(XD + '?wait=true', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(KEKW),
		});

		return {
			text: `Suggestion sent! :)`,
			reply: true,
		};
	},
};
