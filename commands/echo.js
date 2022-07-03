module.exports = {
    name: "echo",
    description: "echo something",
    aliases: [],
    level: 3,
    async execute(message, args, client) {
        
        //xdd
        if (!args.length) return { text: `You have to write something 4Head`, reply: true }
        return { text: args.join(" ") };

    },
};