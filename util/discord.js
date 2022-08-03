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
