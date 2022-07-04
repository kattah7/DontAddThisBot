const got = require("got");

module.exports = {
    name: "eval",
    description: "eval something",
    aliases: ["ev"],
    level: 3,
    async execute(message, args, client) {
        try {
            let ev;
            if (args[0].startsWith("http")) {
                const res = await got(args[0]);
                ev = await eval("(async () => {" + res.body.replace(/„|“/gm, '"') + "})()");
            } else {
                ev = await eval("(async () => {" + args.join(" ").replace(/„|“/gm, '"') + "})()");
            }
        } catch (e) {
            return {
                text: `error: ${e}`,
                reply: true,
            };
        }
    },
};
