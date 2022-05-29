const got = require("got");

module.exports = {
    name: "7tvemote",
    cooldown: 3000,
    description: "Check 7tv emote info",
    execute: async(message, args) => {
      const { body: pogger, statusCode2 } = await got.post(`https://api.7tv.app/v2/gql`, {
        throwHttpErrors: false,
        responseType: 'json',
        json: {
            "query": "query($query: String!,$page: Int,$pageSize: Int,$globalState: String,$sortBy: String,$sortOrder: Int,$channel: String,$submitted_by: String,$filter: EmoteFilter) {search_emotes(query: $query,limit: $pageSize,page: $page,pageSize: $pageSize,globalState: $globalState,sortBy: $sortBy,sortOrder: $sortOrder,channel: $channel,submitted_by: $submitted_by,filter: $filter) {id,visibility,owner {id,display_name,role {id,name,color},banned}name,tags}}",
            "variables": {
                channel: null,
                globalState: null,
                limit: 16,
                page: 1,
                pageSize: 16,
                query: `${args[0]}`,
                sortBy: "popularity",
                sortOrder: 0,
                submitted_by: null
            }
        }
    })
    console.log(pogger.data.search_emotes)
    if (pogger.data.search_emotes == '') {
        return {
            text: `yo`
        }
    }
    const { body: pogger2, statusCode3 } = await got.post(`https://api.7tv.app/v2/gql`, {
        throwHttpErrors: false,
        responseType: 'json',
        json: {
            "query": `{emote(id: \"${pogger.data.search_emotes[0].id}\") {...FullEmote}}fragment FullEmote on Emote {id,created_at,name,width, height,channel_count,channels {id, login, display_name, role {id, name, color, allowed, denied, position}, profile_image_url},owner {id,display_name, created_at, profile_image_url,role {id, name, color, allowed, denied, position}},visibility,mime,status,tags,audit_entries {id,type,timestamp,action_user_id,action_user {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},changes {key, values},target {type,data,id},reason}}`,
  
        }
    })
    
    console.log(pogger2.data.emote)
    if (!pogger.data.search_emotes == '') {
        return {
            text: `7TV Emote ${args[0]} by ${pogger2.data.emote.owner.display_name} | Created at: ${pogger2.data.emote.created_at.split("T")[0]} | Enabled users: ${pogger2.data.emote.channel_count} YEAHBUT7TV`
        }
    }
        }}