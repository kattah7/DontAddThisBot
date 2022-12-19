const { createLogger, format, transports, Logger: WinstonLogger } = require('winston');
const chalk = require('chalk');

// export enum
const LogLevel = {
	ERROR: 'error',
	WARN: 'warn',
	INFO: 'info',
	VERBOSE: 'verbose',
	DEBUG: 'debug',
	SILLY: 'silly',
};

const LogLevelToEmoji = {
	[LogLevel.ERROR]: '\u{274C}',
	[LogLevel.WARN]: '\u{26A0}\u{FE0F} ',
	[LogLevel.INFO]: '\u{2139}\u{FE0F} ',
	[LogLevel.DEBUG]: '\u{1F41E}',
	[LogLevel.SILLY]: '\u{1F43E}',
};

const consoleFormat = format.printf(({ level, message, timestamp, module }) => {
	let upperLevel = ` ${level.toUpperCase()} `;
	const emoji = LogLevelToEmoji[level];
	switch (level) {
		case LogLevel.SILLY:
			message = chalk.magenta(message);
			upperLevel = chalk.bgMagenta.bold(upperLevel);
			break;

		case LogLevel.DEBUG:
			message = chalk.cyan(message);
			upperLevel = chalk.bgCyan.bold(upperLevel);
			break;

		case LogLevel.VERBOSE:
			message = chalk.magentaBright(message);
			upperLevel = chalk.bgMagentaBright.bold(upperLevel);
			break;

		case LogLevel.INFO:
			message = chalk.green(message);
			upperLevel = chalk.bgGreen.bold(upperLevel);
			break;

		case LogLevel.WARN:
			message = chalk.yellow(message);
			upperLevel = chalk.black.bgYellowBright.bold(upperLevel);
			break;

		case LogLevel.ERROR:
			message = chalk.red(message);
			upperLevel = chalk.bgRedBright.bold(upperLevel);
			break;

		default:
			break;
	}

	return `[${timestamp}] ${emoji} ${upperLevel} ${module ? chalk.black.bgWhite(` ${module.toUpperCase()} `) + ' ' : ''}${message}`;
});

const fileFormat = format.printf(({ level, message, timestamp, module }) => {
	return `[${timestamp}] [${level.toUpperCase()}] ${module ? '[' + module.toUpperCase() + '] ' : ''}${message}`;
});

class Logger {
	static winstonLogger = createLogger({
		level: LogLevel.SILLY,
		format: format.combine(format.timestamp(), format.splat(), consoleFormat),
		transports: [
			new transports.Console(),
			new transports.File({
				filename: '.logs/error.log',
				level: LogLevel.ERROR,
				format: format.combine(format.timestamp(), format.splat(), fileFormat),
			}),
			new transports.File({
				filename: '.logs/combined.log',
				format: format.combine(format.timestamp(), format.splat(), fileFormat),
			}),
		],
	});

	/**
	 * send a log to console and file transports
	 * @param level the level of the log
	 * @param message log message
	 * @param module name of the module where this log was originated from (optional)
	 */
	static log(level, message, module) {
		this.winstonLogger.log(level, message, { module });
	}
}

module.exports = { Logger, LogLevel };
