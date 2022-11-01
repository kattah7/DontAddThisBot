const { joiner: pool } = require('../connections');
const fetch = require('node-fetch');
const { joiner } = require('../../config.json');

async function joinChannels() {
    // async function get_channels() {
    //     let game_pagination = {
    //         pagination: {
    //             cursor: '',
    //         },
    //     };

    //     while (Object.keys(game_pagination.pagination).length != 0) {
    //         await new Promise((r) => setTimeout(r, 1200));
    //         let response = await fetch(
    //             `https://api.twitch.tv/helix/streams?first=100&after=${game_pagination.pagination.cursor}`,
    //             {
    //                 headers: {
    //                     'Client-ID': joiner.client_id,
    //                     'Authorization': `Bearer ${joiner.access_token}`,
    //                 },
    //                 method: 'GET',
    //             }
    //         );
    //         let json = await response.json();
    //         game_pagination = json;
    //         for (const streamer of json.data) {
    //             if (streamer['viewer_count'] > joiner.desired_viewcount) {
    //                 console.log(
    //                     `Skipping ${streamer['user_name']} because they have ${streamer['viewer_count']} viewers.`
    //                 );
    //                 continue;
    //             }
    //             pool.join(streamer['user_login']);
    //         }
    //     }
    // }
    // get_channels();
    const { channels } = await fetch(`https://api.poros.lol/api/bot/channels`, {
        method: 'GET',
    }).then((res) => res.json());
    for (const channel of channels) {
        pool.join(channel);
    }
}

module.exports = { joinChannels };
