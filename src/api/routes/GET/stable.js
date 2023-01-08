const express = require('express');
const router = express.Router();

async function returnStable(ID) {
	const stable = await bot.DB.stable.findOne({ imageURL: ID });
	if (!stable) return null;
	const { id, username, createdAt, imageURL, prompt, images } = stable;

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

router.get('/api/bot/stable/:id', async (req, res) => {
	const { id } = req.params;
	if (!id) return res.status(400).json({ success: false, message: 'malformed id parameter' });
	const stable = await returnStable(id);
	if (!stable || stable === null) return res.status(404).json({ success: false, message: 'dalle not found' });
	return res.status(200).json({
		success: true,
		data: stable,
	});
});

module.exports = router;
