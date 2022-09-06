module.exports = {
    name: "say",
    description: "say something",
    aliases: [],
    level: 3,
    async execute(message, args, client) {
        
        //xdd
        if (!args.length) return { text: `You have to write the channel and the message 4Head`, reply: true }
        if (!args[0]) return { text: `Specify the channel Stare`, reply: true }
        const channel = args[0].toLowerCase().replace(/[#|@]/, '');
        if (!args[1]) return { text: `You forgot to write the message FailFish`, reply: true }
        const text = args.slice(1).join(' ');
        await client.say(channel, text)
        return

    },
};