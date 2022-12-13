const Action = require('../models/Action.js');
const ActionType = require('../models/ActionType.js');
const MetadataPhase = require('../models/MetadataPhase.js');
const sanitizeHTML = require('sanitize-html');
const config = require('../config.js');

module.exports = {
	/**
   * VIEWS
   */

	/**
   * API
   */
	createOne: (req, res, next) => {
		Action.create(
			{
				createdBy: req.user.id,
				modifiedBy: req.user.id,
				title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
				link: sanitizeHTML(req.body.link, config.sanitizeHTML.allowNone),
				descriptionShort: sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone),
				idActionType: sanitizeHTML(req.body.idActionType || 1, config.sanitizeHTML.allowNone),
				idMetadataPhase: sanitizeHTML(req.body.idMetadataPhase || 1, config.sanitizeHTML.allowNone)
			}
		).then(action => {
			res.json(
				{
					action,
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
		Action.findByPk(req.params.id).then(action => {
			action.modifiedBy = req.user.id;
			action.title = sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
			action.link = sanitizeHTML(req.body.link, config.sanitizeHTML.allowNone);
			action.descriptionShort = sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone);
			action.idActionType = sanitizeHTML(req.body.idActionType || 1, config.sanitizeHTML.allowNone);
			action.idMetadataPhase = sanitizeHTML(req.body.idMetadataPhase || 1, config.sanitizeHTML.allowNone);
			action.save().then(action_ => {
				res.json(
					{
						action: action_,
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
		Action.findAll(
			{
				include: [
					{
						model: ActionType
					},
					{
						model: MetadataPhase,
						required: true,
						where: {
							title: 'publish'
						}
					}
				]
			}
		).then(actions => {
			res.json(actions);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	}
};
