'use strict';
const sanitizeHTML = require('sanitize-html');
const config = require('../config.js');

module.exports = {
	update: (req, res, next) => {
		new Promise((resolve, reject) => {
			req.session.alertClosed = typeof req.body.alertClosed !== 'undefined' ? sanitizeHTML(req.body.alertClosed, config.sanitizeHTML.allowNone) : req.session.alertClosed;
			req.session.save(err => {
				if (err) {
					reject(err);
					return null;
				} else {
					resolve(true);
					return null;
				}
			});
		}).then(() => {
			res.status(204).send();
		}).catch(err => {
			next(err);
			return null;
		});
	}
};