// const got = require('got');
// const fetch = require('node-fetch');

// module.exports = {
//     name: 'justlog',
//     cooldown: 3000,
//     level: 3,
//     description: 'Check if someone is hosting you',
//     execute: async(message, args, client) => {
//         var pagination = {
//             "pagination": {
//                 "cursor": "",
//                 }
//             };
//             let channels = [];
//         while (Object.keys(pagination['pagination']).length != 0) {
//             var response = await fetch(`https://api.twitch.tv/helix/users/follows?from_id=80805824&first=100&after=${pagination['pagination']['cursor']}`, {
//                 headers: {
//                     "Client-ID": process.env.CLIENT_ID,
//                     Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
//                 },
//             method: "GET",
//             });
//             var json = await response.json();
//             pagination = json;
//             for (const user of json['data']) {
//                 channels.push(user['to_login']);
//             }
//         };
        
//         console.log(channels)
//         for (const channel of channels) {
//             await client.say("checkingstreamers", `!justlog part ${channel}`)
//         }
//     }
// }