const got = require("got");
const util = require('util')

module.exports = {
    name: "test2",
    aliases: [],
    cooldown: 1000,
    description:"check your fortnite stats zzoomerPls",
    execute: async (message, args) => {
        var myHeaders = new Headers();
        myHeaders.append("TRN-Api-Key", `${process.env.TRN_Api_Key}`);

        var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
        };

        
       const res = await fetch(`https://public-api.tracker.gg/v2/csgo/standard/profile/steam/${args.join(" ")}`, requestOptions)
       const user = await res.json();

       console.log(util.inspect(user, {showHidden: false, depth: null, colors: true}));
       const ERROR = user.errors[1].code

       
           
        const playtime = user.data.segments[0].stats.timePlayed.displayValue
        const matches = user.data.segments[0].stats.matchesPlayed.displayValue
        const wins = user.data.segments[0].stats.losses.displayValue
        const losses = user.data.segments[0].stats.wins.displayValue
        const kills = user.data.segments[0].stats.kills.displayValue
        const deaths = user.data.segments[0].stats.deaths.displayValue
        const kd = user.data.segments[0].stats.kd.displayValue
    
            return {
                text: `You have ${playtime} in CSGO LuL ${matches} Rounds [W:${losses} L:${wins}] LuL ${kd} K/D [K:${kills} D:${deaths}]`
             }
        

    }
};