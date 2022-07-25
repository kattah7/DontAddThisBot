const got = require('got');

module.exports = {
    name: 'vlb',
    cooldown: 3000,
    level: 3,
    execute: async (message, args, client) => {
        client.say(message.channelName, `This will take a bit... kattahSpin`);
        let { body: userData, statusCode } = await got(`https://api.twitchinsights.net/v1/bots/online`, {
            timeout: 30000,
            throwHttpErrors: true,
            responseType: 'json',
        });
        let { body: userData2, statusCode2 } = await got(`https://api.twitchinsights.net/v1/game/all`, {
            timeout: 10000,
            throwHttpErrors: false,
            responseType: 'json',
        });
        console.log(userData, userData2);
        if (!args[0]) {
            userData.bots[0].pop();
            userData.bots[1].pop();
            userData.bots[2].pop();
            userData.bots[3].pop();
            userData.bots[4].pop();
            return {
                text: `#1 ${userData.bots[0].join(', ')} Channels | #2 ${userData.bots[1].join(
                    ', '
                )} Channels | #3 ${userData.bots[2].join(', ')} Channels | #4 ${userData.bots[3].join(
                    ', '
                )} Channels | #5 ${userData.bots[4].join(', ')} Channels | `,
            };
        }
        let kek = 0;
        if (args[0] == 'cult') {
            for (const userDatas of userData.bots) {
                if (
                    userDatas.includes('aliengathering') ||
                    userDatas.includes('0turt') ||
                    userDatas.includes('0liavanna') ||
                    userDatas.includes('0maisie') ||
                    userDatas.includes('apumusic') ||
                    userDatas.includes('0ax2') ||
                    userDatas.includes('dankingaround') ||
                    userDatas.includes('iizzybeth') ||
                    userDatas.includes('alienconglomeration')
                ) {
                    userDatas.pop();
                    userDatas.shift();
                    const str1 = `${userDatas.join(', ')}`;
                    const result = Number(str1.replace(/,/g, ''));
                    kek += result;
                }
            }
            return {
                text: `Currently in total of ${kek.toLocaleString()} Live Channels 🕵🏼‍♂`,
            };
        }

        if (args[0] == 'supa') {
            for (const userDatas of userData.bots) {
                if (userDatas.includes('supa8') || userDatas.includes('0_supa')) {
                    userDatas.pop();
                    userDatas.shift();
                    const str1 = `${userDatas.join(', ')}`;
                    const result = Number(str1.replace(/,/g, ''));
                    kek += result;
                }
            }
            return {
                text: `Currently in total of ${kek.toLocaleString()} Live Channels 👌`,
            };
        }
        const { chatters } = await got(`https://tmi.twitch.tv/group/user/${args[0].toLowerCase()}/chatters`).json();
        const BRUH = chatters.viewers.length;
        console.log(BRUH);
        let xd = 0;
        let xd2 = 0;

        for (const data of userData2.games) {
            try {
                xd += data.streamers;
                xd2 += data.viewers;
            } catch (err) {
                console.error(`error`, err);
            }
        }
        for (const userDatas of userData.bots) {
            if (userDatas.includes(args[0])) {
                const rank = parseInt(userData.bots.findIndex((e) => e[0] === args[0].toLowerCase())) + 1 ?? 0;
                userDatas.pop();
                console.log(userDatas.length);
                return {
                    text: `#${rank}, @${userDatas.join(', ')}/${xd} Channels, Currently ${BRUH} users in viewerlist.`,
                };
            }
        }
    },
};
