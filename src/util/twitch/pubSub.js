require('dotenv').config();
const WS = require('ws');
const crypto = require('crypto');
const utils = require('./utils.js');
const { client } = require('./connections.js');
const RWS = require('reconnecting-websocket');
const got = require('got');
const discord = require('../discord.js');
const humanizeDuration = require('../humanizeDuration.js');
const { GetStreams, Announce } = require('../../token/helix');

exports.topics = [];
exports.connections = [];
let id = 0;

const refundPoints = async (channelId, redemptionId) => {
    const { body } = await got.post('https://gql.twitch.tv/gql', {
        throwHttpErrors: false,
        responseType: 'json',
        headers: {
            'Authorization': `OAuth ${process.env.TWITCH_GQL_TOKEN}`,
            'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`,
        },
        json: {
            operationName: 'UpdateCoPoCustomRewardStatus',
            variables: {
                input: {
                    channelID: channelId,
                    redemptionID: redemptionId,
                    newStatus: 'CANCELED',
                },
            },
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash: 'd940a7ebb2e588c3fc0c69a2fb61c5aeb566833f514cf55b9de728082c90361d', // kekw
                },
            },
        },
    });
    return body;
};

const cancelRaid = async (channelId) => {
    const { body } = await got.post('https://gql.twitch.tv/gql', {
        throwHttpErrors: false,
        responseType: 'json',
        headers: {
            'Authorization': `OAuth ${process.env.TWITCH_GQL_TOKEN}`,
            'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`,
        },
        json: {
            operationName: 'CancelRaid',
            variables: {
                input: {
                    sourceID: channelId,
                },
            },
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash: '42a2a699ac85256d72fff2471c75803f7ffbc767ba790725de5ad5d6e0163648', // kekw2
                },
            },
        },
    });
    return body;
};

const listen = (channels, subs) => {
    for (const channel of channels) {
        for (const sub of subs) {
            const nonce = crypto.randomBytes(20).toString('hex').slice(-8);

            this.topics.push({ channel, sub, nonce });
        }
    }
};

exports.init = async () => {
    // Streamers
    listen([{ login: 'xqc', id: '71092938' }], ['video-playback-by-id', 'broadcast-settings-update']);
    listen([{ login: 'tommyinnit', id: '116228390' }], ['video-playback-by-id', 'broadcast-settings-update']);
    listen([{ login: 'georgy177', id: '135075027' }], ['video-playback-by-id', 'broadcast-settings-update']);
    listen([{ login: 'pokimane', id: '44445592' }], ['video-playback-by-id', 'broadcast-settings-update']);
    listen(
        [{ login: 'kattah', id: '137199626' }],
        ['video-playback-by-id', 'broadcast-settings-update', 'community-points-channel-v1', 'raid', 'polls']
    );
    listen([{ login: 'forsen', id: '22484632' }], ['video-playback-by-id', 'broadcast-settings-update']);
    listen([{ id: '790623318' }], ['chatrooms-user-v1', 'follows', 'following']); // dontaddthisbot

    const splitTopics = utils.splitArray(this.topics, 50);

    for (const topics of splitTopics) {
        const ws = new RWS('wss://pubsub-edge.twitch.tv/v1', [], { WebSocket: WS, startClosed: true });
        this.connections.push({ ws, topics });
        connect(ws, topics, ++id);
        await utils.sleep(1000);
    }
};

exports.createListener = (channel, sub) => {
    const nonce = crypto.randomBytes(20).toString('hex').slice(-8);
    const c = this.connections.find(({ topics }) => topics.length < 50);

    if (c) {
        const message = {
            data: {
                auth_token: process.env.TWITCH_GQL_TOKEN,
                topics: [`${sub}.${channel}`],
            },
            nonce: nonce,
            type: 'LISTEN',
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
        Logger.error(e);
    });

    ws.addEventListener('close', () => {
        Logger.info(`[${id}] PubSub Disconnected`);
    });

    ws.addEventListener('open', () => {
        Logger.info(`[${id}] PubSub Connected`);

        for (const topic of topics) {
            const message = {
                data: {
                    auth_token: process.env.TWITCH_GQL_TOKEN || process.env.TWITCH_OAUTH,
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
        switch (msg.type) {
            case 'PONG':
                break;

            case 'RESPONSE':
                handleWSResp(msg);
                break;

            case 'MESSAGE':
                if (!msg.data) return Logger.error(`No data associated with message [${JSON.stringify(msg)}]`);

                const msgData = JSON.parse(msg.data.message);
                const msgTopic = msg.data.topic;

                handleWSMsg({ channelID: msgTopic.split('.').pop(), ...msgData });
                break;

            case 'RECONNECT':
                Logger.info(`[${id}] PubSub server sent a reconnect message. Restarting the socket`);
                ws.reconnect();
                break;

            default:
                Logger.error(`Unknown PubSub Message Type: ${msg.type}`);
        }
    });

    setInterval(() => {
        ws.send(
            JSON.stringify({
                type: 'PING',
            })
        );
    }, 250 * 1000);

    ws.reconnect();
};

const handleWSMsg = async (msg = {}, channel) => {
    if (!msg.type) {
        const lastUsage = await bot.Redis.get(`porofollow:${await utils.IDByLogin(msg.username)}`);
        const channelData = await bot.DB.poroCount.findOne({ id: await utils.IDByLogin(msg.username) }).exec();
        if (!channelData) {
            client.say('dontaddthisbot', `${msg.username}, You aren't registered! type |poro to get started!`);
        }
        if (!lastUsage) {
            await bot.Redis.set(`porofollow:${await utils.IDByLogin(msg.username)}`, Date.now(), 0);
        }
        if (lastUsage || channelData) {
            if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 60 * 60 * 60) {
                await client.say('dontaddthisbot', `nice try`);
            }
        }

        if (new Date().getTime() - new Date(lastUsage).getTime() > 1000 * 60 * 60 * 60 * 60 * 60) {
            await bot.DB.poroCount
                .updateOne(
                    { id: await utils.IDByLogin(msg.username) },
                    { $set: { poroCount: channelData.poroCount + 100 } },
                    { multi: true }
                )
                .exec();
            client.say(
                'dontaddthisbot',
                `@${msg.username} just followed !! kattahHappy +100 Poro Pts ${channelData.poroCount + 100} meat total!`
            );
        }
    }
    if (!msg.type) return Logger.error(`Unknown message without type: ${JSON.stringify(msg)}`);

    switch (msg.type) {
        case 'stream-up': {
            if (msg.channelID === '71092938')
                return Announce(137199626, `${await utils.loginByID(msg.channelID)} just went live! gn`);
            if (msg.channelID === '135075027')
                return Announce(137199626, `${await utils.loginByID(msg.channelID)} just went live! ppPoof`);
            if (msg.channelID === '116228390') {
                return client.privmsg('kattah', `.w getair_conditioned tommyinnit live Pog`);
            }
            Announce(137199626, `${await utils.loginByID(msg.channelID)} went live!`);
            break;
        }

        case 'stream-down': {
            if (msg.channelID === '71092938')
                return Announce(137199626, `${await utils.loginByID(msg.channelID)} went offline! gm`);
            if (msg.channelID === '71092938')
                return Announce(137199626, `${await utils.loginByID(msg.channelID)} went offline! UwUDespair`);
            Announce(137199626, `${await utils.loginByID(msg.channelID)} went offline!`);
            break;
        }

        case 'broadcast_settings_update': {
            if (msg.game_id !== msg.old_game_id) {
                if (msg.channel === 'xqc' || msg.channel === 'forsen')
                    return Announce(137199626, `${msg.channel} changed to new game: ${msg.game} gn`);
                Announce(137199626, `${msg.channel} changed to new game: ${msg.game}`);
            }

            if (msg.status !== msg.old_status) {
                if (msg.channel === 'xqc' || msg.channel === 'forsen')
                    return Announce(137199626, `${msg.channel} changed to new title: ${msg.status} gn`);
                Announce(137199626, `${msg.channel} changed to new title: ${msg.status}`);
            }
            break;
        }
        case 'reward-redeemed': {
            const redemption = msg.data.redemption;
            if (redemption.channel_id === '137199626' && redemption.reward.title === 'raid') {
                const user = redemption.user_input.split(' ')[0].replace('@', '');
                if (!/^[A-Za-z0-25_]*$/.test(user)) {
                    client.say('kattah', `Invalid Name, Refunding points...`);
                    refundPoints(redemption.channel_id, redemption.id);
                }
                if (user == (await utils.loginByID(redemption.channel_id))) {
                    client.say('kattah', `You cannot raid the broadcaster! Refunding points...`);
                    refundPoints(redemption.channel_id, redemption.id);
                } else {
                    const data = (await GetStreams(user, true))[0];
                    if (data == undefined) {
                        client.say('kattah', `${user} is not streaming! Refunding points...`);
                        refundPoints(redemption.channel_id, redemption.id);
                    } else if (data.type == 'live') {
                        try {
                            cancelRaid(redemption.channel_id);
                            await client.privmsg('kattah', `.raid ${user}`);
                            client.say(
                                'kattah',
                                `${redemption.user.display_name} redeemed raid on ${user} PogBones !!`
                            );
                        } catch (err) {
                            Logger.error(err);
                            client.say('kattah', `${redemption.user.display_name} FailFish error! refunding points`);
                            refundPoints(redemption.channel_id, redemption.id);
                        }
                    }
                }
            }
            if (redemption.channel_id === redemption.channel_id && redemption.reward.title === 'random ban') {
                try {
                    const c = await got('http://tmi.twitch.tv/group/user/kattah/chatters').json();
                    var vipsAndViewers = [...c.chatters.vips, ...c.chatters.viewers];
                    var randomChatters = vipsAndViewers[Math.floor(Math.random() * vipsAndViewers.length)];
                    client.timeout(
                        await utils.loginByID(redemption.channel_id),
                        randomChatters,
                        60,
                        `kekw banned by ${redemption.user.display_name}`
                    );
                    await client.say(
                        await utils.loginByID(redemption.channel_id),
                        'PoroSad redeemed! ' + randomChatters + ' has been banned for 60 seconds'
                    );
                } catch (err) {
                    Logger.error(err);
                    client.say(
                        await utils.loginByID(redemption.channel_id),
                        `${redemption.user.display_name} FailFish error! refunding points`
                    );
                    refundPoints(redemption.channel_id, redemption.id);
                }
            }
            break;
        }
        case 'user_moderation_action': {
            const { channel_id, action, expires_in_ms } = msg.data;
            const inData = await bot.DB.channels.findOne({ id: channel_id });
            if (!inData) return;
            const user = await utils.loginByID(channel_id);
            const { logo } = await utils.IVR(channel_id);
            if (action == 'timeout') {
                await client.part(user);
            } else if (action == 'ban') {
                client.part(user);
                await bot.DB.channels
                    .updateOne({ id: channel_id }, { isChannel: false })
                    .catch((err) => Logger.error(err));
            } else if (action == 'untimeout') {
                await client.join(user);
            } else if (action == 'unban') {
                await client.join(user);
                await bot.DB.channels
                    .updateOne({ id: channel_id }, { isChannel: true })
                    .catch((err) => Logger.error(err));
            }

            const duration = expires_in_ms ? `Duration: ${humanizeDuration(expires_in_ms)}` : `Duration: false`;
            const color = action == 'timeout' || action == 'ban' ? 15548997 : 5763719;
            await discord.BAND(user, action.toUpperCase(), duration, color, logo);
            break;
        }
        case 'moderator_removed': {
            const user = await utils.loginByID(msg.channelID);
            const IVR = await utils.IVR(msg.channelID);
            await discord.BAND(user, 'UNMODDED', '', 15548997, IVR.logo);
            break;
        }

        case 'moderator_added': {
            const user = await utils.loginByID(msg.channelID);
            const IVR = await utils.IVR(msg.channelID);
            await discord.BAND(user, 'MODDED', '', 5763719, IVR.logo);
            break;
        }

        case 'vip_removed': {
            const user = await utils.loginByID(msg.channelID);
            const IVR = await utils.IVR(msg.channelID);
            await discord.BAND(user, 'UNVIPED', '', 7419530, IVR.logo);
            break;
        }

        case 'vip_added': {
            const user = await utils.loginByID(msg.channelID);
            const IVR = await utils.IVR(msg.channelID);
            await discord.BAND(user, 'VIPED', '', 7419530, IVR.logo);
            break;
        }
    }
};

const handleWSResp = (msg) => {
    if (!msg.nonce) return Logger.error(`Unknown message without nonce: ${JSON.stringify(msg)}`);

    const topic = this.topics.find((topic) => topic.nonce === msg.nonce);

    if (msg.error && msg.error !== 'ERR_BADAUTH') {
        // just ignore this shitty error
        this.topics.splice(this.topics.indexOf(topic), 1);
        Logger.error(
            `Error occurred while subscribing to topic ${topic.sub} for channel ${topic.channel.login}: ${msg.error}`
        );
    }
};
