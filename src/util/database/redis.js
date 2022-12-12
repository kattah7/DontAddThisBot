const Redis = require('ioredis');
const redis = new Redis({});

redis.on('error', (err) => {
	Logger.error(`Redis Error: ${err}`);
});

redis.on('ready', () => {
	Logger.info('Redis Connected');
});

module.exports.redis = redis;

module.exports.set = async (key, data, expiry = 120) => {
	if (expiry === 0) {
		await redis.set(key, JSON.stringify(data));
	} else {
		await redis.set(key, JSON.stringify(data), 'EX', expiry);
	}
};

module.exports.setpx = async (key, data, expiry = 120) => {
	if (expiry === 0) {
		await redis.set(key, JSON.stringify(data));
	} else {
		await redis.set(key, JSON.stringify(data), 'PX', expiry);
	}
};

module.exports.get = async (key) => {
	const data = await redis.get(key);
	if (!data) {
		return null;
	}
	return JSON.parse(data);
};

module.exports.del = async (key) => {
	await redis.del(key);
};

module.exports.getBase64 = async (name) => {
	const data = await redis.get(name);
	if (!data) {
		return null;
	}
	return JSON.parse(Buffer.from(data, 'base64'));
};

module.exports.setBase64 = async (name, data, expiry = 120) => {
	await redis.set(name, Buffer.from(JSON.stringify(data)).toString('base64'), 'EX', expiry);
};
