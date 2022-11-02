module.exports = {
    name: 'commandstest',
    aliases: ['commandstest'],
    cooldown: 3000,
    execute: async (message, args, client) => {
        if (args[0].includes('vlb', 'STVTokenAutoRefresh')) {
            return {
                text: `Could not find command`,
            };
        }

        try {
            const commandFile = require(`../commands/${args[0] + '.js'}`);
            console.log(commandFile);
            const { name, aliases, cooldown, description } = commandFile;
            const doesAliasExist = aliases ? `${aliases.join(', ')}` : false;
            const doesDescExist = description ? `${description}` : false;
            const doesCooldownExist = cooldown ? `${cooldown}` : false;
            return {
                text: `Name: ${name} | Aliases: ${doesAliasExist} | Description: ${doesDescExist} | Cooldown: ${doesCooldownExist}`,
            };
        } catch (err) {
            return {
                text: `Could not find command`,
            };
        }
    },
};
