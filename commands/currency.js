const got = require("got");

module.exports = {
    name: "currency",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        var myHeaders = new Headers();
        myHeaders.append("apikey", `${process.env.API_KEY}`);

        var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
        };

        const currency1 = args[0] ?? message.senderUsername;
        const currency2 = args[1] ?? message.channelName;
        const amount = args[2] ?? message.channelName;


       const res = await fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${currency1}&from=${currency2}&amount=${amount}`, requestOptions)
       const user = await res.json();

       console.log(user);
        const FROM = user.query.from
        const TO = user.query.to
        const RESULT = user.result
        const AMOUNT = user.query.amount


        return {
            text: `${AMOUNT} ${FROM} to ${TO} is ${RESULT} :) Try using other currencies [Example: |currency USD EUR amount]`
        }
        
    },
};