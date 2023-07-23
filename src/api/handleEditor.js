async function handleEditor(req, res, next) {
	const channelEditors = await bot.DB.channels.findOne({ id: req.body.channelID }).exec();
	if (!channelEditors) {
		return res.status(404).json({
			success: false,
			message: 'Channel not found',
		});
	}

	const editorsMapped = new Set(channelEditors.editors.map((editor) => editor.id));
	if (
		req.user.id !== 137199626 && // This line checks if req.user.id is not equal to 137199626
		!editorsMapped.has(req.user.id) &&
		req.body.channelID !== req.user.id
	) {
		return res.status(403).json({
			success: false,
			message: 'Forbidden',
		});
	}
	next();
}

module.exports = { handleEditor };
