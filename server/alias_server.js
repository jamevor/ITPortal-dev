const Alias = require('../models/Alias.js');
const sanitizeHTML = require('sanitize-html');
const config = require('../config.js');

module.exports = {
	renderById: (req, res, next) => {
		Alias.findByPk(req.params.id).then(alias => {
			res.redirect(`/Search?Portal_prod[refinementList][metadata.aliases][0]=${alias.title}`);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	createOne: (req, res, next) => {
		Alias.create(
			{
				createdBy: req.user.id,
				modifiedBy: req.user.id,
				title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
				idMetadataPhase: sanitizeHTML(req.body.idMetadataPhase || 1, config.sanitizeHTML.allowNone)
			}
		).then(alias => {
			res.json(
				{
					alias,
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
		Alias.findByPk(req.params.id).then(alias => {
			alias.modifiedBy = req.user.id;
			alias.title = sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
			alias.idMetadataPhase = sanitizeHTML(req.body.idMetadataPhase || 1, config.sanitizeHTML.allowNone);
			alias.save().then(alias_ => {
				res.json(
					{
						alias: alias_,
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
		Alias.findAll().then(aliases => {
			res.json(aliases);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	}
};