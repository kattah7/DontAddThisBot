module.exports = {
    tags: 'poro',
    name: 'addcode',
    cooldown: 5000,
    description: 'add code',
    poro: true,
    poroRequire: true,
    execute: async (message, args, client) => {
        if (args.length < 2) {
            return {
                text: `invalid args`,
            };
        }
        // args[0] is code
        // args[1+] is hint
        await bot.DB.codes.create({
            code: args.shift(),
            hint: args.join(" ") 
        })
        
    }
};
