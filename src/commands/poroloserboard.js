module.exports = {
    name: "loserboard",
    cooldown: 5000,
    aliases: ["lb2"],
    description: "See loserboard of poro meat",
    poro: true,
    execute: async (message, args, client) => {
        const poroData = await bot.DB.poroCount.find({}).exec();
        const allUserLength = Number(poroData.length);
        const sorted = poroData.sort((a, b) => b.poroPrestige - a.poroPrestige || b.poroCount - a.poroCount);

        const top5 = sorted.slice(allUserLength - 5, allUserLength);
        const top5String = top5.map((user) => `${user.username} - [P:${user.poroPrestige}] ${user.poroCount.toLocaleString()} `).join(" | ");

        return {
            text: `kattahBAT Poro loserboard: ${top5String}`,
        };
    },
};