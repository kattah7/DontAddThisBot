const got = require("got")
const SevenTV = require("../node_modules/7tv/lib");
const api = SevenTV()
const utils = require('../util/utils.js');

module.exports = {
    name: "test1234",
    description: "Get user's 7tv profile picture",
    cooldown: 3000,
    execute: async(message, args, client) => {
        const { body: stv } = await got.post(`https://api.7tv.app/v2/gql`, {
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
            console.log(stv)
    }    
    }

