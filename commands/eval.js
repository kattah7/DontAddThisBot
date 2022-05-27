const got = require('got')

module.exports = {
    name: 'eval',
    description: "eval something",
    aliases: ['ev'],
    level: 3,
    async execute(message, args, client) {
        try {
            const ev = await eval("(async () => {" + args.join(" ").replace(/„|“/gm, '"') + "})()");
            if (!ev) return null;
            return { text: String(ev) };
        } catch (e) {
            return {
                text: `error: ${e}`,
                reply: true,
            };
        }
    },
};