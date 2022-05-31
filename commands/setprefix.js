module.exports = {
    name: 'setprefix',
    description: 'changes the bot prefix for your channel (default is "|")',
    aliases: [],
    cooldown: 3000,
    permission: 2,
    usage: "<prefix>",
    async execute(message, args, client) {
        if (!args.length) return { text: `you need to specify the prefix`}
        const prefix = args[0].toLowerCase()
        if (prefix.length > 15) return { text: `prefix too long, the maximum length is 15 characters`}
        if (message.prefix === prefix) return { text: `the channel prefix is already set to ${prefix}`}
        if (prefix.startsWith('.') || prefix.startsWith('/')) return { text: `the prefix was not set, this character is reserved for twitch commands`}

        await bot.DB.channels.updateOne({ username: message.channelName }, { $set: { prefix: prefix } }).exec(); 
        return { text: `prefix changed to "${prefix}" lol` }
    },
};