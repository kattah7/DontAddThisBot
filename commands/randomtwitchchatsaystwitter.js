const got = require("got");
const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "test123",
    aliases: [],
    cooldown: 1000,
    description: "Gets recent tweet of user (Usage: |rt or |recenttweet)",
    execute: async (message, args) => {
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
        console.log(data2);
    }
}