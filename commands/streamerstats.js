const got = require("got");
const cloudflareScraper = require('cloudflare-scraper');
const puppeteer = require('puppeteer');

module.exports = {
    name: "stats",
    aliases: [],
    cooldown: 3000,
    description:"check streamer rank in the past 30 days",
    execute: async (message, args) => {
        (async function main() {
            try {
                const browser = await puppeteer.launch();
                const [page] = await browser.pages();
        
                await page.goto('https://twitchtracker.com/api/channels/summary/xqc', { waitUntil: 'networkidle0' });
                const bodyHTML = await page.evaluate(() => document.body.innerHTML);
        
                console.log(bodyHTML);
        
                await browser.close();
            } catch (err) {
                console.error(err);
            }
        })();
    },
};