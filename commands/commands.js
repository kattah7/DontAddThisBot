module.exports = {
    name: "commands",
    aliases: ["commands"],
    cooldown: 3000,
    execute: async (message, args) => {
        return {
            text: `${message.senderUsername} WutFace https://pastebin.com/W0shXyxh`,
        };
    },
};
