module.exports = {
    name: "ping",
    aliases: ["xd"],
    cooldown: 3000,
    execute: async (message, args) => {
        return {
            text: `${message.senderUsername} lol`,
        };
    },
};
