const Audience = require('../models/Audience.js');
const sanitizeHTML = require('sanitize-html');
const config = require('../config.js');

module.exports = {
	renderById: (req, res, next) => {
		Audience.findByPk(req.params.id).then(audience => {
			res.redirect(`/Search?Portal_prod[refinementList][metadata.audiences][0]=${audience.title}`);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	createOne: (req, res, next) => {
		Audience.create(
			{
				createdBy: req.user.id,
				modifiedBy: req.user.id,
				title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
				descriptionShort: sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone),
				idMetadataPhase: sanitizeHTML(req.body.idMetadataPhase || 1, config.sanitizeHTML.allowNone)
			}
		).then(audience => {
			res.json(
				{
					audience,
					created: true
				}
			);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	updateOne: (req, res, next) => {
		Audience.findByPk(req.params.id).then(audience => {
			audience.modifiedBy = req.user.id;
			audience.title = sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
			audience.descriptionShort = sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone);
			audience.idMetadataPhase = sanitizeHTML(req.body.idMetadataPhase || 1, config.sanitizeHTML.allowNone);
			audience.save().then(audience_ => {
				res.json(
					{
						audience: audience_,
						created: false
					}
				);
				return null;
			}).catch(err => {
				next(err);
				return null;
			});
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getAll: (req, res, next) => {
		Audience.findAll().then(audiences => {
			res.json(audiences);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	}
};