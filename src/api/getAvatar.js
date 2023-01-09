async function getAvatar(userID) {
	if (!userID || userID.length === 0) return [];
	const mapEditorIds = userID.map((editor) => editor.id);
	const avatar = await fetch(`https://api.ivr.fi/v2/twitch/user?id=${mapEditorIds.join(',')}`, {
		method: 'GET',
		'Content-Type': 'application/json',
		'User-Agent': 'IF YOU SEE THIS VI VON ZULUL',
	}).then((res) => res.json());

	const responseMapped = [];
	for (const { id, logo, login } of avatar) {
		if (!id || !logo || !login) continue;
		const { grantedAt } = userID.find((editor) => editor.id === id);
		responseMapped.push({
			username: login,
			id,
			avatar: logo,
			grantedAt,
		});
	}

	return responseMapped;
}

module.exports = { getAvatar };
