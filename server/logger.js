'use strict';
const { createLogger, format, transports, addColors} = require('winston');
const { combine, colorize, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${level}: ${message}`;
});

const config = require('../config.js');
const loggerConfig = {
	levels: {
		err: 0,
		warn: 1,
		info: 2,
		notify: 3
	},
	colors: {
		err: 'red',
		warn: 'yellow',
		info: 'green',
		notify: 'cyan'
	}
};
const logger = createLogger({
	levels: loggerConfig.levels,
	format: combine(
	  colorize(),
	  myFormat
	),
	transports: [new transports.Console()]
  });

addColors(loggerConfig.colors);

module.exports = logger;