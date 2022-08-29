const humanizeDuration = require('../humanizeDuration');
const utils = require('../util/utils.js');
const discord = require('../util/discord.js');
const { randomInt } = require('crypto');

module.exports = {
    name: 'poro',
    cooldown: 5000,
    description: 'Get poro meat every 2 hour',
    poro: true,
    execute: async (message, args, client) => {
        const lastUsage = await bot.Redis.get(`poro:${message.senderUserID}`);
        const channelData = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
        const random = randomInt(-5, 27);
            if (!channelData) {
                const newChannel = new bot.DB.poroCount({
                    username: message.senderUsername,
                    id: message.senderUserID,
                    joinedAt: new Date(),
                    poroCount: 10,
                    poroPrestige: 0,
                });

                await newChannel.save();
                await bot.Redis.set(`poro:${message.senderUserID}`, Date.now(), 0);
                const Info = await utils.IVR(message.senderUserID);
                //console.log(Info)
                await discord.NewPoro(
                    Info.createdAt.split('T')[0],
                    message.senderUserID,
                    message.senderUsername,
                    message.channelName,
                    message.messageText,
                    Info.logo
                );

                return {
                    text: `New user! ${message.senderUsername} kattahDance2 here is free 10 poro meat 🥩`,
                };
            }

            if (lastUsage || channelData) {
                if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 2) {
                    const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 2;
                    return {
                            text: `No poros found... 🎇 kattahDespair ${message.senderUsername} | [P:${
                                channelData.poroPrestige
                            }] ${channelData.poroCount.toLocaleString()} meat total! 🥩  | Come back later in ${humanizeDuration(
                                ms
                            )}. kattahDance`,
                    };
                }
            }

            await bot.DB.poroCount
                .updateOne({ id: message.senderUserID }, { $set: { poroCount: channelData.poroCount + random } })
                .exec();

            await bot.Redis.set(`poro:${message.senderUserID}`, Date.now(), 0);
            console.log(random, message.channelName, message.senderUsername);
            if (random == 5 || random == 6 || random == 7 || random == 8 || random == 9) {
                return {
                    text: `Poro slaughtered! ${
                            message.senderUsername
                        } --> Tenderloin Poro kattahStare (+${random}) PoroSad [P:${channelData.poroPrestige}] ${
                            channelData.poroCount + random
                        } meat total!`,
                };
            } else if (random == 10 || random == 11 || random == 12 || random == 13 || random == 14 || random == 15) {
                return {
                    text: `Poro slaughtered! ${
                            message.senderUsername
                        } --> Wagyu Poro 🤤 (+${random}) kattahHappy [P:${channelData.poroPrestige}] ${
                            channelData.poroCount + random
                        } meat total!`,
                };
            } else if (random == -1 || random == -2 || random == -3 || random == -4 || random == -5) {
                return {
                        text: `Poro slaughtered! ${
                            message.senderUsername
                        } --> Rotten Poro DansGame (${random}) kattahBAT [P:${channelData.poroPrestige}] ${
                            channelData.poroCount + random
                        } meat total!`,
                };
            } else if (random == 1 || random == 2 || random == 3 || random == 4) {
                return {
                        text: `Poro slaughtered! ${
                            message.senderUsername
                        } --> Sirloin Poro OpieOP (+${random}) PoroSad [P:${channelData.poroPrestige}] ${
                            channelData.poroCount + random
                        } meat total!`,
                };
            } else if (random == 0) {
                return {
                    text: `Poro gone! ${
                            message.senderUsername
                        } --> Poro ran away haHAA (±${random}) kattahDespair [P:${channelData.poroPrestige}] ${
                            channelData.poroCount + random
                        } meat total!`,
                };
            } else if (random >= 16) {
                return {
                    text: `Poro slaughtered! ${
                            message.senderUsername
                        } --> LEGENDARY PORO VisLaud (+${random}) kattahXd [P:${channelData.poroPrestige}] ${
                            channelData.poroCount + random
                        } meat total!`,
                };
            }
    },
};
