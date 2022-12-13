const logger = require('../logger.js');
const GetInclusiveAPI = require('./getInclusive.js');
const API = new GetInclusiveAPI();

module.exports = {
	getCurrentUserStatus: (req, res, next) => {
		API.getUserStatus(req.user.employeeID).then(result => {
			result = JSON.parse(result);

			return res.json(result);

		}).catch(err => {
			return res.json([{}]);
		});
	},
	getUserStatus: (req, res, next) => {
		API.getUserStatus(req.params.ID).then(result => {
			result = JSON.parse(result);

			return res.json(result);

		}).catch(err => {
			return res.json([{}]);
		});
	}

};
