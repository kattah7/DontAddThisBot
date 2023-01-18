const { GetUser } = require('../../token/stvGQL.js');

module.exports = {
	tags: 'stats',
	name: 'testasd',
	cooldown: 5000,
	description: 'Suggestion to the bot',
	execute: async (message, args, client) => {
		const user = await GetUser('60ae66f69627f9aff40e0c6d');

		console.log(user?.data.user);
	},
};
