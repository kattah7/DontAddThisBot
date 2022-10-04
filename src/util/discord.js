require('dotenv').config();
const fetch = require('node-fetch');

exports.NewPoro = async (AccAge, UID, username, channel, description, logo) => {
    const WebHook = `https://discord.com/api/webhooks/${process.env.PORO_DISCORD}`;
    const WebhookMsg = {
        embeds: [
            {
                fields: [
                    {
                        name: 'Account Age',
                        value: AccAge,
                    },
                    {
                        name: 'Unique Identifier',
                        value: UID,
                    },
                ],
                title: `${username} in #${channel} said`,
                description: `${description}`,
                thumbnail: {
                    url: logo,
                },
                color: 1127128,
                timestamp: new Date(),
                footer: {
                    text: 'Pulled time',
                },
            },
        ],
    };
    await fetch(WebHook + '?wait=true', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(WebhookMsg),
    });
};

exports.racist = async (username, userID, channel, message) => {
    const WebHook = `https://discord.com/api/webhooks/${process.env.RACIST}`;
    const WebhookMsg = {
        embeds: [
            {
                color: 0x0099ff,
                title: `Sent by ${username}(UID:${userID}) in #${channel}`,
                author: {
                    name: 'racist detected',
                    con_url: 'https://i.nuuls.com/g8l2r.png',
                },
                description: `${message}`,
                timestamp: new Date(),
                footer: {
                    text: 'Pulled time',
                    icon_url:
                        'https://static-cdn.jtvnw.net/jtv_user_pictures/89049925-b020-436f-bf9e-6262c0bc6419-profile_image-600x600.png ',
                },
            },
        ],
    };
    await fetch(WebHook + '?wait=true', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(WebhookMsg),
    });
};

exports.newChannel = async (username, userID, message) => {
    const WebHook = `https://discord.com/api/webhooks/${process.env.NEW_CHANNEL}`;
    const WebhookMsg = {
        embeds: [
            {
                color: 0x0099ff,
                title: `Joined channel ${username}(UID:${userID})`,
                author: {
                    name: 'New channel',
                    con_url: 'https://i.nuuls.com/g8l2r.png',
                },
                description: `${message}`,
                timestamp: new Date(),
                footer: {
                    text: 'Pulled time',
                    icon_url:
                        'https://static-cdn.jtvnw.net/jtv_user_pictures/89049925-b020-436f-bf9e-6262c0bc6419-profile_image-600x600.png ',
                },
            },
        ],
    };
    await fetch(WebHook + '?wait=true', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(WebhookMsg),
    });
};

exports.errorMessage = async (channel, username, message, error) => {
    const WebHook = `https://discord.com/api/webhooks/${process.env.ERROR}`;
    const WebhookMsg = {
        content: `<@363968088783323136>`,
        embeds: [
            {
                color: 0x0099ff,
                title: `Error in ${channel} by ${username}`,
                author: {
                    name: 'Error',
                    con_url: 'https://i.nuuls.com/g8l2r.png',
                },
                description: `${message}, ${error}`,
                timestamp: new Date(),
                footer: {
                    text: 'Pulled time',
                    icon_url:
                        'https://static-cdn.jtvnw.net/jtv_user_pictures/89049925-b020-436f-bf9e-6262c0bc6419-profile_image-600x600.png ',
                },
            },
        ],
    };
    await fetch(WebHook + '?wait=true', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(WebhookMsg),
    });
};

exports.BAND = async (channel, action, message, color, pfp) => {
    const WebHook = `https://discord.com/api/webhooks/${process.env.ACTION}`;
    const WebhookMsg = {
        embeds: [
            {
                thumbnail: {
                    url: pfp,
                },
                color: color,
                title: `${action} in ${channel}`,
                author: {
                    name: action,
                    con_url: 'https://i.nuuls.com/g8l2r.png',
                },
                description: `${message}`,
                timestamp: new Date(),
                footer: {
                    text: 'Pulled time',
                    icon_url:
                        'https://static-cdn.jtvnw.net/jtv_user_pictures/89049925-b020-436f-bf9e-6262c0bc6419-profile_image-600x600.png ',
                },
            },
        ],
    };
    await fetch(WebHook + '?wait=true', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(WebhookMsg),
    });
};
