module.exports = {
    name: "poroshop",
    cooldown: 3000,
    description: "poro shop information to use poro meat",
    aliases: ["shop"],
    poro: true,
    execute: async(message, args) => {
        return {
            text: `${message.senderUsername}, kattahDance setcolor Change bot color (50 poro 🥩) | cdr to reset timer (5 poro 🥩) | addbadge to bot ["glhf-pledge", "no_audio", "premium", "no_video"] (50 poro 🥩) | delbadge to remove all badges (50 poro 🥩)`
        }
    }
}