module.exports = {  
    name: "cookie",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        let timerId = setTimeout(function tick() {
            console.log("!cookie")
            return {
                text: `${message.senderUsername}, ${"!cookie"}`,
            };
            timerId = setTimeout(tick, 2000); // (*)
          }, 2000);
    },
}
