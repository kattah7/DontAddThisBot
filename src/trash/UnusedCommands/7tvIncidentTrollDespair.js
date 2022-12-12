const got = require('got');
const { ConsoleMessage } = require('puppeteer');

module.exports = {
	name: 'test',
	aliases: [],
	cooldown: 10000,
	description: 'Test',
	level: 3,
	execute: async (message, args, client) => {
		const GetChannels = async () => {
			const { body: kek } = await got.post(`https://7tv.io/v3/gql`, {
				// find emotes
				throwHttpErrors: false,
				responseType: 'json',
				json: {
					operationName: 'GetEmoteChannels',
					query: 'query GetEmoteChannels($id: ObjectID!, $page: Int, $limit: Int) {\n  emote(id: $id) {\n    id\n    channels(page: $page, limit: $limit) {\n      total\n      items {\n        id\n        username\n        display_name\n        avatar_url\n        tag_color\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}',
					variables: {
						id: '60ae958e229664e8667aea38',
						limit: 50,
						page: args[0],
					},
				},
			});
			const GiveEditor = async () => {
				const channels = kek.data.emote.channels.items;
				//console.log(channels)
				for (const channel of channels) {
					try {
						const { body: poggers } =
							await got.post(
								`https://7tv.io/v2/gql`,
								{
									throwHttpErrors: false,
									responseType: 'json',
									headers: {
										Authorization: process
											.env
											.STV_AUTH,
									},
									json: {
										query: 'mutation AddChannelEditor($ch: String!, $em: String!, $re: String!) {addChannelEditor(channel_id: $ch, editor_id: $em, reason: $re) {id,editor_ids,editors {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids}}}',
										variables: {
											ch: '629d77a20e60c6d53da64e38',
											em: channel.id,
											re: '',
										},
									},
								},
							);
						console.log(
							`Joined ${
								channel.id
							}, ${new Date()}`,
						);
						console.log(poggers);
					} catch (err) {
						console.error(
							`Failed to join channel ${channel.id}`,
							err,
						);
					}
				}
			};

			GiveEditor();
		};
		GetChannels();
	},
};
