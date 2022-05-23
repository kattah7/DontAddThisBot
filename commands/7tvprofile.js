const got = require("got")
const prettyjson = require('prettyjson')
const SevenTV = require("../node_modules/7tv/lib");
const api = SevenTV()

module.exports = {
  name: "7tv",
  cooldown: 1000,
  description: "Check user's 7tv info YEAHBUT7TV",
  execute: async(message, args) => {

    const targetUser = args[0] ?? message.senderUsername
    let { body: userData, statusCode } = await got(`https://api.7tv.app/v2/users/${targetUser.toLowerCase()}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
    console.log(userData)

    const { body: pogger, statusCode2 } = await got.post(`https://api.7tv.app/v2/gql`, {
            throwHttpErrors: false,
            responseType: 'json',
            json: {
                "query": "query GetUser($id: String!) {user(id: $id) {...FullUser,, banned, youtube_id}}fragment FullUser on User {id,email, display_name, login,description,role {id,name,position,color,allowed,denied},emote_aliases,emotes { id, name, status, visibility, width, height },owned_emotes { id, name, status, visibility, width, height },emote_ids,editor_ids,editors {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},editor_in {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},follower_count,broadcast {type,title,game_name,viewer_count,},twitch_id,broadcaster_type,profile_image_url,created_at,emote_slots,audit_entries {id,type,timestamp,action_user_id,action_user {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},changes {key, values},target {type,data,id},reason}}",
                "variables": {
                    "id": userData.id
                }
            }
        })
        const emotes = await api.fetchUser(`${targetUser.toLowerCase()}`);
        console.log(emotes.role);
        
        if (statusCode == 404) {
            return {
                text: `${targetUser} has no data on 7tv. YEAHBUT7TV 7tvM`
            }
        } else if (emotes.role.name == '') {
            return {
                text: `YEAHBUT7TV 7tvM ${pogger.data.user.display_name}'s Emote Slots ${pogger.data.user.emote_ids.length}/${pogger.data.user.emote_slots}, Created: ${pogger.data.user.created_at.split("T")[0]}, Editors: ${pogger.data.user.editor_ids.length}, Rank: None 7tv.app/users/${pogger.data.user.display_name}`
            }
        } else {
            return {
                text: `YEAHBUT7TV 7tvM ${pogger.data.user.display_name}'s Emote Slots ${pogger.data.user.emote_ids.length}/${pogger.data.user.emote_slots}, Created: ${pogger.data.user.created_at.split("T")[0]}, Editors: ${pogger.data.user.editor_ids.length}, Rank: ${emotes.role.name} 7tv.app/users/${pogger.data.user.display_name}`
            }
        }
  }
}