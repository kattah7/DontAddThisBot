const utils = require("../util/utils.js");

module.exports = {
    name: "test123",
    execute: async(message, args, client) => {
        console.log(await utils.getPFP(args[0]))
    }
}