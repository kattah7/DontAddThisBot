const got = require('got');
const humanizeDuration = require('../humanizeDuration');
const utils = require('../util/utils.js');

module.exports = {
    name: 'subage',
    aliases: ['sa'],
    cooldown: 3000,
    description: 'Checks a subcribed age of a user',
    execute: async (message, args, client) => {
        const targetUser = args[0] ?? message.senderUsername;
        const targetChannel = args[1] ?? message.channelName;
        let userData = await got(`https://api.ivr.fi/twitch/subage/${targetUser}/${targetChannel}`, {
            timeout: 10000,
        }).json();
        //console.log(userData);

        if (userData.subscribed == false) {
            if (userData.cumulative.months == 0) {
                if (message.senderUsername == (await utils.PoroNumberOne())) {
                    client.privmsg(
                        message.channelName,
                        `.me ${targetUser} has never subbed to ${targetChannel} before. D:`
                    );
                } else {
                    return {
                        text: `${targetUser} has never subbed to ${targetChannel} before. D:`,
                    };
                }
            } else if (userData.cumulative.months > 0) {
                if (message.senderUsername == (await utils.PoroNumberOne())) {
                    client.privmsg(
                        message.channelName,
                        `.me ${targetUser} was previously subbed to ${targetChannel} for ${
                            userData.cumulative.months
                        } months. Expired at ${userData.cumulative.end.split('T')[0]} PoroSad`
                    );
                } else {
                    return {
                        text: `${targetUser} was previously subbed to ${targetChannel} for ${
                            userData.cumulative.months
                        } months. Expired at ${userData.cumulative.end.split('T')[0]} PoroSad`,
                    };
                }
            }
        } else if (userData.subscribed == true) {
            if (userData.meta.gift == null) {
                const ms = new Date().getTime() - Date.parse(userData.cumulative.end);
                const ms2 = new Date().getTime() - Date.parse(userData.meta.endsAt);
                if (message.senderUsername == (await utils.PoroNumberOne())) {
                    client.privmsg(
                        message.channelName,
                        `.me ${targetUser} is currently subbed to ${targetChannel} for ${
                            userData.cumulative.months
                        } months with a tier ${userData.meta.tier} ${
                            userData.meta.type
                        } sub. [Renews: ${humanizeDuration(ms)} / Expires: ${humanizeDuration(ms2)}] B)`
                    );
                } else {
                    return {
                        text: `${targetUser} is currently subbed to ${targetChannel} for ${
                            userData.cumulative.months
                        } months with a tier ${userData.meta.tier} ${
                            userData.meta.type
                        } sub. [Renews: ${humanizeDuration(ms)} / Expires: ${humanizeDuration(ms2)}] B)`,
                    };
                }
            } else if (userData.meta.gift.isgift == true) {
                const ms = new Date().getTime() - Date.parse(userData.cumulative.end);
                const ms2 = new Date().getTime() - Date.parse(userData.meta.endsAt);
                if (message.senderUsername == (await utils.PoroNumberOne())) {
                    client.privmsg(
                        message.channelName,
                        `.me ${targetUser} is currently gifted tier ${userData.meta.tier}, ${
                            userData.cumulative.months
                        } month sub to ${targetChannel} by ${userData.meta.gift.name}. [Renews: ${humanizeDuration(
                            ms
                        )} / Expires: ${humanizeDuration(ms2)}] HolidayPresent`
                    );
                } else {
                    return {
                        text: `${targetUser} is currently gifted tier ${userData.meta.tier}, ${
                            userData.cumulative.months
                        } month sub to ${targetChannel} by ${userData.meta.gift.name}. [Renews: ${humanizeDuration(
                            ms
                        )} / Expires: ${humanizeDuration(ms2)}] HolidayPresent`,
                    };
                }
            }
        }
    },
};
