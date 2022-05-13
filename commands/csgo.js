const got = require("got");
const util = require("util");

module.exports = {
    name: "csgo",
    aliases: [],
    cooldown: 1000,
    description: "check your csgo stats Pepege forsenPls",
    execute: async (message, args) => {
        var myHeaders = new Headers();
        myHeaders.append("TRN-Api-Key", `${process.env.TRN_Api_Key}`);

        var requestOptions = {
            method: "GET",
            redirect: "follow",
            headers: myHeaders,
        };

        const res = await fetch(`https://public-api.tracker.gg/v2/csgo/standard/profile/steam/${args.join(" ")}`, requestOptions);
        const user = await res.json();

        console.log(util.inspect(user, { showHidden: false, depth: null, colors: true }));

        if (user.errors) {
            if (user.errors[0].code == "CollectorResultStatus::NotFound") {
                return {
                    text: `${args.join(" ")} Not found :( , Please use Steam ID, Steam Community URL, Steam Vanity Username, etc.`,
                };
            } else if (user.errors[0].code == "CollectorResultStatus::Private") {
                return {
                    text: `${args.join(" ")} Profile is private :p , Please enable game settings under privacy settings`,
                };
            }
        } else {
            const playtime = user.data.segments[0].stats.timePlayed.displayValue;
            const matches = user.data.segments[0].stats.matchesPlayed.displayValue;
            const wins = user.data.segments[0].stats.losses.displayValue;
            const losses = user.data.segments[0].stats.wins.displayValue;
            const kills = user.data.segments[0].stats.kills.displayValue;
            const deaths = user.data.segments[0].stats.deaths.displayValue;
            const kd = user.data.segments[0].stats.kd.displayValue;

            return {
                text: `${args.join(" ")} has ${playtime} in CSGO LuL ${matches} Rounds [W:${losses} L:${wins}] LuL ${kd} K/D [K:${kills} D:${deaths}]`,
            };
        }
    },
};