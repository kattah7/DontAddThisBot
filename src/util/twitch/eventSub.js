const RWS = require('reconnecting-websocket');
const WS = new RWS('wss://eventsub-beta.wss.twitch.tv/ws', [], {
	WebSocket: require('ws'),
	startedClosed: true,
});
const fetch = require('node-fetch');
const Logger = require('../logger');
const eventSubEvents = require('./eventSubEvents');

WS.onopen = () => {
	Logger.info('Connected to Twitch EventSub');
};

WS.onmessage = async ({ data }) => {
	const parsed = JSON.parse(data);
	const { payload, metadata } = parsed;
	if (payload.session?.status == 'connected') {
		const { data } = await getEventSubs();
		if (data?.length == 0) {
			const testIDS = ['148554088', '206378648'];
			for (const id of testIDS) {
				await createEventSub('channel.follow', id, payload.session.id).then((response) => {
					if (response?.error) return Logger.error(`Error creating EventSub: ${response?.message}`);
					response?.data.forEach((sub) => {
						const { id, status, type, version, condition, transport } = sub;
						Logger.info(`Created EventSub: ${type} for ${condition.broadcaster_user_id}`);
					});
				});
			}
		} else {
			Logger.warn(`EventSubs already exist: ${data.map((sub) => `${sub.type} | ${sub.condition.broadcaster_user_id}`).join(', ')}`);
			for (const topic of data) {
				await deleteEventSub(topic.id);
				Logger.info(`Deleted EventSub: ${topic.id}`);
			}
		}
	}

	if (payload.event) {
		const { type, condition, transport, id, status } = payload.subscription;
		handleWSMsg(payload.event, condition.broadcaster_user_id, type, id, status, transport.session_id);
	}
};

const handleWSMsg = (msg = {}, channel, type, id, status, session_id) => {
	const event = eventSubEvents[type];
	if (event) event(msg, type, channel, id, status, session_id);
};

const createEventSub = async (type, userID, session_id) => {
	const createTopic = await fetch(`https://api.twitch.tv/helix/eventsub/subscriptions`, {
		method: 'POST',
		headers: {
			'Client-ID': process.env.CLIENT_ID,
			Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			type: type,
			version: '1',
			condition: {
				broadcaster_user_id: userID,
			},
			transport: {
				method: 'websocket',
				session_id: session_id,
			},
		}),
	}).then(
		(res) => res.json(),
		(err) => Logger.error(err),
	);
	return createTopic;
};

const deleteEventSub = async (id = '') => {
	fetch('https://api.twitch.tv/helix/eventsub/subscriptions?id=' + id, {
		method: 'DELETE',
		headers: {
			'Client-ID': process.env.CLIENT_ID,
			Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
			'Content-Type': 'application/json',
		},
	});
};

const getEventSubs = async () => {
	const getTopics = await fetch(`https://api.twitch.tv/helix/eventsub/subscriptions`, {
		method: 'GET',
		headers: {
			'Client-ID': process.env.CLIENT_ID,
			Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
			'Content-Type': 'application/json',
		},
	}).then(
		(res) => res.json(),
		(err) => Logger.error(err),
	);
	return getTopics;
};

module.exports = {
	createEventSub,
	deleteEventSub,
	getEventSubs,
};
