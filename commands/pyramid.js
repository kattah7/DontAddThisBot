module.exports = {
    name: 'pyramid',
    aliases: [],
    cooldown: 10000,
    description:"Pyramid command in chat",
    botPerms: "vip",
    async execute(message, args, client) {
        const size = args[0]
        const emote = args.slice(1).join(' ') + " "; 

        if (args.length < 2) return { text: "you need to include at least 2 args" }
        if (isNaN(size)) return { text: `size should be a number` }
        if (size > 20) return { text: `the maximum size is 20` }
        if (size < 2) return { text: `the minimum size is 2` }

        for (let i = 1; i <= size; i++) {
            client.say(message.channelName, emote.repeat(i))
             await new Promise((r) => setTimeout(r, 70));
        }

        for (let i = (size - 1); i > 0; i--) {
            client.say(message.channelName, emote.repeat(i));
            await new Promise((r) => setTimeout(r, 70));
        }
    },
};