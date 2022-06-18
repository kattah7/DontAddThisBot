const got = require("got");
const humanizeDuration = require("../humanizeDuration");

module.exports = {
    name: "twitter",
    aliases: [],
    cooldown: 1000,
    description: "Gets info of user's twitter",
    execute: async (message, args, client) => {
        if (!args[0]) {
            return {
                text: `insert name to get twitter info lol`
            }
        }
        const targetUser = args[0] ?? message.senderUsername;
        const { data } = await got(`https://api.twitter.com/2/users/by/username/${targetUser}?user.fields=created_at,location,description`, {
            headers: {
                Authorization: `Bearer ${process.env.TWITTER_BEARER}`,
            },
        }).json();
        console.log(data)

        const { data: data2 } = await got(`https://api.twitter.com/2/users/${data.id}?user.fields=public_metrics`, {
            headers: {
                Authorization: `Bearer ${process.env.TWITTER_BEARER}`,
            },
        }).json();
        console.log(data2);
        
        const name = data.name;
        const location = data.location;
        const desc = data.description;
        const id = data.id;
        const accountAge = data.created_at
        const PUBLICMETRICS = data2.public_metrics;
        
        if (message.senderUsername == process.env.NUMBER_ONE) {
            client.privmsg(message.channelName, `.me ${targetUser} (${name})'s twitter account created at ${accountAge.split("T")[0]}, ID: ${id}, Location: ${location}, Description: ${desc} [Followers: ${PUBLICMETRICS.followers_count} Following: ${PUBLICMETRICS.following_count} ]`)
        } else {
            return {
                text: `${targetUser} (${name})'s twitter account created at ${accountAge.split("T")[0]}, ID: ${id}, Location: ${location}, Description: ${desc} [Followers: ${PUBLICMETRICS.followers_count} Following: ${PUBLICMETRICS.following_count} ]`
            }
        }
    },
};