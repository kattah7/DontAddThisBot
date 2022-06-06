const got = require("got")

module.exports = {
    name: "resize",
    cooldown: 5000,
    description: "resize twitch, 7tv, bttv, ffz emotes",
    execute: async(message, args, client) => {
        const { body: stv } = await got.post(`https://api.7tv.app/v2/gql`, {
            throwHttpErrors: false,
            responseType: 'json',
            json: {
                "query": "query GetUser($id: String!) {user(id: $id) {...FullUser,, banned, youtube_id}}fragment FullUser on User {id,email, display_name, login,description,role {id,name,position,color,allowed,denied},emote_aliases,emotes { id, name, status, visibility, width, height },owned_emotes { id, name, status, visibility, width, height },emote_ids,editor_ids,editors {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},editor_in {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},follower_count,broadcast {type,title,game_name,viewer_count,},twitch_id,broadcaster_type,profile_image_url,created_at,emote_slots,audit_entries {id,type,timestamp,action_user_id,action_user {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},changes {key, values},target {type,data,id},reason}}",
                "variables": {
                    "id": `${message.channelName}`
                }
            }
        })
        console.log(stv.data.user.emotes)
        for (const stvs of stv.data.user.emotes) {
            if (stvs.name.includes(args[0])) {
                return {
                    text: `https://ezgif.com/webp-to-png?url=https://cdn.7tv.app/emote/${stvs.id}/4x`
                }
            }
        }
    }
}