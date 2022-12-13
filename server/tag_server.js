const Tag = require('../models/Tag.js');
const sanitizeHTML = require('sanitize-html');
const config = require('../config.js');

module.exports = {
	renderById: (req, res, next) => {
		Tag.findByPk(req.params.id).then(tag => {
			res.redirect(`/Search?Portal_prod[refinementList][metadata.tags][0]=${tag.title}`);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	createOne: (req, res, next) => {
		Tag.create(
			{
				createdBy: req.user.id,
				modifiedBy: req.user.id,
				title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
				descriptionShort: sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone),
				idMetadataPhase: sanitizeHTML(req.body.idMetadataPhase || 1, config.sanitizeHTML.allowNone)
			}
		).then(tag => {
			res.json(
				{
					tag,
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
		Tag.findByPk(req.params.id).then(tag => {
			tag.modifiedBy = req.user.id;
			tag.title = sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
			tag.descriptionShort = sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone);
			tag.idMetadataPhase = sanitizeHTML(req.body.idMetadataPhase || 1, config.sanitizeHTML.allowNone);
			tag.save().then(tag_ => {
				res.json(
					{
						tag_,
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
		Tag.findAll().then(tags => {
			res.json(tags);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	}
};