const got = require("got")
const prettyjson = require('prettyjson')
const SevenTV = require("../node_modules/7tv/lib");
const api = SevenTV()
const humanizeDuration = require("../humanizeDuration");


module.exports = {
  name: "7tvsa",
  cooldown: 1000,
  execute: async(message, args) => {

    const targetUser = args[0] ?? message.senderUsername

    const TRIHARD = await api.fetchUser(`${targetUser.toLowerCase()}`);


    let { body: userData, statusCode } = await got(`https://egvault.7tv.app/v1/subscriptions/${TRIHARD.id}`, { timeout: 10000, throwHttpErrors: false, responseType: "json" });
       console.log(userData)
       const XDLOL = new Date().getTime() - Date.parse(userData.end_at.split("T")[0]) 
      if (userData) {
           if (userData.subscription == null) {
               if (userData.gifted_count > 0) {
                return {
                    text: `7tvM ${TRIHARD.display_name} does not have an active sub, but gifted ${userData.gifted_count} subs`
                }
               } else {
                   return {
                    text: `7tvM ${TRIHARD.display_name} does not have an active sub, and gifted 0 subs TriHard`
                   }
               }
           }
           if (!userData.subscription.gifter_id) {
               if (userData.renew == false) {
                return {
                    text: `7tvM ${TRIHARD.display_name} paid sub ends in ${humanizeDuration(XDLOL)}, Subscriber since ${userData.subscription.started_at.split("T")[0]}`
                }
               }
            return {
                text: `7tvM ${TRIHARD.display_name} paid sub renews in ${humanizeDuration(XDLOL)}, Subscriber since ${userData.subscription.started_at.split("T")[0]}`
            } 
           } else {
            const TRIHARD2 = await api.fetchUser(`${userData.subscription.gifter_id}`);
            console.log(TRIHARD2)
            return {
                 text: `7tvM ${TRIHARD.display_name}, sub gifted by ${TRIHARD2.display_name} ending in ${humanizeDuration(XDLOL)}` 
                } 
           }
       }
  }
}