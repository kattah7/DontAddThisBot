const got = require('got');
const humanizeDuration = require('../humanizeDuration');
const regex = require('../util/regex.js');
const utils = require('../util/utils.js');

module.exports = {
    name: 'twitter',
    aliases: [],
    cooldown: 1000,
    description: "Gets info of user's twitter",
    execute: async (message, args, client) => {
        if (!args[0]) {
            if (message.senderUsername == (await utils.PoroNumberOne())) {
                client.privmsg(message.channelName, `.me insert name to get twitter info lol`);
            } else {
                return {
                    text: `insert name to get twitter info lol`,
                };
            }
        }
        const targetUser = args[0] ?? message.senderUsername;
        const { data } = await got(
            `https://api.twitter.com/2/users/by/username/${targetUser}?user.fields=created_at,location,description`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TWITTER_BEARER}`,
                },
            }
        ).json();
        //console.log(data)

        const { data: data2 } = await got(`https://api.twitter.com/2/users/${data.id}?user.fields=public_metrics`, {
            headers: {
                Authorization: `Bearer ${process.env.TWITTER_BEARER}`,
            },
        }).json();
        //console.log(data2);

        const name = data.name;
        const location = data.location;
        const desc = data.description;
        const id = data.id;
        const accountAge = data.created_at;
        const PUBLICMETRICS = data2.public_metrics;
        if (!regex.racism.test(desc, name, location, accountAge, PUBLICMETRICS)) {
            if (message.senderUsername == (await utils.PoroNumberOne())) {
                client.privmsg(
                    message.channelName,
                    `.me ${targetUser} (${name})'s twitter account created at ${
                        accountAge.split('T')[0]
                    }, ID: ${id}, Location: ${location}, Description: ${desc} [Followers: ${
                        PUBLICMETRICS.followers_count
                    } Following: ${PUBLICMETRICS.following_count} ]`
                );
            } else {
                return {
                    text: `${targetUser} (${name})'s twitter account created at ${
                        accountAge.split('T')[0]
                    }, ID: ${id}, Location: ${location}, Description: ${desc} [Followers: ${
                        PUBLICMETRICS.followers_count
                    } Following: ${PUBLICMETRICS.following_count} ]`,
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
