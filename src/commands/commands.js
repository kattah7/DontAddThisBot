module.exports = {
    name: "commands",
    aliases: ["commands"],
    cooldown: 3000,
    execute: async (message, args, client) => {
        return {
            text: `${message.senderUsername}, https://poros.lol/commands WutFace`,
        };
    },
};