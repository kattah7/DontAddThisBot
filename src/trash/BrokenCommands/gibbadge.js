const got = require('got');

module.exports = {
	name: 'addbadge',
	description: "add bot's badge with 50 poro meat",
	cooldown: 3000,
	aliases: ['setbadge'],
	async execute(message, args, client) {
		const input = args[0];
		const availableBadges = ['glhf-pledge', 'no_audio', 'premium', 'no_video'];
		const channelData = await bot.DB.poroCount.findOne({ username: message.senderUsername }).exec();
		if (channelData.poroCount < 50) {
			if (message.senderUsername == process.env.NUMBER_ONE) {
				client.privmsg(message.channelName, `.me Not enough poro meat! ${message.senderUsername} kattahHappy You need 50 poro meat | ${channelData.poroCount} meat total! 🥩`);
			} else {
				return {
					text: `Not enough poro meat! ${message.senderUsername} kattahHappy You need 50 poro meat | ${channelData.poroCount} meat total! 🥩`,
				};
			}
		} else if (!availableBadges.includes(input.toLowerCase())) {
			if (message.senderUsername == process.env.NUMBER_ONE) {
				client.privmsg(message.channelName, `.me ${args[0]} is a invalid badge. PoroSad (Badges: glhf-pledge, no_audio, no_video, premium)`);
			} else {
				return {
					text: `${args[0]} is a invalid badge. PoroSad (Badges: glhf-pledge, no_audio, no_video, premium)`,
				};
			}
		} else {
			await bot.DB.poroCount
				.updateOne(
					{ username: message.senderUsername },
					{
						$set: {
							poroCount: channelData.poroCount - 50,
						},
					},
				)
				.exec();
			const query = [];
			query.push({
				operationName: 'ChatSettings_SelectGlobalBadge',
				variables: {
					input: {
						badgeSetID: `${args[0]}`,
						badgeSetVersion: '1',
					},
				},
				extensions: {
					persistedQuery: {
						version: 1,
						sha256Hash: '5e1b7f0ba771ca8eb81c0fcd5b8f4ff559ec2dc71cc9256e04ec2665049fc4e5',
					},
				},
			});

			got.post('https://gql.twitch.tv/gql', {
				throwHttpErrors: false,
				responseType: 'json',
				headers: {
					Authorization: `OAuth ${process.env.TWITCH_GQL_OAUTH_KEKW}`,
					'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`,
				},
				json: query,
			});
			if (message.senderUsername == process.env.NUMBER_ONE) {
				client.privmsg(message.channelName, `.me Badge ${args[0]} Added! PoroSad ${channelData.poroCount - 50} meat total! 🥩`);
			} else {
				return {
					text: `Badge ${args[0]} Added! PoroSad ${channelData.poroCount - 50} meat total! 🥩`,
				};
			}
		}
	},
};
