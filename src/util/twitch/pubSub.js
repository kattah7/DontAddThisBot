const { twitch } = require('../../../config.json');
const WS = require('ws');
const crypto = require('crypto');
const utils = require('./utils.js');
const RWS = require('reconnecting-websocket');
const { handleWSMsg } = require('./pubSubHandler.js');
const { Logger, LogLevel } = require('../../misc/logger');

exports.topics = [];
exports.connections = [];
let id = 0;

const listen = (channels, subs) => {
	for (const channel of channels) {
		for (const sub of subs) {
			const nonce = crypto.randomBytes(20).toString('hex').slice(-8);

			this.topics.push({ channel, sub, nonce });
		}
	}
};

exports.init = async () => {
	let { rows } = await bot.SQL.query(`SELECT * FROM pubsub_events;`);
	let channels = new Set(rows.map((r) => r.event_channel_id));
	for (const channel of channels) {
		listen([{ id: channel }], ['video-playback-by-id', 'broadcast-settings-update']);
	}
	listen([{ id: '790623318' }], ['chatrooms-user-v1', 'community-points-channel-v1']); // dontaddthisbot
	Logger.log(LogLevel.DEBUG, `PubSub: ${channels.size} streamers`);

	const splitTopics = utils.splitArray(this.topics, 50);
	for (const topics of splitTopics) {
		const ws = new RWS('wss://pubsub-edge.twitch.tv/v1', [], { WebSocket: WS, startClosed: true });
		this.connections.push({ ws, topics });
		connect(ws, topics, ++id);
		await utils.sleep(1000);
	}
};

exports.createListener = (channel, sub, type) => {
	const nonce = crypto.randomBytes(20).toString('hex').slice(-8);
	const c = this.connections.find(({ topics }) => topics.length < 50);

	if (c) {
		const message = {
			data: {
				auth_token: twitch.gql_token,
				topics: [`${sub}.${channel}`],
			},
			nonce: nonce,
			type: type,
		};

		c.ws.send(JSON.stringify(message));
		c.topics.push({ channel, sub, nonce });
	} else {
		const ws = new RWS('wss://pubsub-edge.twitch.tv/v1', [], { WebSocket: WS, startClosed: true });
		const topics = [{ channel, sub, nonce }];
		connect(ws, topics, ++id);
		this.connections.push({ ws, topics });
	}

	this.topics.push({ channel, sub, nonce });
};

const connect = (ws, topics, id) => {
	ws.addEventListener('error', (e) => {
		Logger.log(LogLevel.ERROR, e);
	});

	ws.addEventListener('close', () => {
		Logger.log(LogLevel.WARN, `[${id}] PubSub Disconnected`);
	});

	ws.addEventListener('open', () => {
		Logger.log(LogLevel.DEBUG, `[${id}] PubSub Connected`);

		for (const topic of topics) {
			const message = {
				data: {
					auth_token: twitch.gql_token || twitch.oauth,
					topics: [`${topic.sub}.${topic.channel.id}`],
				},
				nonce: topic.nonce,
				type: 'LISTEN',
			};

			ws.send(JSON.stringify(message));
		}
	});

	ws.addEventListener('message', ({ data }) => {
		const msg = JSON.parse(data);
		let msgData;
		let msgTopic;

		switch (msg.type) {
			case 'PONG':
				break;

			case 'RESPONSE':
				handleWSResp(msg);
				break;

			case 'MESSAGE':
				if (!msg.data) return Logger.log(LogLevel.ERROR, `No data associated with message [${JSON.stringify(msg)}]`);

				msgData = JSON.parse(msg.data.message);
				msgTopic = msg.data.topic;

				handleWSMsg({ channelID: msgTopic.split('.').pop(), ...msgData });
				break;

			case 'RECONNECT':
				Logger.log(LogLevel.WARN, `[${id}] PubSub server sent a reconnect message. Restarting the socket`);
				ws.reconnect();
				break;

			default:
				Logger.log(LogLevel.ERROR, `Unknown PubSub Message Type: ${msg.type}`);
		}
	});

	setInterval(() => {
		ws.send(
			JSON.stringify({
				type: 'PING',
			}),
		);
	}, 250 * 1000);

	ws.reconnect();
};

const handleWSResp = (msg) => {
	if (!msg.nonce) return Logger.log(LogLevel.ERROR, `Unknown message without nonce: ${JSON.stringify(msg)}`);

	const topic = this.topics.find((topic) => topic.nonce === msg.nonce);

	if (msg.error && msg.error !== 'ERR_BADAUTH') {
		// just ignore this shitty error
		this.topics.splice(this.topics.indexOf(topic), 1);
		Logger.log(LogLevel.ERROR, `Error occurred while subscribing to topic ${topic.sub} for channel ${topic.channel.login}: ${msg.error}`);
	}
};
