module.exports = {
    name: "say",
    description: "say something",
    aliases: [],
    level: 3,
    async execute(message, args, client) {
        
        //xd
        const channel = args[0].toLowerCase().replace(/[#|@]/, '');
        const text = args.slice(1).join(' ');
        await client.say(channel, text)
        return

    },
};