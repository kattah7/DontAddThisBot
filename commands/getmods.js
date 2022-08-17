const got = require('got');
const utils = require('../util/utils.js');

module.exports = {
    name: "modvip",
    aliases: ["mv"],
    cooldown: 3000,
    async execute(message, args, client) {
        const targetUser = await utils.ParseUser(args[0] ?? message.channelName);
        if (!/^[A-Z_\d]{2,26}$/i.test(targetUser)) {
            return {
                 text: "malformed username parameter",
            }
        }
        try {
            const { body: getModsNVips } = await got.get(`https://api.ivr.fi/v2/twitch/modvip/${targetUser}?skipCache=false`, {
                throwHttpErrors: false,
                responseType: 'json',
            })
            const modsMapped = getModsNVips.mods.map(x => x.login + " (" + x.grantedAt.split("T")[0] + ")" + " - " + "[MOD]")
            const vipsMapped = getModsNVips.vips.map(x => x.login + " (" + x.grantedAt.split("T")[0] + ")" + " - " + "[VIP]")
            const modsNvipsMapped = modsMapped.concat(vipsMapped)
            const { key } = await got
                .post(`https://haste.fuchsty.com/documents`, {
                    responseType: "json",
                    body: modsNvipsMapped.join("\n"),
                })
            .json();
            return {
                text: `https://haste.fuchsty.com/${key}.txt - [${modsMapped.length} mods, ${vipsMapped.length} vips]`,
            }
        } catch (e) {
            console.log(e)
            return {
                text: "error",
            }
        }
    }
}