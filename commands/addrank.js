module.exports = {
    name: "addrank",
    aliases: [],
    cooldown: 3000,
    description: "Permission to give out ranks to use commands.",
    execute: async(message, args) => {
        const targetUser = args[0] ?? message.senderUsername

    }
}