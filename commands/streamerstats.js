const got = require("got");
const cloudflareScraper = require('cloudflare-scraper');

module.exports = {
    name: "stats",
    aliases: [],
    cooldown: 3000,
    description:"check streamer rank in the past 30 days",
    execute: async (message, args) => {
        
              const KEKW = await cloudflareScraper.get('https://twitchtracker.com/api/channels/summary/xqc');
              console.log(KEKW);
            
          return {
              text: `${KEKW}`
          }
    },
};