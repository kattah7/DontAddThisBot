const fs = require('fs/promises');

module.exports = {
    name: "setcode",
    cooldown: 5000,
    description: "check poro count of user",
    level: 3,
    execute: async (message, args, client, userdata, params, channelData) => {
        if (!args[0]) {
            return {
                text: `insert code lol`,
            };
        }
        
        var code = {
            code: args.join(" "),
        };
        
        await fs.writeFile('util/porocodes.json', JSON.stringify(code) + '\n', encoding="utf8");
        return {
            text: `code set!`,
        };
    }
}