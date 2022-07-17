const utils = require('../util/utils.js');

module.exports = {
    name: "test",
    aliases: [],
    cooldown: 10000,
    description: "Test",
    execute: async (message, args, client) => {
        console.log(await utils.PoroNumberOne());
    }
}