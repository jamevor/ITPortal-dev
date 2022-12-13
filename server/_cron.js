'use strict';
const CronJob = require('cron').CronJob;
const search = require('./search_server.js');
const logger = require('./logger.js');
const CherwellTokenCache = require('../models/CherwellTokenCache.js');

module.exports = () => {

	const refreshSearchIndex = new CronJob('00 01 00 * * *', async() => { // midnight:01
		logger.info(`cron (instance ${process.env.NODE_APP_INSTANCE}): refreshing search index...`);
		let result;
		try {
			result = await search.refreshIndex();
		} catch (err) {
			logger.err(err);
			return null;
		}
		logger.info(`cron (instance ${process.env.NODE_APP_INSTANCE}): successfully refreshed search index (${result.length} items were indexed for ${process.env.ALGOLIA_INDEX})`);
		return null;
	});
	refreshSearchIndex.start();

	const pingCherwellIIS = new CronJob('0 */15 * * * *', async() => { // every 15 minutes
		logger.info(`cron (instance ${process.env.NODE_APP_INSTANCE}): checking cherwell token cache...`);
		try {
			if (await CherwellTokenCache.isTokenValid()) {
				logger.info(`cron (instance ${process.env.NODE_APP_INSTANCE}): cherwell token cache hit`);
			} else {
				logger.info(`cron (instance ${process.env.NODE_APP_INSTANCE}): cherwell token cache miss - refreshing...`);
				await CherwellTokenCache.refreshToken();
			}
		} catch (err) {
			logger.err(err);
			return null;
		}
		return null;
	});
	pingCherwellIIS.start();

};