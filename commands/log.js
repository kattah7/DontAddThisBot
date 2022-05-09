const got = require("got");

module.exports = {
    name: "log",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        const { data } = await got(`https://api.twitch.tv/helix/clips?broadcaster_id=22484632`, {
            headers: {
                "Client-ID": process.env.CLIENT_ID,
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
            },
        }).json();

        console.log(data);
    },
};
