const crypto = require("crypto");

//used for debug purposes
module.exports = {
    tags: 'poro',
    name: 'getcode',
    cooldown: 5000,
    description: 'get code',
    poro: true,
    poroRequire: true,
    execute: async (message, args, client) => {
        const codes = await bot.DB.codes.find({}).sort({code: 'asc'}).exec();
        
        const now = new Date().toISOString().split("T")[0];
        const userId = message.senderUserID
        const hash = crypto.createHash("shake256", {outputLength: 8}).update(now+String(userId)).digest("hex")
        const codeIndex = parseInt(hash, 16) % codes.length;
        
        return {
            text: `index: ${codeIndex} | code: ${codes[codeIndex].code} | hint: ${codes[codeIndex].hint}`
        }
    }
};
