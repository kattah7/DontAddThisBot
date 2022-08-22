const fetch = require('node-fetch');

module.exports = {
    name: "test",
    level: 3,
    cooldown: 5000,
    execute: async (message, args, client) => {
        const url1 = `https://api.ivr.fi/twitch/subage/kattah/forsen`
        const url2 = `https://api.ivr.fi/twitch/subage/turtoise/forsen`
        const responses = await Promise.all([fetch(url1), fetch(url2), {
            method: 'GET',
        }])
        
        const data = await Promise.all([responses[0].json(), responses[1].json()])
        console.log(data[0])
    }
}