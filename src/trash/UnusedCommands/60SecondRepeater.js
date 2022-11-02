require('dotenv').config();
const got = require('got');

module.exports = {
    name: 'test2',
    cooldown: 10000,
    description: 'Test',
    execute: async (message, args, client) => {
        sendNotification = async () => {
            var kek = 0;
            test = setInterval(async () => {
                kek = kek + 1;

                console.log(`hello world, ${kek}`);
            }, 60000);
        };

        sendNotification();
    },
};
