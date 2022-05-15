const got = require("got");

module.exports = {
    name: "cookie",
    aliases: [],
    cooldown: 3000,
    description: "fortune cookie every 12 hours",
    execute: async (message, args) => {
        let userData = await got(`https://zenquotes.io/api/random`, { timeout: 10000}).json();
        console.log(userData)
            const date = new Date();
        return {
            text: `${date}`
        }
    }
}