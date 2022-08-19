module.exports = {
    name: "help",
    cooldown: 10000,
    poro: true,
    description: 'Bot help',
    execute: async(message, args, client) => {
        if (args[0]) {
            if (args[0].includes("vlb", "STVTokenAutoRefresh")) {
                return {
                    text: `Could not find command`,
                }
            }
    
            try {
                const commandFile = require(`../commands/${args[0] + ".js"}`);
                console.log(commandFile);
                const {name, aliases, cooldown, description} = commandFile;
                const doesAliasExist = aliases ? `${aliases.join(", ")}` : false;
                const doesDescExist = description ? `${description}` : false;
                const doesCooldownExist = cooldown ? `${cooldown / 1000}s` : false;
                return {
                    text: `Name: ${name} | Aliases: ${doesAliasExist} | Description: ${doesDescExist} | Cooldown: ${doesCooldownExist}`,
                }
            } catch (err) {
                return {
                    text: `Could not find command`,
                }
            }
        };

        return {
            text: `Check the bot's panels for more info kattahHappy`
        }
    }
}