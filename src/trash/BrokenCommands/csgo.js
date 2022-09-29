// const fetch = require("node-fetch");

// module.exports = {
//     name: "csgo",
//     aliases: [],
//     cooldown: 1000,
//     description: "check your csgo stats Pepege forsenPls",
//     execute: async (message, args, client) => {
//         if (!args[0]) {
//             return {
//                 text: `${message.senderUsername}, Please provide a steamID64 or Steam username`
//             }
//         };

//         const csgoAPi = await fetch(`https://public-api.tracker.gg/v2/csgo/standard/profile/steam/${args[0]}`, {
//             method: 'GET',
//             headers: {
//                 Authorization: `${process.env.TRN_API_KEY}`,
//             }
//         })
//         .then(res => res.json())
//         console.log(csgoAPi)
//         if (user.errors) {
//             if (user.errors[0].code == "CollectorResultStatus::NotFound") {
//                 return {
//                     text: `${args.join(" ")} Not found :( , Please use Steam ID, Steam Community URL, Steam Vanity Username, etc.`,
//                 };  
//             } else if (user.errors[0].code == "CollectorResultStatus::Private") {
//                 return {
//                     text: `${args.join(" ")} Profile is private :p , Please enable game settings under privacy settings`,
//                 };
//             }
//         } else {
//             const playtime = user.data.segments[0].stats.timePlayed.displayValue;
//             const matches = user.data.segments[0].stats.matchesPlayed.displayValue;
//             const wins = user.data.segments[0].stats.losses.displayValue;
//             const losses = user.data.segments[0].stats.wins.displayValue;
//             const kills = user.data.segments[0].stats.kills.displayValue;
//             const deaths = user.data.segments[0].stats.deaths.displayValue;
//             const kd = user.data.segments[0].stats.kd.displayValue;

            
//             return {
//                 text: `${args.join(" ")} has ${playtime} in CSGO LuL ${matches} Rounds [W:${losses} L:${wins}] LuL ${kd} K/D [K:${kills} D:${deaths}]`,
//             };
//         }
//     },
// };