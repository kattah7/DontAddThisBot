const express = require('express');
const router = express.Router();

async function returnDalle(ID) {
	const dalle = await bot.DB.dalle.findOne({ imageURL: ID });
	if (!dalle) return null;
	const { id, username, createdAt, imageURL, prompt, images } = dalle;

	let imageBase64 = [];
	for (const encoded of images) {
		imageBase64.push(encoded.imageURL);
	}

	return {
		id,
		username,
		createdAt,
		imageURL,
		prompt,
		imageBase64,
	};
}

router.get('/api/bot/dalle/:id', async (req, res) => {
	const { id } = req.params;
	if (!id) return res.status(400).json({ success: false, message: 'malformed id parameter' });
	const dalle = await returnDalle(id);
	if (!dalle || dalle === null) return res.status(404).json({ success: false, message: 'dalle not found' });
	return res.status(200).json({
		success: true,
		data: dalle,
	});
});

module.exports = router;
