const { ParseUser, IDByLogin } = require('../util/twitch/utils');
const { createListener } = require('../util/twitch/pubSub');

async function returnEvents(twitchID) {
	return await bot.SQL.query(`SELECT * FROM pubsub_events WHERE twitch_id = '${twitchID}';`);
}

async function insertEvent(twitchID, twitchLogin, eventChannelID, eventChannelName, eventType) {
	const { rows } = await returnEvents(twitchID);
	if (rows.length < 5) {
		await bot.SQL.query(
			`INSERT INTO pubsub_events (twitch_id, twitch_login, event_channel_id, event_channel_name, event_type) VALUES ('${twitchID}', '${twitchLogin}', '${eventChannelID}', '${eventChannelName}', '${eventType}');`,
		);

		for (const event of JSON.parse(eventType)) {
			createListener(eventChannelID, event, 'LISTEN');
		}
		return {
			success: true,
		};
	} else {
		return {
			text: `You can only listen to 5 channels`,
			success: false,
		};
	}
}

async function removeListen(twitchID, eventChannelID) {
	await bot.SQL.query(`DELETE FROM pubsub_events WHERE twitch_id = '${twitchID}' AND event_channel_id = '${eventChannelID}';`);
	return {
		success: true,
	};
}

module.exports = {
	tags: 'moderation',
	name: 'listen',
	description: 'Listen to pubsub events',
	cooldown: 3000,
	aliases: ['unlisten'],
	botPerms: 'mod',
	permission: 1,
	execute: async (client, msg) => {
		if (!msg.args[0]) {
			return {
				text: `Please provide a channel name`,
				reply: true,
			};
		}

		const targetChannel = ParseUser(msg.args[0]);
		const targetChannelID = await IDByLogin(targetChannel);
		if (!targetChannelID || targetChannelID === null) {
			return {
				text: `Channel not found`,
				reply: true,
			};
		}

		const { rows } = await returnEvents(msg.channel.id);
		const Events = JSON.stringify(['video-playback-by-id', 'broadcast-settings-update']);
		let eventChannels = [];
		for (let i = 0; i < rows.length; i++) {
			eventChannels.push(rows[i].event_channel_id);
		}

		if (msg.command === 'listen') {
			if (eventChannels.includes(targetChannelID))
				return {
					text: `Already listening to ${targetChannel}`,
					reply: true,
				};

			const { success, text } = await insertEvent(msg.channel.id, msg.channel.login, targetChannelID, targetChannel, Events);
			return {
				text: success ? `Now listening to ${targetChannel}` : text,
				reply: true,
			};
		} else if (msg.command === 'unlisten') {
			if (!eventChannels.includes(targetChannelID))
				return {
					text: `Not listening to ${targetChannel}`,
					reply: true,
				};

			const { success } = await removeListen(msg.channel.id, targetChannelID);
			return {
				text: success ? `No longer listening to ${targetChannel}` : `Something went wrong`,
				reply: true,
			};
		}
	},
};
