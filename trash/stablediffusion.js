const { shortenText } = require('../src/misc/utility');
const { stable } = require('../src/token/diffusion');

async function createDocument(id, username, createdAt, imageUrl, prompt) {
	const newImage = new bot.DB.stable({
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
	description: 'Generate an AI Image using Stable Diffusion',
	aliases: ['sd', 'stable'],
	cooldown: 5000,
	execute: async (client, msg) => {
		const input = msg.args.join(' ');
		await client.say(msg.channel.login, shortenText(`Generating Stable Diffusion of "${input}"... kattahTo`));

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
			text: `Stable Diffusion of "${input}", https://poros.lol/stable/${code}`,
			reply: true,
		};
	},
};
