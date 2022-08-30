module.exports = {
    name: "trihard",
    aliases: ["TriHard"],
    cooldown: 3000,
    description:"TriHard",
    execute: async (message, args, client) => {
        return {
            text: `${message.senderUsername} TriHard`
        }
    },
};
