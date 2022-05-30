module.exports = {
    name: "leaderboard",
    cooldown: 3000,
    aliases: ["lb"],
    description: "See leaderboard of poro meat",
    execute: async (message, args, client) => {
        const poroData = await bot.DB.poroCount.find({}).exec();

        const sorted = poroData.sort((a, b) => b.poroCount - a.poroCount);

        const top5 = sorted.slice(0, 5);
        const top5String = top5.map((user) => `${user.username} - ${user.poroCount}`).join(" | ");

        return {
            text: `Poro leaderboard: ${top5String}`,
        };
    },
};