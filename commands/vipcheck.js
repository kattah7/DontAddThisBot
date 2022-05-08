const got = require("got");

module.exports = {
    name: "firstvip",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/modsvips/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        
        if (userData.status == 404) {
            return  {
                text: `This channel doesnt have any VIPS. PoroSad`,
            }
        } else {
            const vipmod2 = userData.vips.reduce((r, o) => o.grantedAt < r.grantedAt ? o : r);
            return {
                text: `${message.senderUsername}, First VIP of this channel is ${vipmod2.login} and was VIPed at ${vipmod2.grantedAt.split("T")[0]}. BatChest`,
            }     
        }
    },
};