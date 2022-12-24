const { GenerateImage } = require('../token/dalle.js');
const crypto = require('crypto');

function generateRandomString() {
	const buffer = crypto.randomBytes(16);
	const base64String = buffer.toString('base64');
	const base64UrlString = base64String.replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
	return base64UrlString.substring(0, 14);
}

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
	name: 'dalle',
	description: 'Create an AI imaged text',
	aliases: [],
	cooldown: 3000,
	async execute(client, msg) {
		if (!msg.args[0]) return { text: 'Please provide a prompt', reply: true };
		const prompt = msg.args.join(' ');
		await client.say(msg.channel.login, `Generating Image... kattahTo This wil ltake a while`);
		const dalleImages = await GenerateImage(prompt);
		if (!dalleImages) return { text: 'Failed to generate image, Try again later', reply: true };
		const createDoc = await createDocument(msg.user.id, msg.user.login, new Date(), generateRandomString(), prompt);
		for (const image of dalleImages) {
			const ImageUrl = `data:image/png;base64,${image}`;
			await createDoc.updateOne({
				$push: {
					images: [
						{
							imageURL: ImageUrl,
						},
					],
				},
			});
		}

		return {
			text: `https://poros.lol/dall-e/${createDoc.imageURL}`,
			reply: true,
		};
	},
};
