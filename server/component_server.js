const Component = require('../models/Component.js');
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
		const enforcePublished = await G.checkPermissions({req, entity: 'component', level: 'read', entityID: req.params.id}) ? {} : {title: 'publish'};
		Component.findOne(
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
			}).then(component => {
			if (!component) {
				return next(404);
			}
			res.redirect(url.format({
				pathname: component.getURL(),
				query: req.query
			}));
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	render: async(req, res, next) => {
		const canRead = await G.checkPermissions({req, entity: 'component', level: 'read', entityID: req.params.id});
		Component.findByIdFast(req.params.id, !(canRead)).then(async component => {
			const { articles } = await Component.findByIdRelatedArticles(req.params.id, !(canRead));

			if (!component) {
				next(404);
				return null;
			} else if (req.path != component.getURL()) {
				res.redirect(url.format({
					pathname: component.getURL(),
					query: req.query
				}));
				return null;
			} else if (canRead) {
				const canEdit = await G.checkPermissions({req, entity: 'component', level: 'author', entityID: req.params.id});
				res.render('component/view.ejs', { component, canEdit, articles});
				if (req.isAuthenticated()) {
					try {
						await UserViewHistory.recordView(req.user.id, 'component', component.id, component.title);
					} catch (err) {
						logger.err(err);
					}
					return null;
				} else {
					return null;
				}
			} else if (component.getPhaseTitle() === 'publish') {
				res.render('component/view.ejs', {component, canEdit: false,articles});
				if (req.isAuthenticated()) {
					try {
						await UserViewHistory.recordView(req.user.id, 'component', component.id, component.title);
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
		Component.findByIdFast(req.params.id).then(async component => {

			const { articles } = await Component.findByIdRelatedArticles(req.params.id);
			const { news } = await Component.findByIdRelatedNews(req.params.id);


			if (!component) {
				return next(404);
			} else if (component.getPhaseTitle() === 'publish') {
				return res.json({component,articles,news});
			} else if (G.checkPermissions({req, entity: 'component', level: 'read', entityID: req.params.id})) {
				return res.json({component,articles,news});
			} else {
				return next(404);
			}
		}).catch(err => {
			return next(err);
		});
	},
	getMany: (req, res, next) => {
		// build query
		const QUERY = {};
		if (req.params.service !== undefined) {
			QUERY.idService = sanitizeHTML(req.params.service, config.sanitizeHTML.allowNone);
		}
		// execute
		Component.findAll(
			{
				where: QUERY
			}
		).then(components => {
			res.json({components});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getAll: (req, res, next) => {
		Component.findAll(
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
		).then(components => {
			res.json(components);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	new: (req, res, next) => {
		return Promise.all([ CatalogPhase.findAll(), CatalogStatus.findAll()]).then(values => {
			res.render('component/view.ejs', {
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
		Component.findById(req.params.id).then(component => {
			if (!component) {
				next(404);
				return null;
			} else {
				return CatalogStatus.findAll().then(async statuses => {

					// check permission level
					const canPublish = await G.checkPermissions({req, entity: 'component', level: 'publish', entityID: req.params.id});
					let canRemoveGroups = await G.checkPermissions({req, entity: 'component', level: 'delete', entityID: req.params.id});

					let phases = [];
					if (canPublish) { // get phases if users can set the phase
						phases = await CatalogPhase.findAll();
					}

					await UserEditHistory.recordView(req.user.id, 'component', component.id);

					res.render('component/view.ejs', {
						component,
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
		Component.create({
			createdBy: req.user.id,
			title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
			descriptionShort: sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone),
			descriptionLong: JSON.stringify(req.body.descriptionLong),
			idCatalogPhase: sanitizeHTML(req.body.idCatalogPhase, config.sanitizeHTML.allowNone),
			idCatalogStatus: sanitizeHTML(req.body.idCatalogStatus, config.sanitizeHTML.allowNone),
			idService: sanitizeHTML(req.body.idService, config.sanitizeHTML.allowNone),
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
			// ownerComponent: sanitizeHTML(req.body.ownerComponent, config.sanitizeHTML.allowNone),
			// ownerBusiness: sanitizeHTML(req.body.ownerBusiness, config.sanitizeHTML.allowNone)
		}).then(async component => {
			if (req.body.articles && req.body.articles.length) {
				await component.setArticles(req.body.articles);
			} else {
				await component.setArticles([]);
			}
			if (req.body.actions && req.body.actions.length) {
				await component.setActions(req.body.actions);
			} else {
				await component.setActions([]);
			}
			if (req.body.tags && req.body.tags.length) {
				await component.setTags(req.body.tags);
			} else {
				await component.setTags([]);
			}
			if (req.body.aliases && req.body.aliases.length) {
				await component.setAliases(req.body.aliases);
			} else {
				await component.setAliases([]);
			}
			if (req.body.audiences && req.body.audiences.length) {
				await component.setAudiences(req.body.audiences);
			} else {
				await component.setAudiences([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await component.setGroups(req.body.groups);
			} else {
				await component.setGroups([]);
			}
			res.json({component, created: true});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	updateOne: (req, res, next) => {
		Component.findById(req.params.id).then(async component => {
			if (!component) {
				next(404);
				return null;
			}
			component.modifiedBy = req.user.id;
			component.title = sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
			component.descriptionShort = sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone);
			component.descriptionLong = JSON.stringify(req.body.descriptionLong);
			component.idCatalogPhase = sanitizeHTML(req.body.idCatalogPhase, config.sanitizeHTML.allowNone);
			component.idCatalogStatus = sanitizeHTML(req.body.idCatalogStatus, config.sanitizeHTML.allowNone);
			component.idService = sanitizeHTML(req.body.idService, config.sanitizeHTML.allowNone);
			component.availability = sanitizeHTML(req.body.availability, config.sanitizeHTML.allowNone);
			component.cost = sanitizeHTML(req.body.cost, config.sanitizeHTML.allowNone);
			component.support = sanitizeHTML(req.body.support, config.sanitizeHTML.allowNone);
			component.requirements = sanitizeHTML(req.body.requirements, config.sanitizeHTML.allowNone);
			component.requesting = sanitizeHTML(req.body.requesting, config.sanitizeHTML.allowNone);
			component.icon = sanitizeHTML(req.body.icon, config.sanitizeHTML.allowNone);
			component.color = sanitizeHTML(req.body.color, config.sanitizeHTML.allowNone);
			component.accessRestricted = sanitizeHTML(req.body.accessRestricted, config.sanitizeHTML.allowNone) == 'true';
			component.dateReviewBy = G.defaultDateReviewByFunction();
			// component.maintenance = sanitizeHTML(req.body.maintenance, config.sanitizeHTML.allowNone);
			// component.benefits = sanitizeHTML(req.body.benefits, config.sanitizeHTML.allowNone);
			// component.ownerComponent = sanitizeHTML(req.body.ownerComponent, config.sanitizeHTML.allowNone);
			// component.ownerBusiness = sanitizeHTML(req.body.ownerBusiness, config.sanitizeHTML.allowNone);
			if (req.body.articles && req.body.articles.length) {
				await component.setArticles(req.body.articles);
			} else {
				await component.setArticles([]);
			}
			if (req.body.actions && req.body.actions.length) {
				await component.setActions(req.body.actions);
			} else {
				await component.setActions([]);
			}
			if (req.body.tags && req.body.tags.length) {
				await component.setTags(req.body.tags);
			} else {
				await component.setTags([]);
			}
			if (req.body.aliases && req.body.aliases.length) {
				await component.setAliases(req.body.aliases);
			} else {
				await component.setAliases([]);
			}
			if (req.body.audiences && req.body.audiences.length) {
				await component.setAudiences(req.body.audiences);
			} else {
				await component.setAudiences([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await component.setGroups(req.body.groups);
			} else {
				await component.setGroups([]);
			}
			component.save().then(async component_ => {
				res.json(
					{
						component: component_,
						created: false,
						canRemoveGroups: await G.checkPermissions({req, entity: 'component', level: 'delete', entityID: component_.id})
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
						model: Component,
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
						entity: 'component',
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
