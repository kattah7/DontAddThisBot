const got = require("got");
const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "sillychamp",
    aliases: [],
    cooldown: 5000,
    description: "Gets recent tweet from TwitchGibberish",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        const { data } = await got(`https://api.twitter.com/2/users/by/username/TwitchGibberish?user.fields=location`, {
            headers: {
                Authorization: `Bearer ${process.env.TWITTER_BEARER}`,
            },
        }).json();

        const { data: data2 } = await got(`https://api.twitter.com/2/users/${data.id}/tweets?tweet.fields=created_at`, {
            headers: {
                Authorization: `Bearer ${process.env.TWITTER_BEARER}`,
            },
        }).json();
        //console.log(data2);

        const random = Math.floor(Math.random() * 10) + 0;
        return {
            text: `https://twitter.com/TwitchGibberish/status/${data2[random].id}/photo/1`
        }
    }
}