const got = require('got');

module.exports = {
    tags: '7tv',
    name: '7tvpfp',
    description: "Get user's 7tv profile picture",
    cooldown: 5000,
    aliases: [],
    stvOnly: true,
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.7tv.app/v2/users/${targetUser.toLowerCase()}`, {
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
                    id: userData.id,
                },
            },
        });
        //console.log(stv)

        return { text: `${stv.data.user.profile_image_url.replace('//', '')}` };
    },
};
