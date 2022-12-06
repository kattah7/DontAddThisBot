module.exports = {
    tags: 'moderation',
    name: 'clear',
    description: 'Clears the chat',
    cooldown: 5000,
    aliases: [],
    permission: 1,
    botPerms: 'mod',
    async execute(message, args, client) {
        args[0]
            ? isNaN(args[0])
                ? await client.say(message.channelName, `Please put a valid nunmber :)`)
                : args[0] > 100
                ? await client.say(message.channelName, `You can only put less than 100 :)`)
                : clearChat(args[0])
            : clearChat(50);
        function clearChat(amount) {
            for (let i = 0; i < amount; i++) {
                client.privmsg(message.channelName, `.clear`);
            }
        }
    },
};
