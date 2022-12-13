const Portfolio = require('../models/Portfolio.js');
const CatalogPhase = require('../models/CatalogPhase.js');
const CatalogStatus = require('../models/CatalogStatus.js');
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
		const enforcePublished = await G.checkPermissions({req, entity: 'portfolio', level: 'read', entityID: req.params.id}) ? {} : {title: 'publish'};
		Portfolio.findOne(
			{
				where: {
					id: req.params.id
				},
				include: [
					{
						model: CatalogPhase,
						where: enforcePublished
					}
				]
			}).then(portfolio => {
			if (!portfolio) {
				next(404);
				return null;
			}
			res.redirect(url.format({
				pathname: portfolio.getURL(),
				query: req.query
			}));
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	render: async(req, res, next) => {
		Portfolio.findById(req.params.id, !(await G.checkPermissions({req, entity: 'portfolio', level: 'read', entityID: req.params.id}))).then(async portfolio => {
			if (!portfolio) {
				next(404);
				return null;
			} else if (req.path != portfolio.getURL()) {
				res.redirect(url.format({
					pathname: portfolio.getURL(),
					query: req.query
				}));
				return null;
			} else if (await G.checkPermissions({req, entity: 'portfolio', level: 'read', entityID: req.params.id})) {
				const canEdit = await G.checkPermissions({req, entity: 'portfolio', level: 'author', entityID: req.params.id});
				res.render('portfolio/view.ejs', { portfolio, canEdit });
				if (req.isAuthenticated()) {
					try {
						await UserViewHistory.recordView(req.user.id, 'portfolio', portfolio.id, portfolio.title);
					} catch (err) {
						logger.err(err);
					}
					return null;
				} else {
					return null;
				}
			} else if (portfolio.getPhaseTitle() === 'publish') {
				res.render('portfolio/view.ejs', {portfolio, canEdit: false});
				if (req.isAuthenticated()) {
					try {
						await UserViewHistory.recordView(req.user.id, 'portfolio', portfolio.id, portfolio.title);
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
		Portfolio.findById(req.params.id).then(portfolio => {
			if (!portfolio) {
				next(404);
				return null;
			} else if (portfolio.getPhaseTitle() === 'publish') {
				res.json(portfolio);
				return null;
			} else if (G.checkPermissions({req, entity: 'portfolio', level: 'read', entityID: req.params.id})) {
				res.json(portfolio);
				return null;
			} else {
				next(403);
				return null;
			}
		}).catch(err => {
			return next(err);
		});
	},
	getAll: (req, res, next) => {
		Portfolio.findAll(
			{
				include: [
					{
						model: CatalogPhase,
						where: {
							title: 'publish'
						}
					}
				]
			}
		).then(portfolios => {
			res.json(portfolios);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	new: (req, res, next) => {
		return Promise.all([ CatalogPhase.findAll(), CatalogStatus.findAll()]).then(values => {
			res.render('portfolio/view.ejs', {
				edit: true,
				canEdit: true,
				phases: values[0],
				statuses: values[1],
			});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	edit: (req, res, next) => {
		Portfolio.findById(req.params.id).then(portfolio => {
			if (!portfolio) {
				next(404);
				return null;
			} else {
				return CatalogStatus.findAll().then(async statuses => {

					// check permission level
					const canPublish = await G.checkPermissions({req, entity: 'portfolio', level: 'publish', entityID: req.params.id});
					let canRemoveGroups = await G.checkPermissions({req, entity: 'portfolio', level: 'delete', entityID: req.params.id});

					let phases = [];
					if (canPublish) { // get phases if users can set the phase
						phases = await CatalogPhase.findAll();
					}

					await UserEditHistory.recordView(req.user.id, 'portfolio', portfolio.id);

					res.render('portfolio/view.ejs', {
						portfolio,
						edit: true,
						canEdit: true,
						phases,
						statuses,
						canPublish,
						canRemoveGroups
					});
					return null;
				}).catch(err => {
					next(err);
					return null;
				});
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
		Portfolio.create({
			createdBy: req.user.id,
			title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
			descriptionShort: sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone),
			descriptionLong: JSON.stringify(req.body.descriptionLong),
			idCatalogPhase: sanitizeHTML(req.body.idCatalogPhase, config.sanitizeHTML.allowNone),
			idCatalogStatus: sanitizeHTML(req.body.idCatalogStatus, config.sanitizeHTML.allowNone),
			icon: sanitizeHTML(req.body.icon, config.sanitizeHTML.allowNone),
			color: sanitizeHTML(req.body.color, config.sanitizeHTML.allowNone),
			accessRestricted: sanitizeHTML(req.body.accessRestricted, config.sanitizeHTML.allowNone) == 'true',
			dateReviewBy: G.defaultDateReviewByFunction()
		}).then(async portfolio => {
			if (req.body.actions && req.body.actions.length) {
				await portfolio.setActions(req.body.actions);
			} else {
				await portfolio.setActions([]);
			}
			if (req.body.tags && req.body.tags.length) {
				await portfolio.setTags(req.body.tags);
			} else {
				await portfolio.setTags([]);
			}
			if (req.body.aliases && req.body.aliases.length) {
				await portfolio.setAliases(req.body.aliases);
			} else {
				await portfolio.setAliases([]);
			}
			if (req.body.services && req.body.services.length) {
				await portfolio.setServices(req.body.services);
			} else {
				await portfolio.setServices([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await portfolio.setGroups(req.body.groups);
			} else {
				await portfolio.setGroups([]);
			}
			res.json({portfolio, created: true});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	updateOne: (req, res, next) => {
		Portfolio.findById(req.params.id).then(async portfolio => {
			if (!portfolio) {
				next(404);
				return null;
			}
			portfolio.modifiedBy = req.user.id;
			portfolio.title = sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
			portfolio.descriptionShort = sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone);
			portfolio.descriptionLong = JSON.stringify(req.body.descriptionLong);
			portfolio.idCatalogPhase = sanitizeHTML(req.body.idCatalogPhase, config.sanitizeHTML.allowNone);
			portfolio.idCatalogStatus = sanitizeHTML(req.body.idCatalogStatus, config.sanitizeHTML.allowNone);
			portfolio.icon = sanitizeHTML(req.body.icon, config.sanitizeHTML.allowNone);
			portfolio.color = sanitizeHTML(req.body.color, config.sanitizeHTML.allowNone);
			portfolio.accessRestricted = sanitizeHTML(req.body.accessRestricted, config.sanitizeHTML.allowNone) == 'true';
			portfolio.dateReviewBy = G.defaultDateReviewByFunction();
			if (req.body.actions && req.body.actions.length) {
				await portfolio.setActions(req.body.actions);
			} else {
				await portfolio.setActions([]);
			}
			if (req.body.tags && req.body.tags.length) {
				await portfolio.setTags(req.body.tags);
			} else {
				await portfolio.setTags([]);
			}
			if (req.body.aliases && req.body.aliases.length) {
				await portfolio.setAliases(req.body.aliases);
			} else {
				await portfolio.setAliases([]);
			}
			if (req.body.services && req.body.services.length) {
				await portfolio.setServices(req.body.services);
			} else {
				await portfolio.setServices([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await portfolio.setGroups(req.body.groups);
			} else {
				await portfolio.setGroups([]);
			}
			portfolio.save().then(async portfolio_ => {
				res.json(
					{
						portfolio: portfolio_,
						created: false,
						canRemoveGroups: await G.checkPermissions({req, entity: 'portfolio', level: 'delete', entityID: portfolio_.id})
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
						model: Portfolio,
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
						entity: 'portfolio',
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
