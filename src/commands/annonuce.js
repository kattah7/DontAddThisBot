const fetch = require('node-fetch');

module.exports = {
    tags: 'moderation',
    name: 'announce',
    description: 'annoucement in chat (Requires Mod)',
    cooldown: 3000,
    permission: 1,
    aliases: ['ann'],
    botPerms: 'mod',
    async execute(message, args) {
        if (!args[0]) {
            return {
                text: 'Please put a message to announce',
            };
        }
        await fetch(
            `https://api.twitch.tv/helix/chat/announcements?broadcaster_id=${message.channelID}&moderator_id=790623318`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                    'Client-ID': `gp762nuuoqcoxypju8c569th9wz7q5`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: args.join(' '),
                    color: 'purple',
                }),
            }
        );
    },
};
