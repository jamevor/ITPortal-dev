const Gizmo = require('../models/Gizmo.js');
const sanitizeHTML = require('sanitize-html');
const config = require('../config.js');

module.exports = {
	createOne: (req, res, next) => {
		Gizmo.create(
			{
				title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
				gizmoType: sanitizeHTML(req.body.gizmoType, config.sanitizeHTML.allowNone),
				content: sanitizeHTML(req.body.content, config.sanitizeHTML.allowNone),
				widthPct: sanitizeHTML(req.body.widthPct, config.sanitizeHTML.allowNone),
				maxHeightPx: sanitizeHTML(req.body.maxHeightPx, config.sanitizeHTML.allowNone),
				displayMode: sanitizeHTML(req.body.displayMode, config.sanitizeHTML.allowNone),
				limit: sanitizeHTML(req.body.limit, config.sanitizeHTML.allowNone),
				orderResults: sanitizeHTML(req.body.orderResults, config.sanitizeHTML.allowNone),
				orderResultsIsAsc: sanitizeHTML(req.body.orderResultsIsAsc, config.sanitizeHTML.allowNone) === 'true',
				idSubSite: req.params.id
			}
		).then(async gizmo => {
			if (req.body.tags && req.body.tags.length) {
				await gizmo.setTags(req.body.tags);
			}
			if (req.body.audiences && req.body.audiences.length) {
				await gizmo.setAudiences(req.body.audiences);
			}
			res.json(
				{
					gizmo,
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
		Gizmo.findByPk(req.body.id).then(async gizmo => {
			gizmo.title =  sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
			gizmo.gizmoType =  sanitizeHTML(req.body.gizmoType, config.sanitizeHTML.allowNone);
			gizmo.content =  sanitizeHTML(req.body.content, config.sanitizeHTML.allowNone);
			gizmo.widthPct =  sanitizeHTML(req.body.widthPct, config.sanitizeHTML.allowNone);
			gizmo.maxHeightPx =  sanitizeHTML(req.body.maxHeightPx, config.sanitizeHTML.allowNone);
			gizmo.displayMode =  sanitizeHTML(req.body.displayMode, config.sanitizeHTML.allowNone);
			gizmo.limit =  sanitizeHTML(req.body.limit, config.sanitizeHTML.allowNone);
			gizmo.orderResults =  sanitizeHTML(req.body.orderResults, config.sanitizeHTML.allowNone);
			gizmo.orderResultsIsAsc =  sanitizeHTML(req.body.orderResultsIsAsc, config.sanitizeHTML.allowNone) === 'true';
			if (req.body.tags && req.body.tags.length) {
				await gizmo.setTags(req.body.tags);
			}
			if (req.body.audiences && req.body.audiences.length) {
				await gizmo.setAudiences(req.body.audiences);
			}
			const gizmo_ = await gizmo.save();
			res.json(
				{
					gizmo: gizmo_,
					created: false
				}
			);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	deleteOne: (req, res, next) => {
		Gizmo.destroy(
			{
				where: {
					id: req.body.id,
					idSubSite: req.params.id
				}
			}
		).then(() => {
			res.json(
				{
					success: true
				}
			);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getData: (req, res, next) => {
		Gizmo.getGizmoData(req.params.id).then(data => {
			res.json(data);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	}
};
