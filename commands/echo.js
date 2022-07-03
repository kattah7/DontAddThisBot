module.exports = {
    name: "echo",
    description: "echo something",
    aliases: [],
    level: 3,
    async execute(message, args, client) {
        
        //xdd
        return { text: args.join(" ") };

    },
};