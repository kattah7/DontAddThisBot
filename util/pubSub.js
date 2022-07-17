require("dotenv").config();
const WS = require('ws');
const crypto = require('crypto');
const utils = require('./utils.js');
const { client } = require('./connections.js')
const RWS = require('reconnecting-websocket');
const got = require("got");
const axios = require('axios');

exports.topics = [];
exports.connections = [];
let id = 0

const refundPoints = async (channelId, redemptionId) => {
    const { body } = await got.post('https://gql.twitch.tv/gql', {
        throwHttpErrors: false,
        responseType: 'json',
        headers: {
            'Authorization': `OAuth ${process.env.TWITCH_GQL_OAUTH_KEKW}`,
            'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`
        },
        json: {
            "operationName": "UpdateCoPoCustomRewardStatus",
            "variables": {
                "input": {
                    "channelID": channelId,
                    "redemptionID": redemptionId,
                    "newStatus": "CANCELED"
                }
            },
            "extensions": {
                "persistedQuery": {
                    "version": 1,
                    "sha256Hash": "d940a7ebb2e588c3fc0c69a2fb61c5aeb566833f514cf55b9de728082c90361d" // kekw
                }
            }
        }
    })
    return body
}

const cancelRaid = async (channelId) => {
    const { body } = await got.post('https://gql.twitch.tv/gql', {
        throwHttpErrors: false,
        responseType: 'json',
        headers: {
            'Authorization': `OAuth ${process.env.TWITCH_GQL_OAUTH_KEKW}`,
            'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`
        },
        json: {
            "operationName": "CancelRaid",
            "variables": {
                "input": {
                    "sourceID": channelId,
                }
            },
            "extensions": {
                "persistedQuery": {
                    "version": 1,
                    "sha256Hash": "42a2a699ac85256d72fff2471c75803f7ffbc767ba790725de5ad5d6e0163648" // kekw2
                }
            }
        }
    })
    return body
}

const goRaid = async (channelId) => {
    const { body } = await got.post('https://gql.twitch.tv/gql', {
        throwHttpErrors: false,
        responseType: 'json',
        headers: {
            'Authorization': `OAuth ${process.env.TWITCH_GQL_OAUTH_KEKW}`,
            'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`
        },
        json: {
            "operationName": "GoRaid",
            "variables": {
                "input": {
                    "sourceID": channelId,
                }
            },
            "extensions": {
                "persistedQuery": {
                    "version": 1,
                    "sha256Hash": "878ca88bed0c5a5f0687ad07562cffc0bf6a3136f15e5015c0f5f5f7f367f70a" // kekw2
                }
            }
        }
    })
    return body
}

const annouceNoti = async (msg) => {
    const { body } = await got.post('https://gql.twitch.tv/gql', {
        throwHttpErrors: false,
        responseType: 'json',
        headers: {
            'Authorization': `OAuth ${process.env.TWITCH_GQL_OAUTH_KEKW}`,
            'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`
        },
        json: {
            "operationName": "SendAnnouncementMessage",
            "variables": {
                "input": {
                    "channelID": `137199626`,
                    "message": msg,
                    "color": "PRIMARY",
                }
            },
            "extensions": {
                "persistedQuery": {
                    "version": 1,
                    "sha256Hash": "f9e37b572ceaca1475d8d50805ae64d6eb388faf758556b2719f44d64e5ba791"
                }
            }
        }
    })
    return body
}

const listen = (channels, subs) => {
    for (const channel of channels) {
        for (const sub of subs) {
            const nonce = crypto.randomBytes(20).toString('hex').slice(-8);

            this.topics.push({ channel, sub, nonce });
        }
    }
}

exports.init = async () => {
    // Streamers
    const channels = await bot.DB.channels.find({}).exec();
    listen([{ login: 'xqc', id: '71092938' }], ['video-playback-by-id', 'broadcast-settings-update'])
    listen([{ login: 'pokimane', id: '44445592' }], ['video-playback-by-id', 'broadcast-settings-update'])
    listen([{ login: 'kattah', id: '137199626' }], ['video-playback-by-id', 'broadcast-settings-update', 'community-points-channel-v1', 'raid', 'polls'])
    listen([{ login: 'forsen', id: '22484632' }], ['video-playback-by-id', 'broadcast-settings-update'])
    listen([{ login: 'dontaddthisbot', id: '790623318' }], ['chatrooms-user-v1', 'follows', 'following', 'twitch-eventsub-subscription-type'])


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
                console.log(`[${id}] PubSub server sent a reconnect message. Restarting the socket`);
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


const handleWSMsg = async (msg = {}, channel) => {
    if (!msg.type) {
        client.say("dontaddthisbot", `${msg.username} just followed`)
    }
    if (!msg.type) return console.error(`Unknown message without type: ${JSON.stringify(msg)}`);
    

    switch (msg.type) {
         
        case 'stream-up': {
            if (msg.channelID === '71092938') return annouceNoti(`${await utils.loginByID(msg.channelID)} just went live! gn`)
            annouceNoti(`${await utils.loginByID(msg.channelID)} went live!`)
            break;
        }

        case 'stream-down': {
            if (msg.channelID === '71092938') return annouceNoti(`${await utils.loginByID(msg.channelID)} went offline! gm`)
            annouceNoti(`${await utils.loginByID(msg.channelID)} went offline!`)
            break;
        }

        case 'broadcast_settings_update': {
            
            if (msg.game_id !== msg.old_game_id) {
                if (msg.channel === 'xqc' || msg.channel === 'forsen') return annouceNoti(`${msg.channel} changed to new game: ${msg.game} gn`)
                annouceNoti(`${msg.channel} changed to new game: ${msg.game}`)
            }
            
            if (msg.status !== msg.old_status) {
                if (msg.channel === 'xqc' || msg.channel === 'forsen') return annouceNoti(`${msg.channel} changed to new title: ${msg.status} gn`)
                annouceNoti(`${msg.channel} changed to new title: ${msg.status}`)
            }
            break;
        }
        case 'reward-redeemed': {
            const redemption = msg.data.redemption
            if (redemption.channel_id === '137199626' && redemption.reward.title === 'raid') {
                const user = redemption.user_input.split(' ')[0].replace('@', '')
                if (!/^[A-Za-z0-25_]*$/.test(user)) {
                    client.say('kattah', `Invalid Name, Refunding points...`)
                    refundPoints(redemption.channel_id, redemption.id)
                }
                if (user == await utils.loginByID(redemption.channel_id)) {
                    client.say('kattah', `You cannot raid the broadcaster! Refunding points...`)
                    refundPoints(redemption.channel_id, redemption.id)
                } else {
                const { data } = await got(`https://api.twitch.tv/helix/streams?user_login=${user}`, {
                headers: {
                "Client-ID": process.env.CLIENT_ID,
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                },
                }).json();
                console.log(data)
                if (data[0] == undefined) {
                    client.say('kattah', `${user} is not streaming! Refunding points...`)
                    refundPoints(redemption.channel_id, redemption.id)
                } else if (data[0].type == 'live') {
                 
              
                    try {
                        cancelRaid(redemption.channel_id)
                        await client.privmsg("kattah", `.raid ${user}`)
                        client.say('kattah', `${redemption.user.display_name} redeemed raid on ${user} PogBones !!`)
                    } catch (err) {
                        console.error(err)
                        client.say('kattah', `${redemption.user.display_name} FailFish error! refunding points`)
                        refundPoints(redemption.channel_id, redemption.id)
                    }

                
                    }
                }
            }
            if (redemption.channel_id === redemption.channel_id && redemption.reward.title === 'random ban') {
                try {
                    const  c  = await got('http://tmi.twitch.tv/group/user/kattah/chatters').json()
                    var vipsAndViewers = [...c.chatters.vips, ...c.chatters.viewers]
                    var randomChatters = vipsAndViewers[Math.floor(Math.random()* vipsAndViewers.length)]
                    client.timeout(await utils.loginByID(redemption.channel_id), randomChatters, 60, `kekw banned by ${redemption.user.display_name}`)
                    await client.say(await utils.loginByID(redemption.channel_id), "PoroSad redeemed! " + randomChatters + " has been banned for 60 seconds")
                } catch (err) {
                    console.error(err)
                    client.say(await utils.loginByID(redemption.channel_id), `${redemption.user.display_name} FailFish error! refunding points`)
                    refundPoints(redemption.channel_id, redemption.id)
                }
        }
            break;
        }
        case 'user_moderation_action': {
            if (msg.data.action == 'ban') {
                    try {
                        await client.part(await utils.loginByID(msg.data.channel_id))
                        console.log("band")
                    } catch (err) {
                        console.error(err)
                    }
                
            }
            if (msg.data.action == 'unban') {
                    try {
                        await client.join(await utils.loginByID(msg.data.channel_id))
                        await client.say(await utils.loginByID(msg.data.channel_id), `TriHard reconnected!`)
                        console.log("yo")
                    } catch (err) {
                        console.error(err)
                    }
                
            }
            break;
        }
        case 'channel-follow': {
            console.log("yo")
        }
};
};

const handleWSResp = (msg) => {
    if (!msg.nonce) return console.error(`Unknown message without nonce: ${JSON.stringify(msg)}`);

    const topic = this.topics.find(topic => topic.nonce === msg.nonce);

    if (msg.error) {
        this.topics.splice(this.topics.indexOf(topic), 1);
        console.error(`Error occurred while subscribing to topic ${topic.sub} for channel ${topic.channel.login}: ${msg.error}`);
    }
};
