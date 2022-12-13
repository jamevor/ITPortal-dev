/**
 * Here what we want to do is import all of our defined models / classes
 * and initialize the database connection.
 */
const db = {};
const Sequelize = require('sequelize');
const logger = require('../server/logger.js');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const adaptersDir = 'adapters';

module.exports = () => {
	return new Promise((resolve, reject) => {
		// initialize database connection
		const sequelize = new Sequelize(`${process.env.DB_URI_SCHEME}${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
			define: {
				charset: 'utf8',
				collate: 'utf8_general_ci',
			},
			dialectOptions: {
				useUTC: false,
				dateStrings: true,
				typeCast: true,
				timezone: process.env.DB_TIMEZONE
			},
			timezone: process.env.DB_TIMEZONE,
			logging: false
		});

		// test connection
		return sequelize.authenticate().then(() => {
			logger.info('sequelize connection has been established successfully.');
			loadModels(sequelize);
			// export connection
			db.sequelize = sequelize;
			resolve(db);
			return null;
		}).catch(err => {
			reject(err);
			return null;
		});
	});
};


// load models
const loadModels = sequelize => {
	fs.readdirSync(__dirname).filter(m => m != basename && m != adaptersDir).forEach(m => {
		let modelName = m.split('.')[0];
		logger.notify(`importing model ${modelName}`);
		let model = require(path.join(__dirname, m)).init(sequelize, Sequelize);
		db[modelName] = model;
	});
	for (let model in db) {
		if (typeof db[model].associate === 'function') {
			logger.notify(`creating model associations for ${model}`);
			db[model].associate(db);
		}
	}
	logger.notify('Finished creating sequelize database and relations.');
};
