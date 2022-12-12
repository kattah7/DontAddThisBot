const { token } = require('../../config.json');
const jwt = require('jsonwebtoken');

function middleWare(req, res, next) {
	const AuthHeaders = req.headers.authorization;
	const AuthToken = AuthHeaders && AuthHeaders.split(' ')[1];
	if (AuthToken == null || !AuthToken) return res.status(401).send({ success: false, message: 'Unauthorized' });

	try {
		const decoded = jwt.verify(AuthToken, token.key);
		if (!decoded) return res.status(401).send({ success: false, message: 'Unauthorized' });
		req.user = decoded;
		next();
	} catch (e) {
		res.clearCookie('token');
		return res.status(401).send({ success: false, message: 'Unauthorized' });
	}
}

module.exports = { middleWare };
