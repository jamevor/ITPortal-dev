const Glossary = require('../models/Glossary.js');
const sanitizeHTML = require('sanitize-html');
const config = require('../config.js');

module.exports = {
	// renderById: (req, res, next) => {
	// 	Glossary.findOne(
	// 		{
	// 			where: {
	// 				id: req.params.id
	// 			},
	// 			attributes: ['id', 'title']
	// 		}).then(glossary => {
	// 		if (!glossary) {
	// 			return next(404);
	// 		}
	// 		return res.redirect(glossary.getURL());
	// 	}).catch(err => {
	// 		return next(err);
	// 	});
	// },
	// render: (req, res, next) => {
	// 	Glossary.findById(req.params.id).then(glossary => {
	// 		if (!glossary) {
	// 			return next(404);
	// 		}
	// 		if (req.url != glossary.getURL()) {
	// 			return res.redirect(glossary.getURL());
	// 		}
	// 		return res.render('glossary/view.ejs', {
	// 			glossary: glossary
	// 		});
	// 	}).catch(err => {
	// 		return next(err);
	// 	});
	// },
	createOne: (req, res, next) => {
		Glossary.create(
			{
				createdBy: req.user.id,
				modifiedBy: req.user.id,
				title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
				description: sanitizeHTML(req.body.description, config.sanitizeHTML.allowNone),
				idMetadataPhase: sanitizeHTML(req.body.idMetadataPhase || 1, config.sanitizeHTML.allowNone)
			}
		).then(glossary => {
			res.json(
				{
					glossary,
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
		Glossary.findByPk(req.params.id).then(glossary => {
			glossary.modifiedBy = req.user.id;
			glossary.title = sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
			glossary.description = sanitizeHTML(req.body.description, config.sanitizeHTML.allowNone);
			glossary.idMetadataPhase = sanitizeHTML(req.body.idMetadataPhase || 1, config.sanitizeHTML.allowNone);
			glossary.save().then(glossary_ => {
				res.json(
					{
						glossary: glossary_,
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
	getOne: (req, res, next) => {
		Glossary.findById(req.params.id).then(glossary => {
			if (!glossary) {
				return next(404);
			}
			return res.json(glossary);
		}).catch(err => {
			return next(err);
		});
	},
	// getMany: (req, res, next) => {

	// }
};
