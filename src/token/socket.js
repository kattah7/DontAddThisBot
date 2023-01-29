const WS = require('ws');
const RWS = require('reconnecting-websocket');
const { Logger, LogLevel } = require('../misc/logger');
const { client } = require('../util/twitch/connections.js');

async function SocketConnection(port) {
	const ws = new RWS(`ws://localhost:${port}`, [], {
		WebSocket: WS,
		startedClosed: true,
	});

	ws.onopen = () => {
		console.log('Socket connection opened');
	};

	ws.onclose = () => {
		console.log('Socket connection closed');
	};

	ws.onmessage = async (message) => {
		const { channelName, channelID } = JSON.parse(message.data);
		if (channelName || channelID) {
			const findUser = await bot.DB.users.findOne({ id: channelID }).exec();
			if (!findUser || findUser === null) {
				Logger.log(LogLevel.DEBUG, `User ${channelName} is not in database... adding!`);
				await bot.DB.users.create({
					id: channelID,
					username: channelName,
					firstSeen: new Date(),
					level: 0,
				});
			} else if (findUser?.level > 0) {
				Logger.log(LogLevel.DEBUG, `User ${channelName} is already in database but not level 0, setting to level 0...`);
				await bot.DB.findOneAndUpdate({ id: channelID }, { $set: { level: 0 } }).exec();
			}

			const findChannel = await bot.DB.channels.findOne({ id: channelID }).exec();
			if (findChannel) {
				try {
					await bot.DB.channels.findOneAndUpdate({ id: channelID }, { $set: { isChannel: false } }).exec();
					await client.part(channelName);
					Logger.log(LogLevel.DEBUG, `${channelName} Channel has bot added... Setting to false and parting...`);
				} catch (err) {
					Logger.log(LogLevel.ERROR, `Error setting channel to false and parting..., ${String(err)}`);
				}
			}

			const findBans = await bot.DB.bans.findOne({ id: channelID }).exec();
			if (!findBans || findBans === null) {
				Logger.log(LogLevel.DEBUG, `User ${channelName} is not in database of BANS... adding!`);
				await bot.DB.bans.create({
					id: channelID,
					username: channelName,
					bannedDate: new Date(),
					type: 'ban',
				});
			}
		}
	};
}

module.exports = { SocketConnection };
