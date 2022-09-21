module.exports = {
    name: 'say',
    description: 'say something',
    aliases: [],
    level: 3,
    async execute(message, args, client) {
        //xdd
        if (!args[0]) {
            return {
                text: `No message to say`,
            };
        }

        return {
            text: args.join(' '),
        };
    },
};
