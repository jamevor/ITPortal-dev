'use strict';
const Spread = require('../models/Spread.js');
const SpreadPhase = require('../models/SpreadPhase.js');
const SpreadLayout = require('../models/SpreadLayout.js');
const UserViewHistory = require('../models/UserViewHistory.js');
const FileUpload = require('../models/FileUpload.js');
const G = require('./_global_logic.js');
const sanitizeHTML = require('sanitize-html');
const config = require('../config.js');
const logger = require('./logger.js');
const path = require('path');
const moment = require('moment');
const fs = require('fs');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const url = require('url');
const Group = require('../models/Group.js');
const GroupPermissionLevel = require('../models/GroupPermissionLevel.js');
const Permission = require('../models/Permission.js');
const PermissionLevel = require('../models/PermissionLevel.js');
const UserEditHistory = require('../models/UserEditHistory.js');
const CopyToken = require('../models/CopyToken.js');
const { Op } = require('sequelize');

module.exports = {
	/**
   * VIEWS
   */
	renderById: async(req, res, next) => {
		const enforcePublished = await G.checkPermissions({req, entity: 'spread', level: 'read', entityID: req.params.id}) ? {} : {title: 'publish'};
		Spread.findOne(
			{
				where: {
					id: req.params.id
				},
				include: [
					{
						model: SpreadPhase,
						where: enforcePublished
					}
				]
			}
		).then(spread => {
			if (!spread) {
				next(404);
				return null;
			} else {
				res.redirect(url.format({
					pathname: spread.getURL(),
					query: req.query
				}));
				return null;
			}
		}).catch(err => {
			next(err);
			return null;
		});
	},
	render: async(req, res, next) => {
		Spread.findById(req.params.id, !(await G.checkPermissions({req, entity: 'spread', level: 'read', entityID: req.params.id}))).then(async spread => {
			let imageSrc;
			if (spread && spread.image) {
				imageSrc = spread.image.getURL();
			}
			if (!spread) {
				next(404);
				return null;
			} else if (req.path != spread.getURL()) {
				res.redirect(url.format({
					pathname: spread.getURL(),
					query: req.query
				}));
				return null;
			} else if (await G.checkPermissions({req, entity: 'spread', level: 'read', entityID: req.params.id})) {
				const canEdit = await G.checkPermissions({req, entity: 'spread', level: 'author', entityID: req.params.id});
				spread = spread.toJSON();
				if (imageSrc) {
					spread.image.src = imageSrc;
				}
				res.render('spread/view.ejs', {
					spread,
					canEdit
				});
				if (req.isAuthenticated()) {
					try {
						await UserViewHistory.recordView(req.user.id, 'spread', spread.id, spread.title);
					} catch (err) {
						logger.err(err);
					}
					return null;
				} else {
					return null;
				}
			} else if (spread.isPublished()) {
				spread = spread.toJSON();
				if (imageSrc) {
					spread.image.src = imageSrc;
				}
				res.render('spread/view.ejs', {
					spread,
					canEdit: false
				});
				if (req.isAuthenticated()) {
					try {
						await UserViewHistory.recordView(req.user.id, 'spread', spread.id, spread.title);
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
	new: (req, res, next) => {
		SpreadPhase.findAll().then(spreadPhases => {
			return SpreadLayout.findAll().then(spreadLayouts => {
				res.render('spread/view.ejs', {
					edit: true,
					canEdit: true,
					phases: spreadPhases,
					layouts: spreadLayouts
				});
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
	edit: (req, res, next) => {
		Spread.findById(req.params.id).then(spread => {
			if (!spread) {
				next(404);
				return null;
			} else {
				return SpreadLayout.findAll().then(async spreadLayouts => {
					// get header image
					let imageSrc;
					if (spread && spread.image) {
						imageSrc = spread.image.getURL();
					}
					spread = spread.toJSON();
					if (imageSrc) {
						spread.image.src = imageSrc;
					}
					// check permission level
					const canPublish = await G.checkPermissions({req, entity: 'spread', level: 'publish', entityID: req.params.id});
					let canRemoveGroups = await G.checkPermissions({req, entity: 'spread', level: 'delete', entityID: req.params.id});

					if (!canRemoveGroups && typeof req.query !== 'undefined' && typeof req.query.copy_token === 'string') {
						const copyToken = await CopyToken.findOne(
							{
								where: {
									entity: 'spread',
									entityID: spread.id,
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
						phases = await SpreadPhase.findAll();
					}

					await UserEditHistory.recordView(req.user.id, 'spread', spread.id);

					res.render('spread/view.ejs', {
						spread,
						edit: true,
						canEdit: true,
						phases,
						layouts: spreadLayouts,
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
	createOne: async(req, res, next) => {
		let newFileUploadID = null;
		if (req.file && sanitizeHTML(req.body.imageRemoved, config.sanitizeHTML.allowNone) !== 'true') {
			await new Promise((resolve, reject) => {
				const newFileUpload = FileUpload.build({
					path: sanitizeHTML(req.file.path, config.sanitizeHTML.allowNone),
					title: sanitizeHTML(moment().toISOString(), config.sanitizeHTML.allowNone),
					descriptionShort: sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone),
					altText: sanitizeHTML(req.body.altText, config.sanitizeHTML.allowNone),
					mimeType: sanitizeHTML(req.file.mimetype, config.sanitizeHTML.allowNone)
				});
				const filepath = path.parse(newFileUpload.path);
				const newFileName = encodeURI(`${filepath.dir}${path.sep}${newFileUpload.guid}${filepath.ext}`);
				fs.rename(req.file.path, newFileName, async err => {
					if (err) {
						next(err);
						return null;
					}
					await imagemin([newFileName], config.fileUpload.dir, {
						plugins: [
							imageminJpegtran(),
							imageminPngquant(
								{
									strip: true
								}
							),
							imageminGifsicle()
						]
					});
					newFileUpload.path = newFileName;
					newFileUpload.save().then(newFileUpload_s => {
						newFileUploadID = newFileUpload_s.id;
						resolve(newFileUploadID);
						return null;
					}).catch(err => {
						next(err);
						reject(err);
						return null;
					});
				});
			});
		}
		Spread.create({
			createdBy: req.user.id,
			modifiedBy: req.user.id,
			title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
			idSpreadPhase: sanitizeHTML(req.body.idSpreadPhase, config.sanitizeHTML.allowNone),
			idSpreadLayout: sanitizeHTML(req.body.idSpreadLayout, config.sanitizeHTML.allowNone),
			idImage: newFileUploadID,
			column1IsBox: sanitizeHTML(req.body.column1IsBox, config.sanitizeHTML.allowNone) == 'true',
			column2IsBox: sanitizeHTML(req.body.column2IsBox, config.sanitizeHTML.allowNone) == 'true',
			column3IsBox: sanitizeHTML(req.body.column3IsBox, config.sanitizeHTML.allowNone) == 'true',
			column1: req.body.column1,
			column2: req.body.column2,
			column3: req.body.column3,
			accessRestricted: sanitizeHTML(req.body.accessRestricted, config.sanitizeHTML.allowNone) == 'true',
			dateReviewBy: G.defaultDateReviewByFunction()
		}).then(async spread => {
			if (req.body.tags && req.body.tags.length) {
				await spread.setTags(req.body.tags.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await spread.setTags([]);
			}
			if (req.body.audiences && req.body.audiences.length) {
				await spread.setAudiences(req.body.audiences.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await spread.setAudiences([]);
			}
			if (req.body.aliases && req.body.aliases.length) {
				await spread.setAliases(req.body.aliases.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await spread.setAliases([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await spread.setGroups(req.body.groups.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await spread.setGroups([]);
			}
			spread.save().then(spread_ => {
				res.json(
					{
						spread: spread_,
						created: true
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
	copyOne: (req, res, next) => {
		Spread.findByPk(req.params.id).then(spreadSrc => {
			Spread.create({
				createdBy: req.user.id,
				idSpreadLayout: spreadSrc.idSpreadLayout,
				idSpreadPhase: 1,
				title: `${spreadSrc.title} copy`,
				column1IsBox: spreadSrc.column1IsBox,
				column2IsBox: spreadSrc.column2IsBox,
				column3IsBox: spreadSrc.column3IsBox,
				column1: spreadSrc.column1,
				column2: spreadSrc.column2,
				column3: spreadSrc.column3,
				accessRestricted: spreadSrc.accessRestricted,
				dateReviewBy: G.defaultDateReviewByFunction()
			}).then(async spread => {
				await spread.setTags(await spreadSrc.getTags());
				await spread.setAudiences(await spreadSrc.getAudiences());
				await spread.setAliases(await spreadSrc.getAliases());
				await spread.setGroups(await spreadSrc.getGroups());
				const copyToken = await CopyToken.create(
					{
						entity: 'spread',
						entityID: spread.id
					}
				);
				spread.save().then(spread_ => {
					res.json(
						{
							type: 'spread',
							id: spread_.id,
							spread: spread_,
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
	updateOne: async(req, res, next) => {
		let newFileUploadID = null;
		if (req.file && sanitizeHTML(req.body.imageRemoved, config.sanitizeHTML.allowNone) !== 'true') {
			await new Promise((resolve, reject) => {
				const newFileUpload = FileUpload.build({
					path: sanitizeHTML(req.file.path, config.sanitizeHTML.allowNone),
					title: sanitizeHTML(moment().toISOString(), config.sanitizeHTML.allowNone),
					descriptionShort: sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone),
					altText: sanitizeHTML(req.body.altText, config.sanitizeHTML.allowNone),
					mimeType: sanitizeHTML(req.file.mimetype, config.sanitizeHTML.allowNone)
				});
				const filepath = path.parse(newFileUpload.path);
				const newFileName = encodeURI(`${filepath.dir}${path.sep}${newFileUpload.guid}${filepath.ext}`);
				fs.rename(req.file.path, newFileName, async err => {
					if (err) {
						next(err);
						return null;
					}
					await imagemin([newFileName], config.fileUpload.dir, {
						plugins: [
							imageminJpegtran(),
							imageminPngquant(
								{
									strip: true
								}
							),
							imageminGifsicle()
						]
					});
					newFileUpload.path = newFileName;
					newFileUpload.save().then(newFileUpload_s => {
						newFileUploadID = newFileUpload_s.id;
						resolve(newFileUploadID);
						return null;
					}).catch(err => {
						next(err);
						reject(err);
						return null;
					});
				});
			});
		}
		Spread.findById(req.params.id).then(async spread => {
			if (!spread) {
				next(404);
				return null;
			}
			spread.modifiedBy = req.user.id;
			spread.title = sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
			spread.idSpreadPhase = sanitizeHTML(req.body.idSpreadPhase, config.sanitizeHTML.allowNone);
			spread.idSpreadLayout = sanitizeHTML(req.body.idSpreadLayout, config.sanitizeHTML.allowNone);
			spread.column1IsBox = sanitizeHTML(req.body.column1IsBox, config.sanitizeHTML.allowNone) == 'true';
			spread.column2IsBox = sanitizeHTML(req.body.column2IsBox, config.sanitizeHTML.allowNone) == 'true';
			spread.column3IsBox = sanitizeHTML(req.body.column3IsBox, config.sanitizeHTML.allowNone) == 'true';
			spread.column1 = req.body.column1;
			spread.column2 = req.body.column2;
			spread.column3 = req.body.column3;
			spread.accessRestricted = sanitizeHTML(req.body.accessRestricted, config.sanitizeHTML.allowNone) == 'true';
			spread.dateReviewBy = G.defaultDateReviewByFunction();
			if (sanitizeHTML(req.body.imageRemoved, config.sanitizeHTML.allowNone) !== 'true') {
				spread.idImage = newFileUploadID || spread.idImage;
			} else {
				spread.idImage = null;
			}
			if (req.body.tags && req.body.tags.length) {
				await spread.setTags(req.body.tags.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await spread.setTags([]);
			}
			if (req.body.audiences && req.body.audiences.length) {
				await spread.setAudiences(req.body.audiences.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await spread.setAudiences([]);
			}
			if (req.body.aliases && req.body.aliases.length) {
				await spread.setAliases(req.body.aliases.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await spread.setAliases([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await spread.setGroups(req.body.groups.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await spread.setGroups([]);
			}

			// mark copy token invalid if it exists
			if (typeof req.query !== 'undefined' && typeof req.query.copy_token === 'string') {
				const copyToken = await CopyToken.findOne(
					{
						where: {
							entity: 'spread',
							entityID: spread.id,
							guid: req.query.copy_token
						}
					}
				);
				copyToken.isValid = false;
				await copyToken.save();
			}

			spread.save().then(async spread_ => {
				res.json(
					{
						spread: spread_,
						created: false,
						canRemoveGroups: await G.checkPermissions({req, entity: 'spread', level: 'delete', entityID: spread_.id})
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
						model: Spread,
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
						entity: 'spread',
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