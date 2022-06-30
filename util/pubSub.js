require("dotenv").config();
const WS = require('ws');
const crypto = require('crypto');
const utils = require('./utils.js');
const { client } = require('../main.js')
const RWS = require('reconnecting-websocket');

exports.topics = [];
exports.connections = [];
let id = 0

const listen = (channels, subs) => {
    for (const channel of channels) {
        for (const sub of subs) {
            const nonce = crypto.randomBytes(20).toString('hex').slice(-8);

            this.topics.push({ channel, sub, nonce });
        }
    }
}

exports.init = async () => {
    // xQc
    listen([{ login: 'xqc', id: '71092938' }], ['video-playback-by-id', 'broadcast-settings-update'])

    const splitTopics = utils.splitArray(this.topics, 50)

    for (const topics of splitTopics) {
        const ws = new RWS('wss://pubsub-edge.twitch.tv/v1', [], { WebSocket: WS, startClosed: true });
        this.connections.push({ ws, topics })
        connect(ws, topics, ++id)
        await utils.sleep(1000)
    }
}

exports.createListener = (channel, sub) => {
    const nonce = crypto.randomBytes(20).toString('hex').slice(-8);
    const c = this.connections.find(({ topics }) => topics.length < 50)

    if (c) {
        const message = {
            'data': {
                'auth_token': process.env.TWITCH_OAUTH,
                'topics': [`${sub}.${channel.id}`]
            },
            'nonce': nonce,
            'type': 'LISTEN',
        };

        c.ws.send(JSON.stringify(message))
        c.topics.push({ channel, sub, nonce })
    } else {
        const ws = new RWS('wss://pubsub-edge.twitch.tv/v1', [], { WebSocket: WS, startClosed: true });
        const topics = [{ channel, sub, nonce }]
        connect(ws, topics, ++id)
        this.connections.push({ ws, topics })
    }

    this.topics.push({ channel, sub, nonce });
}

const connect = (ws, topics, id) => {
    ws.addEventListener('error', (e) => {
        console.error(e)
    });

    ws.addEventListener('close', () => {
        console.log(`[${id}] PubSub Disconnected`)
    });

    ws.addEventListener('open', () => {
        console.log(`[${id}] PubSub Connected`);

        for (const topic of topics) {
            const message = {
                'data': {
                    'auth_token': process.env.TWITCH_GQL_OAUTH_KEKW  || process.env.TWITCH_OAUTH,
                    'topics': [`${topic.sub}.${topic.channel.id}`]
                },
                'nonce': topic.nonce,
                'type': 'LISTEN',
            };

            ws.send(JSON.stringify(message))
        }
    });

    ws.addEventListener('message', ({ data }) => {
        const msg = JSON.parse(data);
        switch (msg.type) {
            case 'PONG':
                break;

            case 'RESPONSE':
                handleWSResp(msg);
                break;

            case 'MESSAGE':
                if (!msg.data) return console.error(`No data associated with message [${JSON.stringify(msg)}]`);

                const msgData = JSON.parse(msg.data.message);
                const msgTopic = msg.data.topic;

                handleWSMsg({ channelID: msgTopic.split('.').pop(), ...msgData })
                break;

            case 'RECONNECT':
                console.log(`[${id}] PubSub server sent a reconnect message. restarting the socket`);
                ws.reconnect();
                break;

            default:
                console.error(`Unknown PubSub Message Type: ${msg.type}`);
        }
    });

    setInterval(() => {
        ws.send(JSON.stringify({
            type: 'PING',
        }));
    }, 250 * 1000);

    ws.reconnect();
};

const handleWSMsg = async (msg = {}) => {
    if (!msg.type) return console.error(`Unknown message without type: ${JSON.stringify(msg)}`);

    switch (msg.type) {
        case 'stream-up': {
            client.say('kattah', `${msg.channel} went live!`)
            break;
        }

        case 'stream-down': {
            client.say('kattah', `${msg.channel} went offline!`)
            break;
        }

        case 'broadcast_settings_update': {
            if (msg.game_id !== msg.old_game_id) {
                client.say('kattah', `${msg.channel} changed to new game: ${msg.game}`)
            }

            if (msg.status !== msg.old_status) client.say('kattah', `${msg.channel} changed to new title: ${msg.status}`)
            break;
        }
    }
};

const handleWSResp = (msg) => {
    if (!msg.nonce) return console.error(`Unknown message without nonce: ${JSON.stringify(msg)}`);

    const topic = this.topics.find(topic => topic.nonce === msg.nonce);

    if (msg.error && msg.error !== 'ERR_BADAUTH') {
        this.topics.splice(this.topics.indexOf(topic), 1);
        console.error(`Error occurred while subscribing to topic ${topic.sub} for channel ${topic.channel.login}: ${msg.error}`);
    }
};