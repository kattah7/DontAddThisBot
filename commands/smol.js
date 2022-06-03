module.exports = {
    name: "smol",
    aliases: [],
    cooldown: 3000,
    description:"smol emotes",
    execute: async (message, args, client) => {
        if (message.senderUsername == process.env.NUMBER_ONE) {
            client.privmsg(message.channelName, `.me Okaygi peepoShi Comfi Madgi Madgi Praygi 7Homis Donki Homi Pepegi Peepi peepiWTF Weirdgi pepegaSitty Susgi Apugi Strongi Painsgi `)
        } else {
            return {
                text: 'Okaygi peepoShi Comfi Madgi Madgi Praygi 7Homis Donki Homi Pepegi Peepi peepiWTF Weirdgi pepegaSitty Susgi Apugi Strongi Painsgi '
            }
        }
        
    },
};