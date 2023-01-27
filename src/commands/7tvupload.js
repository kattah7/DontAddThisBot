const sizeOf = require('buffer-image-size');
const sharp = require('sharp');
const isAnimated = require('is-animated');
const { uploadEmote } = require('../token/stvREST.js');

module.exports = {
	tags: '7tv',
	name: '7tvupload',
	description: 'Upload an emote to 7TV!',
	aliases: ['upload'],
	cooldown: 3000,
	async execute(client, msg) {
		if (!msg.args[0]) {
			return {
				text: 'Please provide a URL to an image!',
				reply: true,
			};
		}

		if (!msg.args[1]) {
			return {
				text: 'Please provide a name for the emote!',
				reply: true,
			};
		}

		if (!/^[a-zA-Z0-9]+$/.test(msg.args[1])) {
			return {
				text: 'Please provide an english name for the emote!',
				reply: true,
			};
		}

		const emoteLink = msg.args[0];
		const maxSize = 7342592;
		try {
			const bufValue = await fetch(emoteLink).then((res) => res.arrayBuffer());
			let Buffered = Buffer.from(bufValue);

			const imageData = sizeOf(Buffered);
			let dimension = [imageData.width, imageData.height];

			let animated = isAnimated(Buffered);
			const sharpOptions = { animated: animated };

			if (Buffered.byteLength > maxSize || dimension[0] > 1000 || dimension[1] > 1000) {
				await client.say(msg.channel.login, "Your emote is too big! I'll try to resize it for you, but it might not work. If it doesn't, please resize it yourself and try again.");
				while (Buffered.byteLength > maxSize || dimension[0] > 1000 || dimension[1] > 1000) {
					dimension = dimension.map((dimension) => Math.floor((dimension *= 0.7)));
					const [x, y] = dimension;
					const resizeOptions = {
						width: x,
						height: y,
					};

					console.log(resizeOptions, sharpOptions, Buffered.byteLength);
					Buffered = await sharp(Buffered, sharpOptions).resize(resizeOptions).toBuffer();
				}
			}

			const sender = msg.user.login;
			const channel = msg.channel.login;
			const upload = await uploadEmote(Buffered, msg.args[1], sender, channel);
			if (upload.id) {
				return {
					text: `Successfully uploaded emote: https://7tv.app/emotes/${upload.id}`,
					reply: true,
				};
			}

			return {
				text: `Error uploading emote to 7TV.`,
				reply: true,
			};
		} catch (err) {
			return {
				text: 'Something went wrong! Please try again later.',
				reply: true,
			};
		}
	},
};
