const got = require("got");

module.exports = {
    name: "info",
    aliases: [],
    cooldown: 3000,
    description:"Gets basic information of a user",
    execute: async (message, args) => {
        const targetUser = args[0] ?? message.senderUsername;
        let { body: userData, statusCode } = await got(`https://api.ivr.fi/twitch/resolve/${targetUser}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
        
        return {
            text: `${message.senderUsername}, ${targetUser} is currently equipping  ${userData.badge.length > 0 ? userData.badge[0].title : "No Badge"} BatChest and their preferred language is ${userData.settings.preferredLanguageTag} FeelsDankMan and is ${userData.roles.isAffiliate ? "Affiliate ✅" : "not a Affiliate ❌"} peepoHappy and is ${userData.roles.isPartner ? "Partner ✅" : "not a Partner ❌"} imGlitch and is ${userData.roles.isSiteAdmin ? "Admin ✅" : "not a Admin ❌"} monkaS and is ${userData.roles.isStaff ? "Staff ✅" : "not a Staff ❌"} monkaOMEGA`,
        }

    },
};