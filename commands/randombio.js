const got = require("got")

module.exports = {
    name: "randombio",
    description: "gets random bio in the channel",
    cooldown: 3000,
    aliases: ['rb'],
   execute: async(message, args) => {
       const { chatters } = await got(`http://tmi.twitch.tv/group/user/${message.channelName}/chatters`).json();
       var allChatters = [...chatters.broadcaster, ...chatters.moderators, ...chatters.vips, ...chatters.viewers];
       var randomChatters = allChatters[Math.floor(Math.random()* allChatters.length)]
       console.log(randomChatters)
       const bio  = await got(`https://api.twitch.tv/helix/users?login=${randomChatters}`, {
           headers: {
               Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
               "Client-ID": process.env.CLIENT_ID,
           }
       }).json();
       
       return {
           text: `${bio.data[0].description}`
       }
   }
}