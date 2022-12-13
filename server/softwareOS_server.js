const SoftwareOS = require('../models/SoftwareOS.js');

module.exports = {
	getAll: (req, res, next) => {
		SoftwareOS.findAll().then(softwareOS => {
			res.json(softwareOS);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	}
};