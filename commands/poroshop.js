module.exports = {
    name: "poroshop",
    cooldown: 3000,
    description: "poro shop information to use poro meat",
    execute: async(message, args) => {
        return {
            text: `${message.senderUsername}, kattahDance Change bot color (100 poro 🥩)`
        }
    }
}