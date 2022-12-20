const utils = require('../util/twitch/utils.js');
const { ChangeColor } = require('../token/helix');
const fs = require('fs/promises');

module.exports = {
	tags: 'poro',
	name: `changecolor`,
	cooldown: 5000,
	aliases: ['changecolour', 'setcolor', 'setcolour'],
	description: 'Change the bot color with 50 poro meat',
	poroRequire: true,
	execute: async (client, msg) => {
		const displayPoroRankByName = {
			1: 'Raw',
			2: 'Rare',
			3: 'Medium Rare',
			4: 'Medium',
			5: 'Medium Well',
			6: 'Well Done',
			7: 'Cooked',
		};

		if (!msg.args[0]) {
			return {
				text: `Please insert a color! kattahDance`,
			};
		}

		var reg = /^#[0-9A-F]{6}$/i;
		if (!reg.test(msg.args[0])) {
			return {
				text: `Please insert a valid color! kattahDance`,
			};
		}

		const color = await utils.IVR(`790623318`);
		if (color.chatColor == msg.args[0]) {
			return {
				text: `That color is already being used! kattahDance`,
			};
		}

		const { id: senderUserID, login: senderUsername } = msg.user;
		const { login: channelName } = msg.channel;
		const channelData = await bot.DB.poroCount.findOne({ id: senderUserID }).exec();
		const { poroCount, poroPrestige, poroRank } = channelData;
		if (channelData.poroCount < 50) {
			return {
				text: `Not enough poro meat! ${senderUsername} PoroSad You need 50 poro meat | [P${poroPrestige}: ${displayPoroRankByName[poroRank]}] ${poroCount} meat total! 🥩`,
				reply: false,
			};
		} else {
			await bot.DB.poroCount.updateOne({ id: senderUserID }, { $set: { poroCount: poroCount - 50 } }).exec();
			await ChangeColor(msg.args[0]);
			await client.say(channelName, `Color changed to ${msg.args[0]}! PoroSad [P${poroPrestige}: ${displayPoroRankByName[poroRank]}] ${poroCount - 50} meat total! 🥩`);
			var botColor = {
				color: msg.args[0],
			};
			await fs.writeFile('src/util/twitch/botcolor.json', JSON.stringify(botColor) + '\n', 'utf8');
		}
	},
};
