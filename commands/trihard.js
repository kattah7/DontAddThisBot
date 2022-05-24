module.exports = {
    name: "trihard",
    aliases: ["TriHard"],
    cooldown: 3000,
    description:"TriHard",
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
            return {
                text: `${targetUser} TriHard`
            }
        
    },
};
