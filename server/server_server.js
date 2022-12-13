const G = require('./_global_logic.js');
const Server = require('../models/Server.js');
const ServerPhase = require('../models/ServerPhase.js');
const UserViewHistory = require('../models/UserViewHistory.js');
const logger = require('./logger.js');
const config = require('../config.js');
const sanitizeHTML = require('sanitize-html');
const url = require('url');
const Group = require('../models/Group.js');
const GroupPermissionLevel = require('../models/GroupPermissionLevel.js');
const Permission = require('../models/Permission.js');
const PermissionLevel = require('../models/PermissionLevel.js');
const UserEditHistory = require('../models/UserEditHistory.js');

module.exports = {
	renderById: async(req, res, next) => {
		const enforcePublished = await G.checkPermissions({req, entity: 'server', level: 'read', entityID: req.params.id}) ? {} : {title: 'publish'};
		Server.findOne(
			{
				where: {
					id: req.params.id
				},
				include: [
					{
						model: ServerPhase,
						where: enforcePublished
					}
				]
			}).then(server => {
			if (!server) {
				next(404);
				return null;
			}
			res.redirect(url.format({
				pathname: server.getURL(),
				query: req.query
			}));
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	render: async(req, res, next) => {
		Server.findById(req.params.id, !(await G.checkPermissions({req, entity: 'server', level: 'read', entityID: req.params.id}))).then(async server => {
			if (!server) {
				next(404);
				return null;
			} else if (req.path != server.getURL()) {
				res.redirect(url.format({
					pathname: server.getURL(),
					query: req.query
				}));
				return null;
			} else if (await G.checkPermissions({req, entity: 'server', level: 'read', entityID: req.params.id})) {
				const canEdit = await G.checkPermissions({req, entity: 'server', level: 'author', entityID: req.params.id});
				res.render('server/view.ejs', {
					server,
					canEdit
				});
				if (req.isAuthenticated()) {
					try {
						await UserViewHistory.recordView(req.user.id, 'server', server.id, server.title);
					} catch (err) {
						logger.err(err);
					}
					return null;
				} else {
					return null;
				}
			} else if (server.getPhaseTitle() === 'publish') {
				res.render('server/view.ejs', {
					server,
					canEdit: false
				});
				if (req.isAuthenticated()) {
					try {
						await UserViewHistory.recordView(req.user.id, 'server', server.id, server.title);
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
		Server.findById(req.params.id).then(server => {
			if (!server) {
				return next(404);
			} else if (server.getPhaseTitle() === 'publish') {
				return res.json(server);
			} else if (G.checkPermissions({req, entity: 'server', level: 'read', entityID: req.params.id})) {
				return res.json(server);
			} else {
				return next(404);
			}
		}).catch(err => {
			return next(err);
		});
	},
	getAll: (req, res, next) => {
		Server.findAll(
			{
				where: {
					isArchived: false
				},
				include: [
					{
						model: ServerPhase,
						where: {
							title: 'publish'
						}
					}
				]
			}
		).then(servers => {
			res.json(servers);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	new: (req, res, next) => {
		ServerPhase.findAll().then(phases => {
			res.render('server/view.ejs', {
				edit: true,
				canEdit: true,
				phases
			});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	edit: (req, res, next) => {
		Server.findById(req.params.id).then(async server => {
			if (!server) {
				next(404);
				return null;
			} else {
				// check permission level
				const canPublish = await G.checkPermissions({req, entity: 'server', level: 'publish', entityID: req.params.id});
				let canRemoveGroups = await G.checkPermissions({req, entity: 'server', level: 'delete', entityID: req.params.id});

				let phases = [];
				if (canPublish) { // get phases if users can set the phase
					phases = await ServerPhase.findAll();
				}

				await UserEditHistory.recordView(req.user.id, 'server', server.id);

				res.render('server/view.ejs', {
					server,
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
		Server.create({
			createdBy: req.user.id,
			idServerPhase: sanitizeHTML(req.body.idServerPhase, config.sanitizeHTML.allowNone),
			title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
			host: sanitizeHTML(req.body.host, config.sanitizeHTML.allowNone),
			descriptionShort: sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone),
			requirements: sanitizeHTML(req.body.requirements, config.sanitizeHTML.allowNone),
			ownerIT: sanitizeHTML(req.body.ownerIT, config.sanitizeHTML.allowNone),
			ownerBusiness: sanitizeHTML(req.body.ownerBusiness, config.sanitizeHTML.allowNone),
			accessRestricted: sanitizeHTML(req.body.accessRestricted, config.sanitizeHTML.allowNone) == 'true'
		}).then(async server => {
			if (req.body.aliases && req.body.aliases.length) {
				await server.setAliases(req.body.aliases);
			} else {
				await server.setAliases([]);
			}
			if (req.body.audiences && req.body.audiences.length) {
				await server.setAudiences(req.body.audiences);
			} else {
				await server.setAudiences([]);
			}
			if (req.body.tags && req.body.tags.length) {
				await server.setTags(req.body.tags);
			} else {
				await server.setTags([]);
			}
			if (req.body.packages && req.body.packages.length) {
				await server.setPackages(req.body.packages);
			} else {
				await server.setPackages([]);
			}
			if (req.body.software && req.body.software.length) {
				await server.setSoftware(req.body.software);
			} else {
				await server.setSoftware([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await server.setGroups(req.body.groups);
			} else {
				await server.setGroups([]);
			}
			res.json({
				server,
				created: true
			});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	updateOne: (req, res, next) => {
		Server.findById(req.params.id).then(async server => {
			if (!server) {
				next(404);
				return null;
			}
			server.modifiedBy = req.user.id;
			server.idServerPhase = sanitizeHTML(req.body.idServerPhase, config.sanitizeHTML.allowNone);
			server.title = sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
			server.host = sanitizeHTML(req.body.host, config.sanitizeHTML.allowNone);
			server.descriptionShort = sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone);
			server.requirements = sanitizeHTML(req.body.requirements, config.sanitizeHTML.allowNone);
			server.ownerIT = sanitizeHTML(req.body.ownerIT, config.sanitizeHTML.allowNone);
			server.ownerBusiness = sanitizeHTML(req.body.ownerBusiness, config.sanitizeHTML.allowNone);
			server.accessRestricted = sanitizeHTML(req.body.accessRestricted, config.sanitizeHTML.allowNone) == 'true';
			if (req.body.aliases && req.body.aliases.length) {
				await server.setAliases(req.body.aliases);
			} else {
				await server.setAliases([]);
			}
			if (req.body.audiences && req.body.audiences.length) {
				await server.setAudiences(req.body.audiences);
			} else {
				await server.setAudiences([]);
			}
			if (req.body.tags && req.body.tags.length) {
				await server.setTags(req.body.tags);
			} else {
				await server.setTags([]);
			}
			if (req.body.packages && req.body.packages.length) {
				await server.setPackages(req.body.packages);
			} else {
				await server.setPackages([]);
			}
			if (req.body.software && req.body.software.length) {
				await server.setSoftware(req.body.software);
			} else {
				await server.setSoftware([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await server.setGroups(req.body.groups);
			} else {
				await server.setGroups([]);
			}
			server.save().then(async server_ => {
				res.json(
					{
						server: server_,
						created: false,
						canRemoveGroups: await G.checkPermissions({req, entity: 'server', level: 'delete', entityID: server_.id})
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
						model: Server,
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
						entity: 'server',
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
