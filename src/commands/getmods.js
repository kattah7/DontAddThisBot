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
            const userID = await utils.IDByLogin(targetUser);
            const query = [];
            query.push({
                operationName: 'UserRolesCacheQuery',
                variables: {
                    channelID: userID,
                    includeArtists: true,
                    includeEditors: false,
                    includeMods: false,
                    includeVIPs: false,
                },
                extensions: {
                    persistedQuery: {
                        version: 1,
                        sha256Hash: 'a0a9cd40e047b86927bf69b801e0a78745487e9560f3365fed7395e54ca82117',
                    },
                },
            });

            const { body: pogger } = await got.post('https://gql.twitch.tv/gql', {
                throwHttpErrors: false,
                responseType: 'json',
                headers: {
                    'Authorization': `OAuth ${process.env.TWITCH_GQL_TOKEN}`,
                    'Client-Id': `${process.env.CLIENT_ID_FOR_GQL}`,
                },
                json: query,
            });
            const {artists} = pogger[0].data;
            const artistsMapped = artists.edges.map(({node, grantedAt}) => ({id: node.id, login: node.login, displayName: node.displayName, grantedAt: grantedAt}));
            const modsMapped = getModsNVips.mods.map(x => x.login + " (" + x.grantedAt.split("T")[0] + ")" + " - " + "[MOD]")
            const vipsMapped = getModsNVips.vips.map(x => x.login + " (" + x.grantedAt.split("T")[0] + ")" + " - " + "[VIP]")
            const artistMapped = artistsMapped.map(x => x.login + " (" + x.grantedAt.split("T")[0] + ")" + " - " + "[ARTIST]")
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