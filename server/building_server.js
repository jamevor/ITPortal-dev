const Building = require('../models/Building.js');
const SpacePhase = require('../models/SpacePhase.js');
const G = require('./_global_logic.js');
const UserViewHistory = require('../models/UserViewHistory.js');
const sanitizeHTML = require('sanitize-html');
const config = require('../config.js');
const logger = require('./logger.js');
const url = require('url');
const Group = require('../models/Group.js');
const GroupPermissionLevel = require('../models/GroupPermissionLevel.js');
const Permission = require('../models/Permission.js');
const PermissionLevel = require('../models/PermissionLevel.js');
const UserEditHistory = require('../models/UserEditHistory.js');

module.exports = {
	renderById: async(req, res, next) => {
		const enforcePublished = await G.checkPermissions({req, entity: 'building', level: 'read', entityID: req.params.id}) ? {} : {title: 'publish'};
		Building.findOne(
			{
				where: {
					id: req.params.id
				},
				include: [
					{
						model: SpacePhase,
						where: enforcePublished
					}
				]
			}).then(building => {
			if (!building) {
				next(404);
				return null;
			}
			res.redirect(url.format({
				pathname: building.getURL(),
				query: req.query
			}));
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	render: async(req, res, next) => {
		Building.findById(req.params.id, !(await G.checkPermissions({req, entity: 'building', level: 'read', entityID: req.params.id}))).then(async building => {
			if (!building) {
				next(404);
				return null;
			} else if (req.path != building.getURL()) {
				res.redirect(url.format({
					pathname: building.getURL(),
					query: req.query
				}));
				return null;
			} else if (await G.checkPermissions({req, entity: 'building', level: 'read', entityID: req.params.id})) {
				const canEdit = await G.checkPermissions({req, entity: 'building', level: 'author', entityID: req.params.id});
				res.render('building/view.ejs', { building, canEdit });
				if (req.isAuthenticated()) {
					try {
						await UserViewHistory.recordView(req.user.id, 'building', building.id, building.title);
					} catch (err) {
						logger.err(err);
					}
					return null;
				} else {
					return null;
				}
			} else if (building.getPhaseTitle() === 'publish') {
				res.render('building/view.ejs', {building, canEdit: false});
				if (req.isAuthenticated()) {
					try {
						await UserViewHistory.recordView(req.user.id, 'building', building.id, building.title);
					} catch (err) {
						logger.err(err);
					}
					return null;
				} else {
					return null;
				}
			} else {
				next(404);
				return null;
			}
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getOne: (req, res, next) => {
		Building.findById(req.params.id).then(building => {
			if (!building) {
				return next(404);
			} else {
				return res.json(building);
			}
		}).catch(err => {
			return next(err);
		});
	},
	getAll: (req, res, next) => {
		Building.findAll().then(buildings => {
			res.json(buildings);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	new: (req, res, next) => {
		res.render('building/view.ejs', {
			edit: true,
			canEdit: true
		});
		return null;
	},
	edit: (req, res, next) => {
		Building.findById(req.params.id).then(async building => {
			if (!building) {
				next(404);
				return null;
			} else {
				// check permission level
				const canPublish = await G.checkPermissions({req, entity: 'building', level: 'publish', entityID: req.params.id});
				let canRemoveGroups = await G.checkPermissions({req, entity: 'building', level: 'delete', entityID: req.params.id});

				let phases = [];
				if (canPublish) { // get phases if users can set the phase
					phases = await SpacePhase.findAll();
				}

				await UserEditHistory.recordView(req.user.id, 'building', building.id);

				res.render('building/view.ejs', {
					building,
					edit: true,
					canEdit: true,
					phases,
					canPublish,
					canRemoveGroups
				});
				return null;
			}
		}).catch(err => {
			next(err);
			return null;
		});
	},
	/**
   * API
   */
	createOne: (req, res, next) => {
		Building.create({
			createdBy: req.user.id,
			title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
			descriptionShort: sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone),
			address: sanitizeHTML(req.body.address, config.sanitizeHTML.allowNone),
			geo: sanitizeHTML(req.body.geo, config.sanitizeHTML.allowNone),
			abbr: sanitizeHTML(req.body.abbr, config.sanitizeHTML.allowNone),
			common: sanitizeHTML(req.body.common, config.sanitizeHTML.allowNone),
			idSpacePhase: sanitizeHTML(req.body.idSpacePhase, config.sanitizeHTML.allowNone),
			accessRestricted: sanitizeHTML(req.body.accessRestricted, config.sanitizeHTML.allowNone) == 'true',
			dateReviewBy: G.defaultDateReviewByFunction()
		}).then(async building => {
			if (req.body.locations && req.body.locations.length) {
				await building.setLocations(req.body.locations);
			} else {
				await building.setLocations([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await building.setGroups(req.body.groups);
			} else {
				await building.setGroups([]);
			}
			res.json({building, created: true});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	updateOne: (req, res, next) => {
		Building.findById(req.params.id).then(async building => {
			if (!building) {
				next(404);
				return null;
			}
			building.modifiedBy = req.user.id;
			building.title = sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
			building.descriptionShort = sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone);
			building.address = sanitizeHTML(req.body.address, config.sanitizeHTML.allowNone);
			building.geo = sanitizeHTML(req.body.geo, config.sanitizeHTML.allowNone);
			building.abbr = sanitizeHTML(req.body.abbr, config.sanitizeHTML.allowNone);
			building.common = sanitizeHTML(req.body.common, config.sanitizeHTML.allowNone);
			building.dateReviewBy = G.defaultDateReviewByFunction();
			building.idSpacePhase = sanitizeHTML(req.body.idSpacePhase, config.sanitizeHTML.allowNone);
			building.accessRestricted = sanitizeHTML(req.body.accessRestricted, config.sanitizeHTML.allowNone) == 'true';
			building.dateReviewBy = G.defaultDateReviewByFunction();
			if (req.body.locations && req.body.locations.length) {
				await building.setLocations(req.body.locations);
			} else {
				await building.setLocations([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await building.setGroups(req.body.groups);
			} else {
				await building.setGroups([]);
			}
			building.save().then(async building_ => {
				res.json(
					{
						building: building_,
						created: false,
						canRemoveGroups: await G.checkPermissions({req, entity: 'building', level: 'delete', entityID: building_.id})
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
	getGroups: (req, res, next) => {
		Group.findAll(
			{
				attributes: ['id', 'title'],
				include: [
					{
						model: Building,
						required: true,
						where: {
							id: req.params.id
						},
						attributes: []
					}
				]
			}
		).then(groups => {
			res.json(
				{
					count: groups.length,
					context: {
						entity: 'building',
						entityID: req.params.id
					},
					groups
				}
			);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
};
