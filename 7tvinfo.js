const got = require("got")

module.exports = {
  name: "kekpoggers",
  cooldown: 1000,
  execute: async(message, args, client) => {
    const targetUser = args[0] ?? message.senderUsername
    let { body: userData, statusCode } = await got(`https://api.7tv.app/v2/users/${targetUser.toLowerCase()}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        console.log(userData)

    const { body: kekwxd } = await got.post(`https://api.7tv.app/v2/gql`, {
            throwHttpErrors: false,
            responseType: 'json',
            json: {
                "query": "query GetUser($id: String!) {user(id: $id) {...FullUser,, banned, youtube_id}}fragment FullUser on User {id,email, display_name, login,description,role {id,name,position,color,allowed,denied},emote_aliases,emotes { id, name, status, visibility, width, height },owned_emotes { id, name, status, visibility, width, height },emote_ids,editor_ids,editors {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},editor_in {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},follower_count,broadcast {type,title,game_name,viewer_count,},twitch_id,broadcaster_type,profile_image_url,created_at,emote_slots,audit_entries {id,type,timestamp,action_user_id,action_user {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},changes {key, values},target {type,data,id},reason}}",
                "variables": {
                    "id": userData.id
                }
            }
        })
        console.log(kekwxd)
        

        return { text: `${kekwxd.data.user.created_at} & ${kekwxd.data.user.profile_image_url}`}
  }
}