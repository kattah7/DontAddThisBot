const got = require('got');
const utils = require('../util/utils.js');

module.exports = {
    name: 'ezgif',
    cooldown: 5000,
    description: 'ezgif twitch, 7tv emotes (Usage: |ezgif (emote) (twitch or 7tv), bttv and ffz not supported KEKW)',
    execute: async (message, args, client) => {
        if (!args[0]) {
            if (message.senderUsername == (await utils.PoroNumberOne())) {
                client.privmsg(message.channelName, `.me insert an emote lol`);
            } else {
                return {
                    text: `insert an emote lol`,
                };
            }
        }
        if (!args[1]) {
            if (message.senderUsername == (await utils.PoroNumberOne())) {
                client.privmsg(message.channelName, `.me um you gotta do either put '7tv' or 'twitch' after the emote`);
            } else {
                return {
                    text: `um you gotta do either put '7tv' or 'twitch' after the emote`,
                };
            }
        }
        if (args[0] == `7tv` || args[0] == `twitch`) {
            if (message.senderUsername == (await utils.PoroNumberOne())) {
                client.privmsg(
                    message.channelName,
                    `.me Usage |ezgif (emote) (twitch or 7tv), bttv and ffz not supported KEKW`
                );
            } else {
                return {
                    text: `Usage |ezgif (emote) (twitch or 7tv), bttv and ffz not supported KEKW`,
                };
            }
        }
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/v2/twitch/emotes/${args[0]}`, {
            timeout: 10000,
            throwHttpErrors: false,
            responseType: 'json',
        });
        const { body: stv } = await got.post(`https://api.7tv.app/v2/gql`, {
            throwHttpErrors: false,
            responseType: 'json',
            json: {
                query: 'query GetUser($id: String!) {user(id: $id) {...FullUser,, banned, youtube_id}}fragment FullUser on User {id,email, display_name, login,description,role {id,name,position,color,allowed,denied},emote_aliases,emotes { id, name, status, visibility, width, height },owned_emotes { id, name, status, visibility, width, height },emote_ids,editor_ids,editors {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},editor_in {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},follower_count,broadcast {type,title,game_name,viewer_count,},twitch_id,broadcaster_type,profile_image_url,created_at,emote_slots,audit_entries {id,type,timestamp,action_user_id,action_user {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},changes {key, values},target {type,data,id},reason}}',
                variables: {
                    id: `${message.channelName}`,
                },
            },
        });
        const { body: pogger, statusCode2 } = await got.post(`https://api.7tv.app/v2/gql`, {
            throwHttpErrors: false,
            responseType: 'json',
            json: {
                query: 'query($query: String!,$page: Int,$pageSize: Int,$globalState: String,$sortBy: String,$sortOrder: Int,$channel: String,$submitted_by: String,$filter: EmoteFilter) {search_emotes(query: $query,limit: $pageSize,page: $page,pageSize: $pageSize,globalState: $globalState,sortBy: $sortBy,sortOrder: $sortOrder,channel: $channel,submitted_by: $submitted_by,filter: $filter) {id,visibility,owner {id,display_name,role {id,name,color},banned}name,tags}}',
                variables: {
                    channel: null,
                    globalState: null,
                    limit: 16,
                    page: 1,
                    pageSize: 16,
                    query: `${args[0]}`,
                    sortBy: 'popularity',
                    sortOrder: 0,
                    submitted_by: null,
                },
            },
        });

        //console.log(stv.data.user.emotes);

        if (args[1] == '7tv') {
            const findChannelEmote = stv.data.user.emotes.find((emote) => emote.name === args[0]);
            if (!findChannelEmote) {
                return {
                    text: `https://ezgif.com/webp-to-png?url=https://cdn.7tv.app/emote/${pogger.data.search_emotes[0].id}/4x`,
                };
            }
            return {
                text: `https://ezgif.com/webp-to-png?url=https://cdn.7tv.app/emote/${findChannelEmote.id}/4x`,
            };
        }
        if (args[1] == 'twitch') {
            if (userData.statusCode == 404) {
                return {
                    text: `${userData.message} lol`,
                };
            } else {
                return {
                    text: `https://ezgif.com/webp-to-png?url=${userData.emoteURL.replace('1.0', '4.0')}`,
                };
            }
        }
    },
};
