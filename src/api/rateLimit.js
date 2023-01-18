const rateLimit = require('express-rate-limit');

const limiter = (windowMs, max) =>
	rateLimit({
		windowMs, // 15 minutes
		max, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
		standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
		legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	});

module.exports = { limiter };
