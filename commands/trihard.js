module.exports = {
    name: "trihard",
    aliases: ["TriHard"],
    cooldown: 3000,
    execute: async (message, args) => {
        return {
            text: `${message.senderUsername} TriHard`,
        };
    },
};
