const cloudflareScraper = require('cloudflare-scraper');

(async () => {
  try {
    const response = await cloudflareScraper.get('https://twitchtracker.com/api/channels/summary/xqc');
    console.log(response);
  } catch (error) {
    console.log(error);
  }
})();