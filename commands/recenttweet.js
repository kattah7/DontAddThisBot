const got = require('got');
const humanizeDuration = require('../humanizeDuration');
const regex = require('../util/regex.js');
const utils = require('../util/utils.js');

module.exports = {
    name: 'recenttweet',
    aliases: ['rt'],
    cooldown: 5000,
    description: 'Gets recent tweet of user (Usage: |rt or |recenttweet)',
    execute: async (message, args, client) => {
        if (!args[0]) {
            if (message.senderUsername == (await utils.PoroNumberOne())) {
                client.privmsg(message.channelName, `.me insert twitter name to get recent tweet lol`);
            } else {
                return {
                    text: `insert twitter name to get recent tweet lol`,
                };
            }
        }
        const targetUser = args[0] ?? message.senderUsername;
        const { data } = await got(`https://api.twitter.com/2/users/by/username/${targetUser}?user.fields=location`, {
            headers: {
                Authorization: `Bearer ${process.env.TWITTER_BEARER}`,
            },
        }).json();

        const { data: data2 } = await got(`https://api.twitter.com/2/users/${data.id}/tweets?tweet.fields=created_at`, {
            headers: {
                Authorization: `Bearer ${process.env.TWITTER_BEARER}`,
            },
        }).json();
        //console.log(data2);
        const ms = new Date().getTime() - Date.parse(data2[0].created_at);
        if (!regex.racism.test(data2[0].text)) {
            if (message.senderUsername == (await utils.PoroNumberOne())) {
                client.privmsg(
                    message.channelName,
                    `.me Recent Tweet: ${data2[0].text} (Posted ${humanizeDuration(
                        ms
                    )} ago) | twitter.com/${targetUser}/status/${data2[0].id}`
                );
            } else {
                return {
                    text: `Recent Tweet: ${data2[0].text} (Posted ${humanizeDuration(
                        ms
                    )} ago) | twitter.com/${targetUser}/status/${data2[0].id}`,
                };
            }
        } else {
            const XD =
                'https://discord.com/api/webhooks/987735146297962497/Kvhez5MjG5Y-XiYQo9EUGbhiVd6UODyOf58WjkAZwRQMglOX_cpiW436mXZLLD8T7oFA';
            const msg2 = {
                embeds: [
                    {
                        color: 0x0099ff,
                        title: `Sent by ${message.senderUsername}(UID:${message.senderUserID}) in #${message.channelName}`,
                        author: {
                            name: 'racist detected',
                            icon_url: 'https://i.nuuls.com/g8l2r.png',
                        },
                        description: `${args.join(' ')}`,
                        timestamp: new Date(),
                        footer: {
                            text: 'Pulled time',
                            icon_url:
                                'https://static-cdn.jtvnw.net/jtv_user_pictures/89049925-b020-436f-bf9e-6262c0bc6419-profile_image-600x600.png ',
                        },
                    },
                ],
            };
            fetch(XD + '?wait=true', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(msg2),
            })
                .then((a) => a.json())
                .then(console.log);
            return {
                text: 'That message violates the terms of service.',
            };
        }
    },
};
