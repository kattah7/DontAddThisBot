const express = require('express');
const { backend } = require('../../config.json');
const parser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const { Logger, LogLevel } = require('../misc/logger');
const App = express();

const fs = require('fs');
const path = require('path');
const Path = './src/api/routes';

(async () => {
	for (const file of fs.readdirSync(Path)) {
		const subFolder = path.join(Path, file);
		const subFolderFiles = fs.readdirSync(subFolder);

		for (const subFile of subFolderFiles) {
			const Route = await require(`./routes/${file}/${subFile}`);
			App.use(Route);

			Logger.log(LogLevel.INFO, `[${file}] Endpoint ${subFile} is running!`);
		}
	}
})();

App.use(cors(), morgan('dev'), express.json(), parser());
App.listen(backend.port, () => {
	Logger.log(LogLevel.INFO, `API is running on port ${backend.port}`);
});
