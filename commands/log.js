const got = require("got");

module.exports = {
    name: "log",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        const token = {
            url: "https://api.twitch.tv/helix/streams?finrst=20",
        header: {"client-ID": "gp762nuuoqcoxypju8c569th9wz7q5"}
        }
        let { body: userData, statusCode } = await got(`${token}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData)

    },
};