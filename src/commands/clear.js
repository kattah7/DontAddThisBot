module.exports = {
    name: 'clear',
    description: 'Clears the chat',
    cooldown: 3000,
    permission: 1,
    botPerms: 'mod',
    async execute(message, args, client) {
        for (let i = 0; i < 150; i++) {
            client.privmsg(message.channelName, '/clear');
        }
    },
};
