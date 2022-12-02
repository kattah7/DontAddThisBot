const { getUser } = require('../token/stvREST');
const { ParseUser, IDByLogin, sleep } = require('../util/twitch/utils');

module.exports = {
    tags: '7tv',
    name: '7tvemotes',
    aliases: ['emotes'],
    cooldown: 3000,
    description: 'Display all 7tv emotes in chat',
    stvOnly: true,
    botPerms: 'vip',
    execute: async (message, args, client) => {
        async function returnTargetID(targetName) {
            const targetUser = await ParseUser(targetName);
            const getUserID = await IDByLogin(targetUser);

            return getUserID;
        }

        const user = await getUser(args[0] ? await returnTargetID(args[0]) : message.channelID);
        const isSelfOrTarget = args[0] ?? message.channelName;
        if (!user || user === null) {
            return {
                text: `7tvM - ${isSelfOrTarget} does not have any 7tv emotes`,
            };
        }

        console;
        const { emotes } = user.emote_set;
        console.log(emotes);

        let emotesArray = new Array();
        let emotesLength = 0;

        for (let i = 0; i < emotes.length; i++) {
            const emote = emotes[i];

            if (emotesLength + emote.name.length + 1 > 490) {
                emotesArray.push(emotesLength);
                emotesLength = 0;
            }

            emotesArray.push(emote.name);
            emotesLength += emote.name.length + 1;
        }

        emotesArray.push(emotesLength);

        let emotesString = '';
        let emotesArrayIndex = 0;
        let emotesArrayLength = emotesArray.length;

        for (let i = 0; i < emotesArrayLength; i++) {
            const emote = emotesArray[i];

            if (typeof emote === 'number') {
                emotesString += emotesArray.slice(emotesArrayIndex, i).join(' ');
                emotesArrayIndex = i + 1;
                await client.say(message.channelName, emotesString);
                emotesString = '';
                await sleep(30);
            }
        }

        const capacity = user.emote_capacity;
        return {
            text: `7tvM - ${isSelfOrTarget} has ${emotes.length}/${capacity} 7tv emotes`,
        };
    },
};
