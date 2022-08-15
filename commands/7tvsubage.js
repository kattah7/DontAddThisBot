const got = require("got");
const humanizeDuration = require("../humanizeDuration");
const utils = require("../util/utils.js");

module.exports = {
  name: "7tvsa",
  cooldown: 1000,
  description: "Check user's 7tv subage YEAHBUT7TV",
  execute: async (message, args, client) => {
    const targetUser = await utils.ParseUser(args[0] ?? message.senderUsername);
    const pronouns =
      targetUser.toLowerCase() == message.senderUsername ? "Your" : "Their";
    const StvID = await utils.stvNameToID(targetUser);
    //console.log(StvID)
    const { body: Subage } = await got.get(
      `https://egvault.7tv.io/v1/subscriptions/${StvID}`,
      {
        responseType: "json",
        throwHttpErrors: false,
        timeout: 10000,
      }
    );
    //console.log(Subage)
    const ms = new Date().getTime() - Date.parse(Subage.end_at);
    const subDate = humanizeDuration(ms);

    if (!Subage.active) {
      return {
        text: `7tvM ${pronouns} sub is currently not active.`
      }
    } else {
      const renew = Subage.renew == true ? "renews" : "is ending";
      const username = await utils.STVIDtoName(Subage.subscription.customer_id)
      const gifter = Subage.subscription.customer_id !== Subage.subscription.subscriber_id ? `gifted by ${username.login}` : " ";
      const age = Subage.age / 30
      return {
        text: `7tvM ${pronouns} sub ${gifter} ${renew} in ${subDate} [${age} Months]`,
      };
    }
  },
};
