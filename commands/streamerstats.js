const CloudflareBypasser = require('cloudflare-bypasser');
const got = require("got")

module.exports = {
    name: "stats",
    aliases: [],
    cooldown: 3000,
    description:"check streamer rank in the past 30 days",
    execute: async (message, args) => {
        let cf = new CloudflareBypasser();

        cf.request('https://twitchtracker.com/api/channels/summary/xqc')
        .then(res => {
        console.log(res)
        });

    },
};