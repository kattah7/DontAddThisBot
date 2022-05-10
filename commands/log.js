module.exports = {  
    name: "cookie",
    aliases: [],
    cooldown: 3000,
    execute: async (message, args) => {
        let timerId = setTimeout(function tick() {
            console.log("forsen")
            return {
                text: `${message.senderUsername}, ${"forsen"}`,
            };
            timerId = setTimeout(tick, 2000); // (*)
          }, 2000);
    },
}
