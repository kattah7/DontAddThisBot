const rwClient = require('../util/twitterClient.js');
const got = require('got');

module.exports = {
    tags: 'stats',
    name: 'tweet',
    cooldown: 5000,
    description: 'Tweet anything :) Check out your tweet twitter.com/twitchsayschat ',
    execute: async (message, args, client) => {
        const targetUser = message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, {
            timeout: 10000,
            throwHttpErrors: false,
            responseType: 'json',
        });
        //console.log(userData)
        const name = userData.displayName;
        const tweet = async () => {
            try {
                await rwClient.v1.tweet(`${name}: ${args.join(' ')}`);
            } catch (e) {
                console.error(e);
            }
        };
        tweet();
        return {
            text: `${name} Successfully tweeted kattahSpin Check out twitter.com/twitchsayschat to see your tweet`,
        };
    },
};
