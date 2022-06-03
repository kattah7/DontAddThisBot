const got = require("got")

module.exports = {
    name: "vlb",
    cooldown: 3000,
    execute: async(message, args, client) => {
        let { body: userData, statusCode } = await got(`https://api.twitchinsights.net/v1/bots/online`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        let { body: userData2, statusCode2 } = await got(`https://api.twitchinsights.net/v1/game/all`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        if (!args[0]) {
            userData.bots[0].pop()
            userData.bots[1].pop()
            userData.bots[2].pop()
            userData.bots[3].pop()
            userData.bots[4].pop()
            return {
                text: `#1 ${userData.bots[0].join(", ")} Channels | #2 ${userData.bots[1].join(", ")} Channels | #3 ${userData.bots[2].join(", ")} Channels | #4 ${userData.bots[3].join(", ")} Channels | #5 ${userData.bots[4].join(", ")} Channels | `
            }
        }
        const { chatters } = await got(`https://tmi.twitch.tv/group/user/${(args[0].toLowerCase())}/chatters`).json();
        const BRUH = chatters.viewers.length
        console.log(BRUH)
        let xd = 0;
        let xd2 = 0;
        for (const data of userData2.games) {
            try {
                xd += data.streamers
                xd2 += data.viewers
            } catch (err) {
                console.error(`error`, err);
            }
         }
        for (const userDatas of userData.bots) {
            if (userDatas.includes(args[0])) {
                userDatas.pop()
                console.log(userDatas.length)
                return {
                    text: `@${userDatas.join(", ")}/${xd} Channels, Currently ${BRUH} users in viewerlist.`
                } 
            }
        }   
    }
}