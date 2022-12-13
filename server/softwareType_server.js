const SoftwareType = require('../models/SoftwareType.js');

module.exports = {
	getAll: (req, res, next) => {
		SoftwareType.findAll().then(softwareTypes => {
			res.json(softwareTypes);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	}
};