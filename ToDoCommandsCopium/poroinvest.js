const utils = require("../util/utils.js");
const got = require("got");
const yahooStockAPI  = require('yahoo-stock-api')

module.exports = {
    name: 'invest',
    description: 'Invest on irl poros!',
    aliases: [],
    cooldown: 10000,
    async execute(message, args, client) {
        console.log((await  yahooStockAPI.getSymbol(args[0])).response.dayRange)
        const yahoo = await  yahooStockAPI.getSymbol(args[0])
        const dayRange = yahoo.response.dayRange
        var today = new Date().getHours()
        if (today >= 2 && today <= 20) { // The NYSE is open from Monday through Friday 9:30 a.m. to 4:00 p.m. NY Time. 
            // BUT since this isnt real money, we are gonna include the weekends too
            // The bot will use UTC time, so we need to convert to New York Time
            // UTC is 4 hours ahead of New York Time, so we need to plus 4 hours of 9:30AM to 4:00PM
            // which is 13:30PM to 20:00PM
            // but idk how to do minutes too so we are just gonna do, today >= 13 && today <= 20
            if (!args[0]) { // if no stock is provided
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    client.privmsg(message.channelName, `.me Please provide a stock. PoroSad`)
                } else {
                    return {
                        text: `Please provide a stock. PoroSad`,
                    };
                }
            }
            if (args[0] == 'claim') {
                const investPoro = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
                const isInvesting = investPoro.invest.find(badge => badge.id === message.senderUserID);
                if (isInvesting) {
                    const eps = await yahooStockAPI.getSymbol(investPoro.invest[0].stock)
                    const data = investPoro.invest[0].amount * eps.response.eps
                    await bot.DB.poroCount.updateOne({ id: message.senderUserID },  {$pull:{ invest: { id: message.senderUserID } }} ).exec();
                    return {
                        text: `You have claimed your poro! ${Math.floor(data)}`
                    }
                } else {
                    return {
                        text: `You are not investing!`
                    }
                }
            }
            if (!args[1]) { // if no amount is provided
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    client.privmsg(message.channelName, `.me Please provide amount. PoroSad`)
                } else {
                    return {
                        text: `Please provide amount. PoroSad`,
                    };
                }
            }
            if (isNaN(args[1]) || args[1].startsWith('-')) { // if amount is not a number
                if (message.senderUsername == await utils.PoroNumberOne()) {
                    client.privmsg(message.channelName, `.me Please provide a valid amount. PoroSad`)
                } else {
                    return {
                        text: `Please provide a valid amount. PoroSad`,
                    };
                }
            }
        const rawData = await yahooStockAPI.getSymbol(args[0])
        console.log(rawData)
        if (rawData.currency == null) {
			return {
				text: "Stock symbol could not be found!"
			};
		} else {
            const investPoro = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
            const isInvesting = investPoro.invest.find(badge => badge.id === message.senderUserID);
            if (isInvesting) {
                return {
                    text: "You are already investing!"
                }
            } else {
                await bot.DB.poroCount.updateOne({ id: message.senderUserID },  {$addToSet:{ invest:   [{ username: message.senderUsername, id: message.senderUserID, stock: args[0], amount: args[1], investedAt: new Date()  }] }} ).exec();
                const data = args[1] * rawData.response.dayRange
                console.log(Math.floor(data))
            }
        }
    } else {
        return {
            text: `Sorry, but we are closed for the moment! ${today}`
        }
    }
    }
}
// Investing Poros with real life stock exchange w/ real time NYSE (New York Stock Exchange)
// How this command works.
// 1. If no stock is provided, the bot will tell you to provide a stock.
// 2. If no amount is provided, the bot will tell you to provide an amount.
// 3. If the amount is not a number, the bot will tell you to provide a valid amount.

// Now this is the dank part.
// 4. Once everything matches above, in my database the stock that user choose, the amount of poros, and the date when invested will be stored.
// 5. When the user types "claim", the bot will check if the user is investing through the database. If not then it will tell you that you are not investing.
// 6. After user types "claim", it will make a api request with the chosen stock and the invested date in the database.
// 7. After the api response it will calculate the amount of poros the user has invested TIMES the stock's EPS and the stock growth rate since the user invested date to new Date(). (Old API was working fine with this.)
// 8. After the calculation it will send the user a message with the amount of poros they have earned.

// Errors 
// I used 2 APIs and the first one was great, but wanted me to pay $250 a month for more than 5 requests per minute. https://www.alphavantage.co/query
// The 2nd API that i used was the yahoo-stock-api, which was not formatted for a "Twitch" bot and i had to fix it.
// On very top i was testing, "const dayRange" but it wasnt working.
// I would get a response like stock growth rate dayRange: { 38.91 - 42.74 } rather than a better formatting dayRange: { Low: 38.91, High: 42.74 }
// Also I was losing my mind while making this command helpless so I gave up for good.