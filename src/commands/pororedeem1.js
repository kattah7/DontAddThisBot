const humanizeDuration = require('../util/humanizeDuration');
const crypto = require("crypto");

module.exports = {
    tags: 'poro',
    name: 'redeem',
    cooldown: 5000,
    description: 'Redeem poro meat with speical codes',
    poro: true,
    poroRequire: true,
    execute: async (message, args, client) => {
        if (!args[0]) {
            return {
                text: `insert code lol`,
            };
        }
        const channelData = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec();
        if (!channelData) {
            return {
                text: `kattahHappy you arent registered! ${message.senderUsername} type |poro to get started.`,
            };
        }
        const lastUsage = await bot.Redis.get(`pororedeem:${message.senderUserID}`);
        const input = args[0];
        const codes = await bot.DB.codes.find({}).sort({code: 'asc'}).exec();
        
        const now = new Date().toISOString().split("T")[0];
        const userId = message.senderUserID
        const hash = crypto.createHash("shake256", {outputLength: 8}).update(now+String(userId)).digest("hex")
        const codeIndex = parseInt(hash, 16) % codes.length;

        if (codes.length == 0) {
            return {
                text: "no codes"
            }
        }

        if (lastUsage) {
            if (new Date().getTime() - new Date(lastUsage).getTime() < 1000 * 60 * 60 * 24) {
                const ms = new Date(lastUsage).getTime() - new Date().getTime() + 1000 * 60 * 60 * 24;
                return {
                    text: `${
                        message.senderUsername
                    }, You have already redeemed the code! Come back in ${humanizeDuration(ms)} for daily codes`,
                };
            }
        }

        if(input != codes[codeIndex].code) {
            return {
                text: `${message.senderUsername}, Wrong code :p check the site for hint`,
            };
        }
        await bot.DB.poroCount
            .updateOne({ id: message.senderUserID }, { $set: { poroCount: channelData.poroCount + 50 } })
            .exec();
        await bot.Redis.set(`pororedeem:${message.senderUserID}`, Date.now(), 0);
        return {
            text: `Code Redeemed! ${message.senderUsername} (+50) kattahDance2 total [P:${channelData.poroPrestige}] ${
                channelData.poroCount + 50
            } meat`,
        };
    },
};
