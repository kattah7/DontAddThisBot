const got = require('got');

async function GenerateImage(Input) {
	const { body } = await got.post('https://bf.dallemini.ai/generate', {
		method: 'POST',
		responseType: 'json',
		headers: {
			Referer: 'https://hf.space/',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
		},
		json: {
			prompt: Input,
			model: 'dalle',
		},
		timeout: {
			request: 300_000,
		},
		throwHttpErrors: false,
	});

	const { images } = body;
	const hash = require('crypto').createHash('sha512');
	for (const base64Image of images) {
		hash.update(base64Image);
	}

	const jsonImageData = images.map((i) => i.replace(/\\n/g, ''));
	return jsonImageData;
}

module.exports = { GenerateImage };
