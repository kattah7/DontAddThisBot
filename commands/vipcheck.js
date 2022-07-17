const got = require("got");
const utils = require('../util/utils.js');

module.exports = {
    name: "firstvip",
    aliases: ["fv"],
    cooldown: 3000,
    description:"First VIP of the channel",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/modsvips/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        
        if (userData.status == 404) {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me This channel doesnt have any VIPS. PoroSad`)
            } else {
                return  {
                    text: `This channel doesnt have any VIPS. PoroSad`,
                }
            }
        } else {
            const vipmod2 = userData.vips.reduce((r, o) => o.grantedAt < r.grantedAt ? o : r);
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me ${message.senderUsername}, First VIP of this channel is ${vipmod2.login} and was VIPed at ${vipmod2.grantedAt.split("T")[0]}. BatChest`)
            } else {
                return {
                    text: `${message.senderUsername}, First VIP of this channel is ${vipmod2.login} and was VIPed at ${vipmod2.grantedAt.split("T")[0]}. BatChest`,
                }
            }   
        }
    },
};