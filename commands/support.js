module.exports = {
    name: "support",
    aliases: ["donate"],
    cooldown: 3000,
    description:"If you would like to help my monthly server cost TriHard",
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
            return {
                text: `${targetUser}, https://ko-fi.com/kattah ☕ If you would like to help upkeep server cost for the bot :) <3 `
            }
        
    },
};