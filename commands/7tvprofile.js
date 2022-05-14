module.exports = {
    name: "7tv",
    aliases: [""],
    cooldown: 3000,
    description:"Grabs 7tv profile of user",
    execute: async (message, args) => {
        if (args.length < 1) return { text: "Use |7tv (name)" };
        
        return {
            text: `${message.senderUsername}, https://7tv.app/users/${args} YEAHBUT7TV`,
        };
    },
};