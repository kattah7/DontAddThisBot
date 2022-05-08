const got = require("got");

module.exports = {
    name: "modcheck",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/modsvips/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        
        if (userData.status == 404) {
            return {
                text: 'This channel doesnt have any moderators. PoroSad'
            }
        } else {
            const vipmod = userData.mods.reduce((r, o) => o.grantedAt < r.grantedAt ? o : r); 
            return {
                text: `${message.senderUsername}, First moderator of this channel is ${vipmod.login} and was modded at ${vipmod.grantedAt.split("T")[0]}. BatChest`,
            }
        }
    },
};