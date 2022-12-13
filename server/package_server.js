const Package = require('../models/Package.js');
const PackagePhase = require('../models/PackagePhase.js');
const G = require('./_global_logic.js');
const config = require('../config.js');
const sanitizeHTML = require('sanitize-html');
const url = require('url');

module.exports = {
	renderById: async(req, res, next) => {
		const enforcePublished = await G.checkPermissions({req, entity: 'package', level: 'read', entityID: req.params.id}) ? {} : {title: 'publish'};
		Package.findOne(
			{
				where: {
					id: req.params.id
				},
				include: [
					{
						model: PackagePhase,
						where: enforcePublished
					}
				]
			}).then(package_ => {
			if (!package_) {
				next(404);
				return null;
			}
			res.redirect(url.format({
				pathname: package_.getURL(),
				query: req.query
			}));
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	render: async(req, res, next) => {
		Package.findById(req.params.id, !(await G.checkPermissions({req, entity: 'package', level: 'read', entityID: req.params.id}))).then(async package_ => {
			if (!package_) {
				next(404);
				return null;
			} else if (req.path != package_.getURL()) {
				res.redirect(url.format({
					pathname: package_.getURL(),
					query: req.query
				}));
				return null;
			} else if (await G.checkPermissions({req, entity: 'package', level: 'read', entityID: req.params.id})) {
				const canEdit = await G.checkPermissions({req, entity: 'package', level: 'author', entityID: req.params.id});
				res.render('package/view.ejs', {
					package: package_,
					canEdit
				});
				// packages are not recorded in UserViewHistory
				return null;
			} else if (package_.getPhaseTitle() === 'publish') {
				res.render('package/view.ejs', {
					package: package_,
					canEdit: false
				});
				// packages are not recorded in UserViewHistory
				return null;
			} else {
				next(404);
				return null;
			}
		}).catch(err => {
			next(err);
			return null;
		});
	},
	new: (req, res, next) => {
		PackagePhase.findAll().then(phases => {
			res.render('package/view.ejs', {
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
		Package.findById(req.params.id).then(package_ => {
			if (!package_) {
				next(404);
				return null;
			} else {
				return PackagePhase.findAll().then(phases => {
					res.render('package/view.ejs', {
						package: package_,
						edit: true,
						canEdit: true,
						phases
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
		Package.create({
			createdBy: req.user.id,
			title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
			descriptionShort: sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone),
			idPackagePhase: sanitizeHTML(req.body.idPackagePhase, config.sanitizeHTML.allowNone),
		}).then(async package_ => {
			if (req.body.software && req.body.software.length) {
				await package_.setSoftware(req.body.software);
			} else {
				await package_.setSoftware([]);
			}
			if (req.body.locations && req.body.locations.length) {
				await package_.setLocations(req.body.locations);
			} else {
				await package_.setLocations([]);
			}
			if (req.body.servers && req.body.servers.length) {
				await package_.setServers(req.body.servers);
			} else {
				await package_.setServers([]);
			}
			res.json({package: package_, created: true});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	updateOne: (req, res, next) => {
		Package.findById(req.params.id).then(async package_ => {
			if (!package_) {
				next(404);
				return null;
			}
			package_.modifiedBy = req.user.id;
			package_.title = sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
			package_.descriptionShort = sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone);
			package_.idPackagePhase = sanitizeHTML(req.body.idPackagePhase, config.sanitizeHTML.allowNone);
			if (req.body.software && req.body.software.length) {
				await package_.setSoftware(req.body.software);
			} else {
				await package_.setSoftware([]);
			}
			if (req.body.locations && req.body.locations.length) {
				await package_.setLocations(req.body.locations);
			} else {
				await package_.setLocations([]);
			}
			if (req.body.servers && req.body.servers.length) {
				await package_.setServers(req.body.servers);
			} else {
				await package_.setServers([]);
			}
			package_.save().then(package_saved => {
				res.json(
					{
						package: package_saved,
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
		Package.findById(req.params.id).then(async package_ => {
			if (!package_) {
				next(404);
				return null;
			} else if (package_.packagePhase && package_.packagePhase.title && package_.packagePhase.title.toLowerCase() === 'publish') {
				res.json(package_);
				return null;
			} else if (await G.checkPermissions(req, 'package', 'read')) {
				res.json(package_);
				return null;
			} else {
				next(404);
				return null;
			}
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getAll: (req, res, next) => {
		Package.findAll(
			{
				include: [
					{
						model: PackagePhase,
						where: {
							title: 'publish'
						}
					},
				]
			}
		).then(packages => {
			res.json(packages);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	}
};
