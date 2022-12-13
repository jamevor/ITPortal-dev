const License = require('../models/License.js');

module.exports = {
	getAll: (req, res, next) => {
		License.findAll().then(licenses => {
			res.json(licenses);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	}
};