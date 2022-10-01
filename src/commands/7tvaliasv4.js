const { getUser } = require('../token/stvREST');
const { AliasSTVEmote } = require('../token/stvGQL');

module.exports = {
    tags: '7tv',
    name: `alias`,
    description: `alias 7tv emotes, |alias <emote> <name>`,
    aliases: ['rename'],
    cooldown: 5000,
    stv: true,
    stvOnly: true,
    execute: async (message, args, client, userdata, params) => {
        if (!args[0] || !args[1]) {
            return {
                text: `⛔ Please specify an ${args[0] ? `alias` : `emote`}`,
            };
        }
        const user = await getUser(message.channelID);
        if (user === null) {
            return {
                text: `⛔ Unknown user`,
            };
        }

        const { emote_set } = user;
        const findThatEmote = emote_set.emotes.find((x) => x.name === args[0]);
        if (!findThatEmote) {
            return {
                text: `⛔ Emote not found`,
            };
        }

        const isItNovember = new Date().getMonth() === 10 ? '7tvH' : '7tvM';
        const alias = await AliasSTVEmote(findThatEmote.id, emote_set.id, args[1]);
        if (alias.errors) {
            return {
                text: `⛔ ${alias.errors[0].extensions.message}`,
            };
        } else {
            return {
                text: `${isItNovember} "${findThatEmote.name}" renamed to "${args[1]}"`,
            };
        }
    },
};
