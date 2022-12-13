const Software = require('../models/Software.js');
const SoftwareOS = require('../models/SoftwareOS.js');
const SoftwarePhase = require('../models/SoftwarePhase.js');
const UserViewHistory = require('../models/UserViewHistory.js');
const G = require('./_global_logic.js');
const sanitizeHTML = require('sanitize-html');
const config = require('../config.js');
const logger = require('./logger.js');
const url = require('url');
const { Op } = require('sequelize');
const Group = require('../models/Group.js');
const GroupPermissionLevel = require('../models/GroupPermissionLevel.js');
const Permission = require('../models/Permission.js');
const PermissionLevel = require('../models/PermissionLevel.js');
const UserEditHistory = require('../models/UserEditHistory.js');
const CopyToken = require('../models/CopyToken.js');
const moment = require('moment');

module.exports = {
	renderById: async(req, res, next) => {
		const enforcePublished = await G.checkPermissions({req, entity: 'software', level: 'read', entityID: req.params.id}) ? {} : {title: 'publish'};
		Software.findOne(
			{
				where: {
					id: req.params.id
				},
				include: [
					{
						model: SoftwarePhase,
						where: enforcePublished
					}
				]
			}
		).then(software => {
			if (!software) {
				next(404);
				return null;
			}
			res.redirect(url.format({
				pathname: software.getURL(),
				query: req.query
			}));
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	render: async(req, res, next) => {
		const canRead = await G.checkPermissions({req, entity: 'software', level: 'read', entityID: req.params.id});
		Software.findByIdFast(req.params.id, !(canRead)).then(async software => {
			const { articles } = await Software.findByIdRelatedArticles(req.params.id, !(canRead));
			const { locations } = await Software.findByIdRelatedLocations(req.params.id, !(canRead));
			const { news } = await Software.findByIdRelatedNews(req.params.id, !(canRead));
			const { servers } = await Software.findByIdRelatedServers(req.params.id, !(canRead));
			const { packages } = await Software.findByIdRelatedPackage(req.params.id, !(canRead));
			const components  = null;
			const services  =  null;

			if (!software) {
				next(404);
				return null;
			} else if (req.path != software.getURL()) {
				res.redirect(url.format({
					pathname: software.getURL(),
					query: req.query
				}));
				return null;
			} else {
				const canEdit = await G.checkPermissions({req, entity: 'software', level: 'author', entityID: req.params.id});
				res.render('software/view.ejs', {
					software,
					canEdit,
					articles,
					locations,
					news,
					servers,
					packages
				});
				if (req.isAuthenticated()) {
					try {
						await UserViewHistory.recordView(req.user.id, 'software', software.id, software.title);
					} catch (err) {
						logger.err(err);
					}
					return null;
				} else {
					return null;
				}
			}
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getOne: (req, res, next) => {
		Software.findById(req.params.id, true).then(async software => {
			if (!software) {
				return next(404);
			} else if (software.getPhaseTitle() === 'publish') {
				return res.json(software);
			} else if (await G.checkPermissions({req, entity: 'software', level: 'read', entityID: req.params.id})) {
				return res.json(software);
			} else {
				return next(404);
			}
		}).catch(err => {
			return next(err);
		});
	},
	getAll: (req, res, next) => {
		Software.findAll(
			{
				include: [
					{
						model: SoftwarePhase,
						where: {
							title: 'publish'
						}
					},
					{
						model: SoftwareOS
					}
				]
			}
		).then(softwares => {
			res.json(softwares);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	new: (req, res, next) => {
		SoftwarePhase.findAll().then(phases => {
			res.render('software/view.ejs', {
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
		Software.findById(req.params.id).then(async software => {
			if (!software) {
				next(404);
				return null;
			} else {
				// check permission level
				const canPublish = await G.checkPermissions({req, entity: 'software', level: 'publish', entityID: req.params.id});
				let canRemoveGroups = await G.checkPermissions({req, entity: 'software', level: 'delete', entityID: req.params.id});

				if (!canRemoveGroups && typeof req.query !== 'undefined' && typeof req.query.copy_token === 'string') {
					const copyToken = await CopyToken.findOne(
						{
							where: {
								entity: 'software',
								entityID: software.id,
								guid: req.query.copy_token,
								isValid: true,
								expires: {
									[Op.gte]: moment().local()
								}
							}
						}
					);
					if (copyToken) {
						canRemoveGroups = true;
					}
				}

				let phases = [];
				if (canPublish) { // get phases if users can set the phase
					phases = await SoftwarePhase.findAll();
				}

				await UserEditHistory.recordView(req.user.id, 'software', software.id);

				res.render('software/view.ejs', {
					software,
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
		let releaseYear;
		try {
			releaseYear = parseInt(sanitizeHTML(req.body.releaseYear, config.sanitizeHTML.allowNone));
		} catch (err) {
			releaseYear = null;
		}
		if (isNaN(releaseYear)) {
			releaseYear = null;
		}
		Software.create({
			createdBy: req.user.id,
			idSoftwarePhase: sanitizeHTML(req.body.idSoftwarePhase, config.sanitizeHTML.allowNone),
			isAvailable: sanitizeHTML(req.body.isAvailable, config.sanitizeHTML.allowNone),
			title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
			descriptionShort: sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone),
			descriptionLong: JSON.stringify(req.body.descriptionLong),
			version: sanitizeHTML(req.body.version, config.sanitizeHTML.allowNone),
			supported: sanitizeHTML(req.body.supported, config.sanitizeHTML.allowNone),
			releaseYear: releaseYear,
			publisher: sanitizeHTML(req.body.publisher, config.sanitizeHTML.allowNone),
			// publisherShort: sanitizeHTML(req.body.publisherShort, config.sanitizeHTML.allowNone),
			// ownerSoftware: sanitizeHTML(req.body.ownerSoftware, config.sanitizeHTML.allowNone),
			// ownerBusiness: sanitizeHTML(req.body.ownerBusiness, config.sanitizeHTML.allowNone),
			// benefits: sanitizeHTML(req.body.benefits, config.sanitizeHTML.allowNone),
			isLicensed: sanitizeHTML(req.body.isLicensed, config.sanitizeHTML.allowNone),
			isCLA: sanitizeHTML(req.body.isCLA, config.sanitizeHTML.allowNone),
			isSCCM: sanitizeHTML(req.body.isSCCM, config.sanitizeHTML.allowNone),
			useWPI: sanitizeHTML(req.body.useWPI, config.sanitizeHTML.allowNone),
			usePersonal: sanitizeHTML(req.body.usePersonal, config.sanitizeHTML.allowNone),
			researchLicense: sanitizeHTML(req.body.researchLicense, config.sanitizeHTML.allowNone),
			availablePublicLabs: sanitizeHTML(req.body.availablePublicLabs, config.sanitizeHTML.allowNone),
			availableTerminalServer: sanitizeHTML(req.body.availableTerminalServer, config.sanitizeHTML.allowNone),
			AvailableVDI: sanitizeHTML(req.body.AvailableVDI, config.sanitizeHTML.allowNone),
			AvailableSplashtop: sanitizeHTML(req.body.AvailableSplashtop, config.sanitizeHTML.allowNone),
			USAOnly: sanitizeHTML(req.body.USAOnly, config.sanitizeHTML.allowNone),
			installWho: sanitizeHTML(req.body.installWho, config.sanitizeHTML.allowNone),
			requirements: sanitizeHTML(req.body.requirements, config.sanitizeHTML.allowNone),
			dependencies: sanitizeHTML(req.body.dependencies, config.sanitizeHTML.allowNone),
			requesting: sanitizeHTML(req.body.requesting, config.sanitizeHTML.allowNone),
			// installPointAdmin: sanitizeHTML(req.body.installPointAdmin, config.sanitizeHTML.allowNone),
			installPointPublic: sanitizeHTML(req.body.installPointPublic, config.sanitizeHTML.allowNone),
			accessRestricted: sanitizeHTML(req.body.accessRestricted, config.sanitizeHTML.allowNone) == 'true',
			dateReviewBy: G.defaultDateReviewByFunction()
		}).then(async software => {
			if (req.body.actions && req.body.actions.length) {
				await software.setActions(req.body.actions);
			} else {
				await software.setActions([]);
			}
			if (req.body.aliases && req.body.aliases.length) {
				await software.setAliases(req.body.aliases);
			} else {
				await software.setAliases([]);
			}
			if (req.body.articles && req.body.articles.length) {
				await software.setArticles(req.body.articles);
			} else {
				await software.setArticles([]);
			}
			if (req.body.audiences && req.body.audiences.length) {
				await software.setAudiences(req.body.audiences);
			} else {
				await software.setAudiences([]);
			}
			if (req.body.licenses && req.body.licenses.length) {
				await software.setLicenses(req.body.licenses);
			} else {
				await software.setLicenses([]);
			}
			if (req.body.locations && req.body.locations.length) {
				await software.setLocations(req.body.locations);
			} else {
				await software.setLocations([]);
			}
			// if (req.body.news && req.body.news.length) {
			//   await software.setNews(req.body.news);
			// } else {
			//   await software.setNews([]);
			// }
			if (req.body.servers && req.body.servers.length) {
				await software.setServers(req.body.servers);
			} else {
				await software.setServers([]);
			}
			if (req.body.softwareos && req.body.softwareos.length) {
				await software.setSoftwareOs(req.body.softwareos);
			} else {
				await software.setSoftwareOs([]);
			}
			if (req.body.tags && req.body.tags.length) {
				await software.setTags(req.body.tags);
			} else {
				await software.setTags([]);
			}
			if (req.body.softwareTypes && req.body.softwareTypes.length) {
				await software.setSoftwareTypes(req.body.softwareTypes);
			} else {
				await software.setSoftwareTypes([]);
			}
			if (req.body.components && req.body.components.length) {
				await software.setComponents(req.body.components);
			} else {
				await software.setComponents([]);
			}
			if (req.body.packages && req.body.packages.length) {
				await software.setPackages(req.body.packages);
			} else {
				await software.setPackages([]);
			}
			if (req.body.services && req.body.services.length) {
				await software.setServices(req.body.services);
			} else {
				await software.setServices([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await software.setGroups(req.body.groups);
			} else {
				await software.setGroups([]);
			}
			res.json({
				software,
				created: true
			});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	copyOne: (req, res, next) => {
		Software.findByPk(req.params.id).then(softwareSrc => {
			return Software.create({
				createdBy: req.user.id,
				idSoftwarePhase: 1,
				title: `${softwareSrc.title} copy`,
				descriptionShort: softwareSrc.descriptionShort,
				descriptionLong: softwareSrc.descriptionLong,
				isLicensed: softwareSrc.isLicensed,
				isCLA: softwareSrc.isCLA,
				isSCCM: softwareSrc.isSCCM,
				useWPI: softwareSrc.useWPI,
				usePersonal: softwareSrc.usePersonal,
				researchLicense: softwareSrc.researchLicense,
				availablePublicLabs: softwareSrc.availablePublicLabs,
				availableTerminalServer: softwareSrc.availableTerminalServer,
				AvailableVDI: softwareSrc.AvailableVDI,
				AvailableSplashtop: softwareSrc.AvailableSplashtop,
				USAOnly: softwareSrc.USAOnly,
				publisher: softwareSrc.publisher,
				publisherShort: softwareSrc.publisherShort,
				installWho: softwareSrc.installWho,
				requirements: softwareSrc.requirements,
				dependencies: softwareSrc.dependencies,
				requesting: softwareSrc.requesting,
				dateReviewBy: G.defaultDateReviewByFunction(),
			}).then(async software => {
				await software.setAudiences(await softwareSrc.getAudiences());
				await software.setSoftwareOs(await softwareSrc.getSoftwareOs());
				await software.setGroups(await softwareSrc.getGroups());
				const copyToken = await CopyToken.create(
					{
						entity: 'software',
						entityID: software.id
					}
				);
				software.save().then(software_ => {
					res.json(
						{
							type: 'software',
							id: software_.id,
							software: software_,
							created: true,
							copied: true,
							copiedFrom: req.params.id,
							copyToken: copyToken.guid
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
		}).catch(err => {
			next(err);
			return null;
		});
		return null;
	},
	updateOne: (req, res, next) => {
		Software.findById(req.params.id).then(async software => {
			if (!software) {
				next(404);
				return null;
			}
			let releaseYear;
			try {
				releaseYear = parseInt(sanitizeHTML(req.body.releaseYear, config.sanitizeHTML.allowNone));
			} catch (err) {
				releaseYear = null;
			}
			if (isNaN(releaseYear)) {
				releaseYear = null;
			}
			software.modifiedBy = req.user.id;
			software.idSoftwarePhase = sanitizeHTML(req.body.idSoftwarePhase, config.sanitizeHTML.allowNone);
			software.isAvailable = sanitizeHTML(req.body.isAvailable, config.sanitizeHTML.allowNone);
			software.title = sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
			software.descriptionShort = sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone);
			software.descriptionLong = JSON.stringify(req.body.descriptionLong);
			software.version = sanitizeHTML(req.body.version, config.sanitizeHTML.allowNone);
			software.supported = sanitizeHTML(req.body.supported, config.sanitizeHTML.allowNone);
			software.releaseYear = releaseYear;
			software.publisher = sanitizeHTML(req.body.publisher, config.sanitizeHTML.allowNone);
			// software.publisherShort = sanitizeHTML(req.body.publisherShort, config.sanitizeHTML.allowNone);
			// software.ownerSoftware = sanitizeHTML(req.body.ownerSoftware, config.sanitizeHTML.allowNone);
			// software.ownerBusiness = sanitizeHTML(req.body.ownerBusiness, config.sanitizeHTML.allowNone);
			// software.benefits = sanitizeHTML(req.body.benefits, config.sanitizeHTML.allowNone);
			software.isLicensed = sanitizeHTML(req.body.isLicensed, config.sanitizeHTML.allowNone);
			software.isCLA = sanitizeHTML(req.body.isCLA, config.sanitizeHTML.allowNone);
			software.isSCCM = sanitizeHTML(req.body.isSCCM, config.sanitizeHTML.allowNone);
			software.useWPI = sanitizeHTML(req.body.useWPI, config.sanitizeHTML.allowNone);
			software.usePersonal = sanitizeHTML(req.body.usePersonal, config.sanitizeHTML.allowNone);
			software.researchLicense = sanitizeHTML(req.body.researchLicense, config.sanitizeHTML.allowNone);
			software.availablePublicLabs = sanitizeHTML(req.body.availablePublicLabs, config.sanitizeHTML.allowNone);
			software.availableTerminalServer = sanitizeHTML(req.body.availableTerminalServer, config.sanitizeHTML.allowNone);
			software.availableVDI = sanitizeHTML(req.body.availableVDI, config.sanitizeHTML.allowNone);
			software.availableSplashtop = sanitizeHTML(req.body.availableSplashtop, config.sanitizeHTML.allowNone);
			software.usaOnly = sanitizeHTML(req.body.usaOnly, config.sanitizeHTML.allowNone);
			software.installWho = sanitizeHTML(req.body.installWho, config.sanitizeHTML.allowNone);
			software.requirements = sanitizeHTML(req.body.requirements, config.sanitizeHTML.allowNone);
			software.dependencies = sanitizeHTML(req.body.dependencies, config.sanitizeHTML.allowNone);
			software.requesting = sanitizeHTML(req.body.requesting, config.sanitizeHTML.allowNone);
			// software.installPointAdmin = sanitizeHTML(req.body.installPointAdmin, config.sanitizeHTML.allowNone);
			software.installPointPublic = sanitizeHTML(req.body.installPointPublic, config.sanitizeHTML.allowNone);
			software.accessRestricted = sanitizeHTML(req.body.accessRestricted, config.sanitizeHTML.allowNone) == 'true';
			software.dateReviewBy = G.defaultDateReviewByFunction();
			if (req.body.actions && req.body.actions.length) {
				await software.setActions(req.body.actions);
			} else {
				await software.setActions([]);
			}
			if (req.body.aliases && req.body.aliases.length) {
				await software.setAliases(req.body.aliases);
			} else {
				await software.setAliases([]);
			}
			if (req.body.articles && req.body.articles.length) {
				await software.setArticles(req.body.articles);
			} else {
				await software.setArticles([]);
			}
			if (req.body.audiences && req.body.audiences.length) {
				await software.setAudiences(req.body.audiences);
			} else {
				await software.setAudiences([]);
			}
			if (req.body.licenses && req.body.licenses.length) {
				await software.setLicenses(req.body.licenses);
			} else {
				await software.setLicenses([]);
			}
			if (req.body.locations && req.body.locations.length) {
				await software.setLocations(req.body.locations);
			} else {
				await software.setLocations([]);
			}
			// if (req.body.news && req.body.news.length) {
			//   await software.setNews(req.body.news);
			// } else {
			//   await software.setNews([]);
			// }
			if (req.body.servers && req.body.servers.length) {
				await software.setServers(req.body.servers);
			} else {
				await software.setServers([]);
			}
			if (req.body.softwareos && req.body.softwareos.length) {
				await software.setSoftwareOs(req.body.softwareos);
			} else {
				await software.setSoftwareOs([]);
			}
			if (req.body.tags && req.body.tags.length) {
				await software.setTags(req.body.tags);
			} else {
				await software.setTags([]);
			}
			if (req.body.softwareTypes && req.body.softwareTypes.length) {
				await software.setSoftwareTypes(req.body.softwareTypes);
			} else {
				await software.setSoftwareTypes([]);
			}
			if (req.body.components && req.body.components.length) {
				await software.setComponents(req.body.components);
			} else {
				await software.setComponents([]);
			}
			if (req.body.packages && req.body.packages.length) {
				await software.setPackages(req.body.packages);
			} else {
				await software.setPackages([]);
			}
			if (req.body.services && req.body.services.length) {
				await software.setServices(req.body.services);
			} else {
				await software.setServices([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await software.setGroups(req.body.groups);
			} else {
				await software.setGroups([]);
			}

			// mark copy token invalid if it exists
			if (typeof req.query !== 'undefined' && typeof req.query.copy_token === 'string') {
				const copyToken = await CopyToken.findOne(
					{
						where: {
							entity: 'software',
							entityID: software.id,
							guid: req.query.copy_token
						}
					}
				);
				copyToken.isValid = false;
				await copyToken.save();
			}

			software.save().then(async software_ => {
				res.json(
					{
						software: software_,
						created: false,
						canRemoveGroups: await G.checkPermissions({req, entity: 'software', level: 'delete', entityID: software_.id})
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
						model: Software,
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
						entity: 'software',
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
