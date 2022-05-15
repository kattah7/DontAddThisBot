const got = require("got");

module.exports = {
    name: "test",
    aliases: [],
    cooldown: 3000,
    description: "lol",
    execute: async (message, args) => {
        let { body: userData, statusCode } = await got(`https://www.boredapi.com/api/activity?participants=1`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData)
    },
};
