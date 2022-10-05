const humanizeDuration = require('../util/humanizeDuration');
const utils = require('../util/utils');

module.exports = {
    tags: 'poro',
    name: 'porogive',
    aliases: ['give', 'send'],
    cooldown: 5000,
    description: 'Give poro to other user',
    poro: true,
    execute: async (message, args, client) => {
        if (!args[0]) {
            // if no user is provided
            return {
                text: `Please provide a user. PoroSad`,
            };
        }
        if (!args[1]) {
            // if no amount is provided
            return {
                text: `Please provide amount. PoroSad`,
            };
        }
        if (isNaN(args[1]) || args[1].startsWith('-')) {
            // if amount is not a number
            return {
                text: `Please provide a valid amount. PoroSad`,
            };
        }
        const parseUser = await utils.ParseUser(args[0].toLowerCase());
        const recieverID = await utils.IDByLogin(parseUser);
        if (!recieverID) {
            // if user not found on twitch
            return {
                text: `User not found. PoroSad`,
            };
        }
        const channelData = await bot.DB.poroCount.findOne({ id: message.senderUserID }).exec(); // Gets channel data for senderID
        if (!channelData) {
            // if senderID data not found
            return {
                text: `You aren't registered. PoroSad type |poro to get started kattahHappy`,
            };
        }
        var today = new Date();
        const timestamp = new Date(channelData.joinedAt);
        const diffTime = Math.abs(today - timestamp);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const timeLeft = humanizeDuration(diffTime - 604800000);
        if (diffDays < 7) {
            // if user has not joined for more than 7 days
            return {
                text: `${message.senderUsername}, You must be registered for ${timeLeft} to use this command. kattahDespair`,
            };
        }
        const channelData2 = await bot.DB.poroCount.findOne({ id: recieverID }).exec(); // Gets channel data for poro reciever's ID
        if (!channelData2) {
            // if senderID has no channel data
            return {
                text: `${args[0]} isnt registered. PoroSad`,
            };
        }
        const timestamp2 = new Date(channelData2.joinedAt);
        const diffTime2 = Math.abs(today - timestamp2);
        const diffDays2 = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24));
        const timeLeft2 = humanizeDuration(diffTime2 - 604800000);
        if (diffDays2 < 7) {
            // if user has not joined for more than 7 days
            return {
                text: `${message.senderUsername}, ${args[0]} must be registered for ${timeLeft2} to recieve kattahDespair`,
            };
        }
        const findBlacklisted = await bot.DB.users.findOne({ id: recieverID }).exec(); // Gets bot data for poro reciever's ID
        const sendAmount = parseInt(args[1]); // sending amount
        const Amount = parseInt(channelData.poroCount); // senderID's poro count
        const Amount2 = parseInt(channelData2.poroCount); // recieverID's poro count
        if (findBlacklisted.level > 0) {
            // if reciever's ID is blacklisted then don't allow them to receive poro
            if (recieverID !== message.senderUserID) {
                // if reciever's ID is equals to senderID then don't allow them to receive poro
                if (Amount >= sendAmount) {
                    // if senderID has enough poro to send
                    if (Amount >= 100) {
                        // if senderID's poro count is greater than or equal to 100 then don't allow them to receive poro
                        await bot.DB.poroCount
                            .updateOne(
                                { id: message.senderUserID },
                                { $set: { poroCount: Amount - sendAmount } },
                                { multi: true }
                            )
                            .exec();
                        client.say(
                            message.channelName,
                            `${message.senderUsername}, You have ${Amount - sendAmount} now and ${args[0]} has ${
                                Amount2 + sendAmount
                            }`
                        );
                        const XD =
                            'https://discord.com/api/webhooks/997686324490424411/LSonbJ2jlJm0IIPUmavKP5S7LCz01V1SIVM4QhR5gwpe1mFHTgi6AQ3lxt797i1pqLaM';
                        const msg2 = {
                            embeds: [
                                {
                                    color: 0x0099ff,
                                    title: `${message.senderUsername}(ID:${message.senderUserID}) has given ${
                                        args[0]
                                    }(ID:${recieverID}) ${sendAmount} poro in #${message.channelName} ${
                                        Amount - sendAmount
                                    } ==> ${Amount2 + sendAmount}`,
                                    author: {
                                        name: 'Poro Logs',
                                        icon_url: `${await utils.getPFP(message.senderUsername)}`,
                                    },
                                    thumbnail: {
                                        url: `${await utils.getPFP(args[0])}`,
                                    },
                                    image: {
                                        url: `${await utils.getPFP(message.channelName)}`,
                                    },
                                    timestamp: new Date(),
                                    footer: {
                                        text: 'Pulled time',
                                        icon_url:
                                            'https://static-cdn.jtvnw.net/jtv_user_pictures/89049925-b020-436f-bf9e-6262c0bc6419-profile_image-600x600.png ',
                                    },
                                },
                            ],
                        };
                        fetch(XD + '?wait=true', {
                            method: 'POST',
                            headers: { 'content-type': 'application/json' },
                            body: JSON.stringify(msg2),
                        }).then((a) => a.json());
                        if (recieverID) {
                            await bot.DB.poroCount
                                .updateOne(
                                    { id: recieverID },
                                    { $set: { poroCount: Amount2 + sendAmount } },
                                    { multi: true }
                                )
                                .exec();
                        }
                    } else {
                        client.say(
                            message.channelName,
                            `${message.senderUsername}, You must have more than 100 poros kattahDance`
                        );
                    }
                } else {
                    client.say(
                        message.channelName,
                        `You dont have enough poro to give ${sendAmount} to ${args[0]} kattahDespair`
                    );
                }
            } else {
                client.say(message.channelName, `${message.senderUsername}, You can't give poro to yourself PoroSad`);
            }
        } else {
            client.say(message.channelName, `${args[0]} is blacklisted PoroSad`);
        }
    },
};
