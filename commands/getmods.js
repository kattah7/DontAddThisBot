const got = require('got');
const fetch = require('node-fetch');
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
            const getArtist = await fetch(`https://api.poros.lol/api/twitch/artist/${targetUser}`, {
                method: 'GET',
            })
            const getArtistJSON = await getArtist.json();
            console.log(getArtistJSON)
            const modsMapped = getModsNVips.mods.map(x => x.login + " (" + x.grantedAt.split("T")[0] + ")" + " - " + "[MOD]")
            const vipsMapped = getModsNVips.vips.map(x => x.login + " (" + x.grantedAt.split("T")[0] + ")" + " - " + "[VIP]")
            const artistMapped = getArtistJSON.artists.map(x => x.login + " (" + x.grantedAt.split("T")[0] + ")" + " - " + "[ARTIST]")
            const modsNvipsMapped = modsMapped.concat(vipsMapped, artistMapped)
            const { key } = await got
                .post(`https://haste.fuchsty.com/documents`, {
                    responseType: "json",
                    body: modsNvipsMapped.join("\n"),
                })
            .json();
            return {
                text: `https://haste.fuchsty.com/${key}.txt - [${modsMapped.length} mods, ${vipsMapped.length} vips, ${artistMapped.length} artists]`,
            }
        } catch (e) {
            console.log(e)
            return {
                text: "error",
            }
        }
    }
}