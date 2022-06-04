const got = require("got");

module.exports = {
    name: "test",
    aliases: ["test"],
    cooldown: 3000,
    description:"Gets the top clip of the channel",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername
        const { data } = await got(`https://api.twitch.tv/helix/streams?user_login=${targetUser}`, {
            headers: {
                "Client-ID": process.env.CLIENT_ID,
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
            },
        }).json();
        console.log(data[0])
        if (data[0] == undefined) {
            return {
                text: `offline lol`
            }
        }
        if (data[0].type == 'live') {
            return {
                text: `online lol`
            }
        }

    },
};