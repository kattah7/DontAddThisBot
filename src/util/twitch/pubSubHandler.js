const { Logger, LogLevel } = require('../../misc/logger');
const { loginByID, IVR } = require('../twitch/utils');
const { client } = require('../twitch/connections');
const { Announce } = require('../../token/helix');
const humanizeDuration = require('../../misc/humanizeDuration.js');
const discord = require('../discord/discord.js');

async function returnListenedStreamers(channelID) {
	const { rows } = await bot.SQL.query(`SELECT * FROM pubsub_events WHERE event_channel_id = '${channelID}';`);
	return rows;
}

async function rewardPoros(userID, Amount) {
	return await bot.DB.poroCount.findOneAndUpdate({ id: userID }, { $inc: { poroCount: Number(Amount) } }).exec();
}

module.exports = {
	handleWSMsg: async (msg = {}) => {
		if (!msg.type) return Logger.log(LogLevel.ERROR, `Unknown message without type: ${JSON.stringify(msg)}`);
		const listenChannels = await returnListenedStreamers(msg.channelID);
		if (!listenChannels) return Logger.log(LogLevel.ERROR, `No listened channels for ${msg.channelID}!`);

		for (const { twitch_id, event_channel_name } of listenChannels) {
			switch (msg.type) {
				case 'stream-up': {
					Announce(twitch_id, `${event_channel_name} went live!`);
					break;
				}
				case 'stream-down': {
					Announce(twitch_id, `${event_channel_name} went offline!`);
					break;
				}
				case 'broadcast_settings_update': {
					if (msg.game_id !== msg.old_game_id) {
						Announce(twitch_id, `${msg.channel} changed to new game: ${msg.game}`);
					}

					if (msg.status !== msg.old_status) {
						Announce(twitch_id, `${msg.channel} changed to new title: ${msg.status}`);
					}
					break;
				}
			}
		}

		switch (msg.type) {
			case 'user_moderation_action': {
				const { channel_id, action, expires_in_ms } = msg.data;
				const userLevel = await bot.DB.users.findOne({ id: channel_id });
				if (userLevel.level < 1) return;
				const inData = await bot.DB.channels.findOne({ id: channel_id });
				if (!inData) return;
				const user = await loginByID(channel_id);
				const { logo } = await IVR(channel_id);

				if (action == 'timeout') {
					await client.part(user);
				} else if (action == 'ban') {
					client.part(user);
					await bot.DB.channels.updateOne({ id: channel_id }, { isChannel: false }).catch((err) => Logger.log(LogLevel.ERROR, err));
				} else if (action == 'untimeout') {
					await client.join(user);
				} else if (action == 'unban') {
					await client.join(user);
					await bot.DB.channels.updateOne({ id: channel_id }, { isChannel: true }).catch((err) => Logger.log(LogLevel.ERROR, err));
				}

				const duration = expires_in_ms ? `Duration: ${humanizeDuration(expires_in_ms)}` : `Duration: false`;
				const color = action == 'timeout' || action == 'ban' ? 15548997 : 5763719;
				await discord.BAND(user, action.toUpperCase(), duration, color, logo);
				break;
			}

			case 'reward-redeemed': {
				const { user, reward } = msg.data.redemption;
				if (reward.title === 'Free 100 Poros') {
					await rewardPoros(user.id, 100).then(async (res) => {
						if (!res || res === null) {
							await client.say('dontaddthisbot', "You aren't registered! type |poro to get started");
							return;
						}

						await client.say('dontaddthisbot', `Thank you for redeeming 100 poros kattahPoro You have ${res.poroCount + 100} poros`);
						return;
					});
				} else if (reward.title === 'Free 1000 Poros') {
					await rewardPoros(user.id, 1000).then(async (res) => {
						if (!res || res === null) {
							await client.say('dontaddthisbot', "You aren't registered! type |poro to get started");
							return;
						}

						await client.say('dontaddthisbot', `Thank you for redeeming 1000 poros kattahPoro You have ${res.poroCount + 1000} poros`);
						return;
					});
				}
				break;
			}
		}
	},
};
