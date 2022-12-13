const Service = require('../models/Service.js');
const CatalogPhase = require('../models/CatalogPhase.js');
const CatalogStatus = require('../models/CatalogStatus.js');
const sanitizeHTML = require('sanitize-html');
const config = require('../config.js');
const G = require('./_global_logic.js');
const UserViewHistory = require('../models/UserViewHistory.js');
const logger = require('./logger.js');
const url = require('url');
const Group = require('../models/Group.js');
const GroupPermissionLevel = require('../models/GroupPermissionLevel.js');
const Permission = require('../models/Permission.js');
const PermissionLevel = require('../models/PermissionLevel.js');
const UserEditHistory = require('../models/UserEditHistory.js');

module.exports = {
	renderById: async(req, res, next) => {
		const enforcePublished = await G.checkPermissions({req, entity: 'service', level: 'read', entityID: req.params.id}) ? {} : {title: 'publish'};
		Service.findOne(
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
			}).then(service => {
			if (!service) {
				next(404);
				return null;
			}
			res.redirect(url.format({
				pathname: service.getURL(),
				query: req.query
			}));
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	render: async(req, res, next) => {
		Service.findById(req.params.id, !(await G.checkPermissions({req, entity: 'service', level: 'read', entityID: req.params.id}))).then(async service => {
			if (!service) {
				next(404);
				return null;
			} else if (req.path != service.getURL()) {
				res.redirect(url.format({
					pathname: service.getURL(),
					query: req.query
				}));
				return null;
			} else if (await G.checkPermissions({req, entity: 'service', level: 'read', entityID: req.params.id})) {
				const canEdit = await G.checkPermissions({req, entity: 'service', level: 'author', entityID: req.params.id});
				res.render('service/view.ejs', { service, canEdit });
				if (req.isAuthenticated()) {
					try {
						await UserViewHistory.recordView(req.user.id, 'service', service.id, service.title);
					} catch (err) {
						logger.err(err);
					}
					return null;
				} else {
					return null;
				}
			} else if (service.getPhaseTitle() === 'publish') {
				res.render('service/view.ejs', {service, canEdit: false});
				if (req.isAuthenticated()) {
					try {
						await UserViewHistory.recordView(req.user.id, 'service', service.id, service.title);
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
		Service.findById(req.params.id).then(async service => {
			if (!service) {
				next(404);
				return null;
			} else if (service.getPhaseTitle() === 'publish') {
				res.json(service);
				return null;
			} else if (await G.checkPermissions({req, entity: 'service', level: 'read', entityID: req.params.id})) {
				res.json(service);
				return null;
			} else {
				next(403);
				return null;
			}
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getAll: (req, res, next) => {
		Service.findAll(
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
		).then(services => {
			res.json(services);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	new: (req, res, next) => {
		return Promise.all([ CatalogPhase.findAll(), CatalogStatus.findAll()]).then(values => {
			res.render('service/view.ejs', {
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
		Service.findById(req.params.id).then(service => {
			if (!service) {
				next(404);
				return null;
			} else {
				return CatalogStatus.findAll().then(async statuses => {

					// check permission level
					const canPublish = await G.checkPermissions({req, entity: 'service', level: 'publish', entityID: req.params.id});
					let canRemoveGroups = await G.checkPermissions({req, entity: 'service', level: 'delete', entityID: req.params.id});

					let phases = [];
					if (canPublish) { // get phases if users can set the phase
						phases = await CatalogPhase.findAll();
					}

					await UserEditHistory.recordView(req.user.id, 'service', service.id);

					res.render('service/view.ejs', {
						service,
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
		Service.create({
			createdBy: req.user.id,
			title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
			descriptionShort: sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone),
			descriptionLong: JSON.stringify(req.body.descriptionLong),
			idCatalogPhase: sanitizeHTML(req.body.idCatalogPhase, config.sanitizeHTML.allowNone),
			idCatalogStatus: sanitizeHTML(req.body.idCatalogStatus, config.sanitizeHTML.allowNone),
			availability: sanitizeHTML(req.body.availability, config.sanitizeHTML.allowNone),
			cost: sanitizeHTML(req.body.cost, config.sanitizeHTML.allowNone),
			support: sanitizeHTML(req.body.support, config.sanitizeHTML.allowNone),
			requirements: sanitizeHTML(req.body.requirements, config.sanitizeHTML.allowNone),
			requesting: sanitizeHTML(req.body.requesting, config.sanitizeHTML.allowNone),
			icon: sanitizeHTML(req.body.icon, config.sanitizeHTML.allowNone),
			color: sanitizeHTML(req.body.color, config.sanitizeHTML.allowNone),
			accessRestricted: sanitizeHTML(req.body.accessRestricted, config.sanitizeHTML.allowNone) == 'true',
			dateReviewBy: G.defaultDateReviewByFunction()
			// maintenance: sanitizeHTML(req.body.maintenance, config.sanitizeHTML.allowNone),
			// benefits: sanitizeHTML(req.body.benefits, config.sanitizeHTML.allowNone),
			// ownerService: sanitizeHTML(req.body.ownerService, config.sanitizeHTML.allowNone),
			// ownerBusiness: sanitizeHTML(req.body.ownerBusiness, config.sanitizeHTML.allowNone)
		}).then(async service => {
			if (req.body.actions && req.body.actions.length) {
				await service.setActions(req.body.actions);
			} else {
				await service.setActions([]);
			}
			if (req.body.tags && req.body.tags.length) {
				await service.setTags(req.body.tags);
			} else {
				await service.setTags([]);
			}
			if (req.body.audiences && req.body.audiences.length) {
				await service.setAudiences(req.body.audiences);
			} else {
				await service.setAudiences([]);
			}
			if (req.body.aliases && req.body.aliases.length) {
				await service.setAliases(req.body.aliases);
			} else {
				await service.setAliases([]);
			}
			if (req.body.components && req.body.components.length) {
				await service.setComponents(req.body.components);
			} else {
				await service.setComponents([]);
			}
			if (req.body.articles && req.body.articles.length) {
				await service.setArticles(req.body.articles);
			} else {
				await service.setArticles([]);
			}
			if (req.body.portfolios && req.body.portfolios.length) {
				await service.setPortfolios(req.body.portfolios);
			} else {
				await service.setPortfolios([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await service.setGroups(req.body.groups);
			} else {
				await service.setGroups([]);
			}
			res.json(
				{
					service,
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
		Service.findById(req.params.id).then(async service => {
			if (!service) {
				next(404);
				return null;
			}
			service.modifiedBy = req.user.id;
			service.title = sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
			service.descriptionShort = sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone);
			service.descriptionLong = JSON.stringify(req.body.descriptionLong);
			service.idCatalogPhase = sanitizeHTML(req.body.idCatalogPhase, config.sanitizeHTML.allowNone);
			service.idCatalogStatus = sanitizeHTML(req.body.idCatalogStatus, config.sanitizeHTML.allowNone);
			service.availability = sanitizeHTML(req.body.availability, config.sanitizeHTML.allowNone);
			service.cost = sanitizeHTML(req.body.cost, config.sanitizeHTML.allowNone);
			service.support = sanitizeHTML(req.body.support, config.sanitizeHTML.allowNone);
			service.requirements = sanitizeHTML(req.body.requirements, config.sanitizeHTML.allowNone);
			service.requesting = sanitizeHTML(req.body.requesting, config.sanitizeHTML.allowNone);
			service.icon = sanitizeHTML(req.body.icon, config.sanitizeHTML.allowNone);
			service.color = sanitizeHTML(req.body.color, config.sanitizeHTML.allowNone);
			service.accessRestricted = sanitizeHTML(req.body.accessRestricted, config.sanitizeHTML.allowNone) == 'true';
			service.dateReviewBy = G.defaultDateReviewByFunction();
			// service.maintenance = sanitizeHTML(req.body.maintenance, config.sanitizeHTML.allowNone);
			// service.benefits = sanitizeHTML(req.body.benefits, config.sanitizeHTML.allowNone);
			// service.ownerService = sanitizeHTML(req.body.ownerService, config.sanitizeHTML.allowNone);
			// service.ownerBusiness = sanitizeHTML(req.body.ownerBusiness, config.sanitizeHTML.allowNone);
			service.dateReviewBy = G.defaultDateReviewByFunction();
			if (req.body.actions && req.body.actions.length) {
				await service.setActions(req.body.actions);
			} else {
				await service.setActions([]);
			}
			if (req.body.tags && req.body.tags.length) {
				await service.setTags(req.body.tags);
			} else {
				await service.setTags([]);
			}
			if (req.body.audiences && req.body.audiences.length) {
				await service.setAudiences(req.body.audiences);
			} else {
				await service.setAudiences([]);
			}
			if (req.body.aliases && req.body.aliases.length) {
				await service.setAliases(req.body.aliases);
			} else {
				await service.setAliases([]);
			}
			if (req.body.components && req.body.components.length) {
				await service.setComponents(req.body.components);
			} else {
				await service.setComponents([]);
			}
			if (req.body.articles && req.body.articles.length) {
				await service.setArticles(req.body.articles);
			} else {
				await service.setArticles([]);
			}
			if (req.body.portfolios && req.body.portfolios.length) {
				await service.setPortfolios(req.body.portfolios);
			} else {
				await service.setPortfolios([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await service.setGroups(req.body.groups);
			} else {
				await service.setGroups([]);
			}
			service.save().then(async service_ => {
				res.json(
					{
						service: service_,
						created: false,
						canRemoveGroups: await G.checkPermissions({req, entity: 'service', level: 'delete', entityID: service_.id})
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
						model: Service,
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
						entity: 'service',
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
