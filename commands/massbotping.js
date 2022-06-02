module.exports = {
    name: "massbotping",
    aliases: [],
    description:"TF",
    permission: 3,
    execute: async (message, args, client) => {
       const xd = "',=,?,*,#,>,!"; for (const lol of xd.split(",")) { client.privmsg("kattah", `${lol}ping`) }; 

    },
};