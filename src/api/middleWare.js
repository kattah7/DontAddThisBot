const { token } = require('../../config.json');
const jwt = require('jsonwebtoken');

async function middleWare(req, res, next) {
	const AuthHeaders = req.headers.authorization;
	const AuthToken = AuthHeaders && AuthHeaders.split(' ')[1];
	if (AuthToken == null || !AuthToken) return res.status(401).send({ success: false, message: 'Unauthorized' });

	const loggedOutTokens = await bot.SQL.query(`SELECT * FROM logout_token WHERE jwt_token = '${AuthToken}'`);
	if (loggedOutTokens.rowCount > 0) return res.status(401).send({ success: false, message: 'Unauthorized' });

	try {
		const decoded = jwt.verify(AuthToken, token.key);
		if (!decoded) return res.status(401).send({ success: false, message: 'Unauthorized' });

		const { id, login } = decoded;
		if ((!login && !id) || !/^[A-Z_\d]{2,30}$/i.test(login)) {
			return res.status(400).json({
				success: false,
				message: 'malformed username parameter',
			});
		}

		const userLevel = await bot.DB.users.findOne({ id: id }).exec();
		if (userLevel?.level < 1) {
			await bot.Redis.set(`xd:kattah:banned:${id}`, '1', 0);
			return res.status(403).json({
				success: false,
				message: 'Forbidden',
			});
		}

		const userRedis = await bot.Redis.get(`xd:kattah:banned:${id}`);
		if (userRedis === '1' && userLevel?.level < 1) {
			return res.status(403).json({
				success: false,
				message: 'Forbidden',
			});
		}

		await bot.Redis.del(`xd:kattah:banned:${id}`);
		await bot.Redis.del(`xd:kattah:banned:${login}`);
		req.user = decoded;
		next();
	} catch (e) {
		console.log(e);
		res.clearCookie('token');
		return res.status(401).send({ success: false, message: 'Unauthorized' });
	}
}

module.exports = { middleWare };
