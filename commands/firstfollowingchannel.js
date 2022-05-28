const got = require("got")

module.exports = {
    name: "fcf",
    cooldown: 3000,
    description: "Check your first follower.",
    aliases: ["firstchannelfollower"],
    execute: async(message, args) => {
        const targetUser = args[0] ?? message.senderUsername
        const query = []
        query.push({
            query: `{
                user(login: "${targetUser}") {
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
                    Authorization: `OAuth ignekhb97ginmr5t551093z72usw6x`,
                    'Client-Id': `kimne78kx3ncx6brgo4mv6wki5h1ko`,
                    'Client-Version': '9318b809-f01c-4431-a8d1-322b76e2f93a',
                    "Content-Type": "text/plain;charset=UTF-8",
                    Referer: `https://dashboard.twitch.tv/`,
                    'X-Device-Id': `6GMipFLR0IiymSrHsMi7W3ADq2oko6EV`,
                    'Connection': 'keep-alive',
                   
                         },
                json: query
          })
          console.log(pogger[0])
          if (pogger[0].data) {
              if (pogger[0].data.user == null) {
                  return {
                      text: `${targetUser} is either banned or doesnt exist.`
                  }
              } else if(pogger[0].data.user.followers.edges == null) {
                return {
                    text: `${targetUser} do not have any followers to display.`
                }
            }else if (pogger[0].data.user.followers.edges[0].node == null) {
                const DATE = pogger[0].data.user.followers.edges[0].followedAt
                    return {
                        text: `Seems like ${targetUser} blocked this person :p following since ${DATE.split("T")[0]}`
                    }
            } else {
                const NAME = pogger[0].data.user.followers.edges[0].node.login
                const DATE = pogger[0].data.user.followers.edges[0].followedAt
                return {
                    text: `${targetUser} first ever follower, ${NAME} has been following since ${DATE.split("T")[0]}`
                }
            }
}
}}