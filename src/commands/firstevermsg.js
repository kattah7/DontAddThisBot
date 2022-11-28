const got = require('got');
const utils = require('../util/twitch/utils.js');

const ulength = (text) => {
    let n = 0;
    for (let i = 0; i < text.length; i++) {
        const cur = text.charCodeAt(i);
        if (cur >= 0xd800 && cur <= 0xdbff) {
            const next = text.charCodeAt(i + 1);
            // Skip second char in surrogate pair
            if (next >= 0xdc00 && next <= 0xdfff) i++;
        }
        n++;
    }
    return n;
};

module.exports = {
    name: 'fetchfirstmessage',
    aliases: ['ffm'],
    cooldown: 3000,
    botPerms: 'mod',
    level: 3,
    execute: async (message, args, client) => {
        const user = await utils.ParseUser(args[0] ?? message.senderUsername);
        const userid = await utils.IDByLogin(user);

        let total = 0;
        const fetchMessages = async (cursor) => {
            const { body } = await got.post(`https://gql.twitch.tv/gql`, {
                headers: {
                    'Client-ID': process.env.CLIENT_ID_FOR_GQL,
                    'Authorization': `OAuth ${process.env.TWITCH_GQL_TOKEN}`,
                },
                json: {
                    operationName: 'ViewerCardModLogsMessagesBySender',
                    variables: {
                        senderID: userid,
                        channelLogin: message.channelName,
                        cursor,
                    },
                    extensions: {
                        persistedQuery: {
                            version: 1,
                            sha256Hash: '437f209626e6536555a08930f910274528a8dea7e6ccfbef0ce76d6721c5d0e7',
                        },
                    },
                },
            });

            const messages = JSON.parse(body).data.channel.modLogs.messagesBySender.edges;
            total += messages.length;
            console.log(`Loaded ${messages.length}, Total: ${total}`);

            const nextCursor = messages.slice(-1).pop().cursor;
            if (messages.length !== 50) {
                const tmiData = [];
                for (const xd of messages) {
                    const text = xd.node.content?.text;
                    if (!text) {
                        continue;
                    }

                    let emotes = [];
                    let pos = 0;
                    for (f of xd.node.content.fragments) {
                        const pos2 = pos + f.text.length - 1;
                        if (f.content?.emoteID) emotes.push(`${f.content.emoteID}:${pos}-${pos2}`);
                        pos += ulength(f.text);
                    }

                    const tags = {
                        'id': xd.node.id,
                        'badges': xd.node.sender.displayBadges.map((b) => `${b.setID}/${b.version}`).join(),
                        'color': xd.node.sender.chatColor,
                        'emotes': emotes.join('/'),
                        'display-name': xd.node.sender.displayName,
                        'tmi-sent-ts': Date.parse(xd.node.sentAt),
                    };

                    const rawTags = Object.entries(tags)
                        .map(([k, v]) => `${k}=${v}`)
                        .join(';');
                    tmiData.push(`@${rawTags} :${xd.node.sender.login} PRIVMSG #${message.channelName} :${text}`);
                }

                const paste = await got
                    .post('https://paste.ivr.fi/documents', { body: tmiData.reverse().join('\n') })
                    .json();
                console.log(`Result: https://paste.ivr.fi/raw/${paste.key}`);

                const msg = messages.slice(-1)[0].node;
                const timestamp = msg.sentAt ?? msg.timestamp;
                const text = msg.action ?? msg.content.text;
                await client.say(
                    message.channelName,
                    `${user} has sent ${total} messages. Their first message in this channel was ${
                        timestamp.split('T')[0]
                    } ago: "${text}" More info => https://logs.raccatta.cc/?url=https://paste.ivr.fi/raw/${
                        paste.key
                    }?reverse`
                );
            } else if (nextCursor) {
                fetchMessages(nextCursor);
            }
        };

        fetchMessages();
        return {
            text: `Fetching... kattahSpin this will take a while`,
        };
    },
};
