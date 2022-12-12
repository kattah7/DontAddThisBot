const { readdirSync } = require('fs');
const commands = new Map();
const aliases = new Map();

exports.startCmds = async () => {
	for (let file of readdirSync(`./src/commands/`).filter((file) => file.endsWith('.js'))) {
		let pull = require(`../../commands/${file}`);
		commands.set(pull.name, pull);
		if (pull.aliases && Array.isArray(pull.aliases))
			pull.aliases.forEach((alias) => aliases.set(alias, pull.name));
	}

	return { commands, aliases };
};
