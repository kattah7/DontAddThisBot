const got = require("got")

module.exports = {
    name: "fcf",
    cooldown: 1000,
    description: "xd",
    aliases: ["firstchannelfollower"],
    execute: async(message, args) => {
        const query = []
        query.push({
            query: `{
                user(login: "kattah") {
                    followers(order: ASC, first: 10) {
                        edges {
                            followedAt
                            node {
                                login
                            }
                        }
                    }
                }
            }`
        })
      const { body: pogger, statusCode2 } = await got.post(`https://gql.twitch.tv/gql`, {
                throwHttpErrors: false,
                responseType: 'json',
                headers: {
                    Accept: "*/*",
                    "Accept-Language": "en-GB",
                    Authorization: `OAuth ${process.env.TWITCH_GQL_OAUTH_KEKW}`,
                    'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`,
                    'Client-Version': `${process.env.CLIENT_VERSION}`,
                    "Content-Type": "text/plain;charset=UTF-8",
                    Referer: `https://dashboard.twitch.tv/`,
                    'X-Device-Id': `${process.env.DEVICE_ID}`,
                   
                         },
                json: query
          })
          console.log(pogger[0].data.user.followers.edges)
          
        }
}