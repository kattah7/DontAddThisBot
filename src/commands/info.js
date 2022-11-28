const fetch = require('node-fetch');
const utils = require('../util/twitch/utils.js');
const got = require('got');

module.exports = {
    tags: 'stats',
    name: 'info',
    aliases: ['user'],
    cooldown: 3000,
    description: 'Gets basic information of a user',
    execute: async (message, args, client) => {
        const targetUser = await utils.ParseUser(args[0] ?? message.senderUsername);
        var pagination = {
            pagination: {
                cursor: '',
            },
        };
        let channels = [];
        while (Object.keys(pagination['pagination']).length != 0) {
            var response = await fetch(
                `https://api.twitch.tv/helix/users/follows?from_id=${message.senderUserID}&first=100&after=${pagination['pagination']['cursor']}`,
                {
                    headers: {
                        'Client-ID': process.env.CLIENT_ID,
                        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                    },
                    method: 'GET',
                }
            );
            var json = await response.json();
            pagination = json;
            for (const user of json['data']) {
                channels.push(user['to_login']);
            }
        }

        if (!args[0] || targetUser == message.senderUsername) {
            const IVR2 = await utils.IVR(message.senderUserID);
            const { id, roles, createdAt } = IVR2;
            const whichRoles = roles.isPartner ? `Partner;` : roles.isAffiliate ? `Affiliate;` : `Roles: none;`;
            const isStaff = roles.isStaff ? `Staff;` : ``;
            return {
                text: `${message.senderUsername}; ${id}; ${createdAt.split('T')[0]}; ${whichRoles} ${isStaff}`,
            };
        }

        const userID = await utils.IDByLogin(targetUser);
        const IVR = await utils.IVR(userID);
        if (IVR == null) {
            return {
                text: `"${targetUser}" is not a valid user`,
            };
        }

        var pagination2 = {
            pagination: {
                cursor: '',
            },
        };
        let channels2 = [];
        while (Object.keys(pagination2['pagination']).length != 0) {
            var response = await fetch(
                `https://api.twitch.tv/helix/users/follows?from_id=${userID}&first=100&after=${pagination2['pagination']['cursor']}`,
                {
                    headers: {
                        'Client-ID': process.env.CLIENT_ID,
                        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                    },
                    method: 'GET',
                }
            );
            var json = await response.json();
            pagination2 = json;
            for (const user of json['data']) {
                channels2.push(user['to_login']);
            }
        }
        const { banned, banReason, id, roles, createdAt } = IVR;
        const compare = channels.filter((x) => channels2.includes(x));
        if (compare.length != 0) {
            var paste = await got.post('https://paste.ivr.fi/documents', { body: compare.join('\n') }).json();
        }
        const isCompareZero =
            compare.length > 0
                ? `You follow ${compare.length} common channels with ${targetUser}. More info ==> https://paste.ivr.fi/raw/${paste.key}`
                : ``;
        const isBanned = banned ? `⛔ ${banReason};` : ``;
        const whichRoles = roles.isPartner ? `Partner;` : roles.isAffiliate ? `Affiliate;` : `Roles: none;`;
        const isStaff = roles.isStaff ? `Staff;` : ``;
        return {
            text: `${targetUser}; ${id}; ${
                createdAt.split('T')[0]
            }; ${isBanned} ${whichRoles} ${isStaff} ${isCompareZero}`,
        };
    },
};
