const { stable } = require('../token/diffusion');

async function createDocument(id, username, createdAt, imageUrl, prompt) {
	const newImage = new bot.DB.dalle({
		id: id,
		username: username,
		createdAt: createdAt,
		imageURL: imageUrl,
		prompt: prompt,
	});
	await newImage.save();

	return newImage;
}

module.exports = {
	tags: 'fun',
	name: 'stablediffusion',
	description: 'Diffuse a message to all channels',
	aliases: ['sd', 'stable'],
	cooldown: 5000,
	execute: async (client, msg) => {
		const input = msg.args.join(' ');
		const { output, code } = await stable(input);

		if (!output || output === null)
			return {
				text: 'Something went wrong',
				reply: true,
			};

		const createDoc = await createDocument(msg.user.id, msg.user.login, new Date(), code, input);
		for (const image of output.data[0]) {
			await createDoc.updateOne({
				$push: {
					images: [
						{
							imageURL: image,
						},
					],
				},
			});
		}

		return {
			text: `Stable Diffusion of "${input}", https://poros.lol/dall-e/${code}`,
			reply: true,
		};
	},
};
