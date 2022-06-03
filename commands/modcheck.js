const got = require("got");

module.exports = {
    name: "firstmod",
    aliases: ["fm"],
    cooldown: 3000,
    description:"First moderator of the channel",
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/modsvips/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        
        if (userData.status == 404) {
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me This channel doesnt have any moderators. PoroSad`)
            } else {
                return {
                    text: 'This channel doesnt have any moderators. PoroSad'
                }
            }
        } else {
            const vipmod = userData.mods.reduce((r, o) => o.grantedAt < r.grantedAt ? o : r); 
            if (message.senderUsername == process.env.NUMBER_ONE) {
                client.privmsg(message.channelName, `.me ${message.senderUsername}, First moderator of this channel is ${vipmod.login} and was modded at ${vipmod.grantedAt.split("T")[0]}. BatChest`)
            } else {
                return {
                    text: `${message.senderUsername}, First moderator of this channel is ${vipmod.login} and was modded at ${vipmod.grantedAt.split("T")[0]}. BatChest`,
                }
            }
        }
    },
};