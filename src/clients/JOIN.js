const { client } = require('../util/connections.js');
// const { createListener } = require('../util/pubSub.js');
const { IDByLogin } = require('../util/utils.js');

const JOIN = async function () {
    client.on('JOIN', async ({ channelName }) => {
        Logger.info(`Joined channel ${channelName}`);
        const channelID = await IDByLogin(channelName);
        // createListener([`790623318.${[channelID]}`], ['chat_moderator_actions']);
    });
};

module.exports = { JOIN };
