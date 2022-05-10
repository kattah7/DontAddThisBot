module.exports = {
    name: "search",
    aliases: ["google"],
    cooldown: 3000,
    execute: async (message, args) => {
        const search = args[0] ?? message.senderUsername;
        return {
            text: `${message.senderUsername}, https://www.google.com/search?q=${args.join("+")}`,
        };
    },
};