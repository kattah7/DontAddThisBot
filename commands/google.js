module.exports = {
    name: "search",
    aliases: ["google"],
    cooldown: 3000,
    description:"google anything!",
    execute: async (message, args, client) => {
        const search = args[0] ?? message.senderUsername;
        if (message.senderUsername == process.env.NUMBER_ONE) {
            client.privmsg(message.channelName, `.me ${message.senderUsername}, https://www.google.com/search?q=${args.join("+")}`)
        } else {
            return {
                text: `${message.senderUsername}, https://www.google.com/search?q=${args.join("+")}`,
            };
        }
    },
};