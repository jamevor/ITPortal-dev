const { workerData, isMainThread, parentPort } = require('worker_threads');
const G = require('../../_global_logic.js');
const modelsBuilder = require('../../../models');
const logger = require('../../logger');

if (isMainThread) {
	logger.err('Main thread cannot be worker');
	throw Error('Main thread cannot be worker');
} else {
	logger.notify(`starting worker thread... loading table data for: ${workerData.entity}`);
	modelsBuilder().then(models => {
		const { req, entity, rows, phase, count } = workerData;
		req.isAuthenticated = () => req.isAuthenticated;
		const useModel = models[Object.keys(models).find(modelName => modelName.toLowerCase() === entity)];
		const itemsPromises = [];
		itemsPromises.push(...rows.map(row => {
			return new Promise((resolve, reject) => {
				return Promise.all([G.checkPermissions({req, entity, entityID: row.id, useModel}), G.checkPermissions({req, entity, entityID: row.id, level: 'author', useModel})]).then(permissionsValues => {
					const result = {
						id: row.id,
						title: row.title,
						permissions: {
							canView: permissionsValues[0],
							canEdit: permissionsValues[1]
						}
					};
					resolve(result);
					return null;
				}).catch(err => {
					reject(err);
					return null;
				});
			});
		}));
		Promise.all(itemsPromises).then(items => {
			const phaseWithRelatedItems = {
				phase,
				items,
				count
			};
			parentPort.postMessage(phaseWithRelatedItems);
			models.sequelize.close();
			return null;
		}).catch(err => {
			throw err;
		});
	}).catch(err => {
		throw err;
	});
}
