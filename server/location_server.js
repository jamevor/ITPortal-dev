const Location = require('../models/Location.js');
const LocationType = require('../models/LocationType.js');
const Building = require('../models/Building.js');
const Alias = require('../models/Alias.js');
const UserViewHistory = require('../models/UserViewHistory.js');
const SpacePhase = require('../models/SpacePhase.js');
const MetadataPhase = require('../models/MetadataPhase.js');
const FileUpload = require('../models/FileUpload.js');
const moment = require('moment');
const G = require('./_global_logic.js');
const sanitizeHTML = require('sanitize-html');
const config = require('../config.js');
const logger = require('./logger.js');
const fs = require('fs');
const path = require('path');
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

module.exports = {
	renderById: async(req, res, next) => {
		const enforcePublished = await G.checkPermissions({req, entity: 'location', level: 'read', entityID: req.params.id}) ? {} : {title: 'publish'};
		Location.findOne(
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
			}).then(location => {
			if (!location) {
				next(404);
				return null;
			}
			res.redirect(url.format({
				pathname: location.getURL(),
				query: req.query
			}));
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	render: async(req, res, next) => {
		Location.findById(req.params.id, !(await G.checkPermissions({req, entity: 'location', level: 'read', entityID: req.params.id}))).then(async location => {
			let imageSrc;
			if (location && location.image) {
				imageSrc = location.image.getURL();
			}
			if (!location) {
				next(404);
				return null;
			} else if (req.path != location.getURL()) {
				res.redirect(url.format({
					pathname: location.getURL(),
					query: req.query
				}));
				return null;
			} else {
				const canEdit = await G.checkPermissions({req, entity: 'location', level: 'author', entityID: req.params.id});
				location = location.toJSON();
				if (imageSrc) {
					location.image.src = imageSrc;
				}
				res.render('location/view.ejs', {
					location,
					canEdit
				});
				if (req.isAuthenticated()) {
					try {
						await UserViewHistory.recordView(req.user.id, 'location', location.id, location.title);
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
		Location.findById(req.params.id).then(location => {
			if (!location) {
				return next(404);
			} else {
				return res.json(location);
			}
		}).catch(err => {
			return next(err);
		});
	},
	getAll: async(req, res, next) => {
		const enforcePublished_ = !(await G.checkPermissions({req, entity: 'location', level: 'read'})) ? {title: 'publish'} : {};
		Location.findAll(
			{
				include: [
					{
						model: SpacePhase,
						required: true,
						where: enforcePublished_
					},
					{
						model: LocationType,
						required: true
					},
					{
						model: Building,
						include: [
							{
								model: SpacePhase,
								required: true,
								where: enforcePublished_
							}
						]
					},
					{
						model: Alias,
						required: false,
						include: [
							{
								model: MetadataPhase,
								required: true,
								where: enforcePublished_
							}
						]
					}
				]
			}
		).then(locations => {
			res.json(locations);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	new: (req, res, next) => {
		LocationType.findAll().then(locationTypes => {
			res.render('location/view.ejs', {
				edit: true,
				canEdit: true,
				locationTypes
			});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	edit: (req, res, next) => {
		Location.findById(req.params.id).then(location => {
			if (!location) {
				next(404);
				return null;
			} else {
				return LocationType.findAll().then(async locationTypes => {
					// check permission level
					const canPublish = await G.checkPermissions({req, entity: 'location', level: 'publish', entityID: req.params.id});
					let canRemoveGroups = await G.checkPermissions({req, entity: 'location', level: 'delete', entityID: req.params.id});

					let phases = [];
					if (canPublish) { // get phases if users can set the phase
						phases = await SpacePhase.findAll();
					}

					await UserEditHistory.recordView(req.user.id, 'location', location.id);

					res.render('location/view.ejs', {
						location,
						edit: true,
						canEdit: true,
						locationTypes,
						canPublish,
						phases,
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
		Location.create({
			createdBy: req.user.id,
			title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
			descriptionShort: sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone),
			roomNotes: req.body.roomNotes,
			idSpacePhase: sanitizeHTML(req.body.idSpacePhase, config.sanitizeHTML.allowNone),
			idLocationType: sanitizeHTML(req.body.idLocationType, config.sanitizeHTML.allowNone),
			hasPrinter: sanitizeHTML(req.body.hasPrinter, config.sanitizeHTML.allowNone),
			hasColorPrinter: sanitizeHTML(req.body.hasColorPrinter, config.sanitizeHTML.allowNone),
			hasPharos: sanitizeHTML(req.body.hasPharos, config.sanitizeHTML.allowNone),
			hasProjection: sanitizeHTML(req.body.hasProjection, config.sanitizeHTML.allowNone),
			hasDualProjection: sanitizeHTML(req.body.hasDualProjection, config.sanitizeHTML.allowNone),
			hasDocCamera: sanitizeHTML(req.body.hasDocCamera, config.sanitizeHTML.allowNone),
			hasLectureCap: sanitizeHTML(req.body.hasLectureCap, config.sanitizeHTML.allowNone),
			hasVoiceAmp: sanitizeHTML(req.body.hasVoiceAmp, config.sanitizeHTML.allowNone),
			hasWirelessVoiceAmp: sanitizeHTML(req.body.hasWirelessVoiceAmp, config.sanitizeHTML.allowNone),
			hasPOD: sanitizeHTML(req.body.hasPOD, config.sanitizeHTML.allowNone),
			hasDisplay: sanitizeHTML(req.body.hasDisplay, config.sanitizeHTML.allowNone),
			hasHostPC: sanitizeHTML(req.body.hasHostPC, config.sanitizeHTML.allowNone),
			hasWacomTouchscreen: sanitizeHTML(req.body.hasWacomTouchscreen, config.sanitizeHTML.allowNone),
			hasHDMILaptopCable: sanitizeHTML(req.body.hasHDMILaptopCable, config.sanitizeHTML.allowNone),
			hasUSBCLaptopCable: sanitizeHTML(req.body.hasUSBCLaptopCable, config.sanitizeHTML.allowNone),
			hasBlurayPlayer: sanitizeHTML(req.body.hasBlurayPlayer, config.sanitizeHTML.allowNone),
			hasZoomCapable: sanitizeHTML(req.body.hasZoomCapable, config.sanitizeHTML.allowNone),
			room: sanitizeHTML(req.body.room, config.sanitizeHTML.allowNone),
			seats: sanitizeHTML(req.body.seats, config.sanitizeHTML.allowNone) || null,
			computers: sanitizeHTML(req.body.computers, config.sanitizeHTML.allowNone) || null,
			idBuilding: sanitizeHTML(req.body.idBuilding, config.sanitizeHTML.allowNone),
			idImage: newFileUploadID,
			accessRestricted: sanitizeHTML(req.body.accessRestricted, config.sanitizeHTML.allowNone) == 'true',
			dateReviewBy: G.defaultDateReviewByFunction()
		}).then(async location => {
			if (req.body.tags && req.body.tags.length) {
				await location.setTags(req.body.tags.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await location.setTags([]);
			}
			if (req.body.audiences && req.body.audiences.length) {
				await location.setAudiences(req.body.audiences.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await location.setAudiences([]);
			}
			if (req.body.aliases && req.body.aliases.length) {
				await location.setAliases(req.body.aliases.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await location.setAliases([]);
			}
			if (req.body.software && req.body.software.length) {
				await location.setSoftware(req.body.software.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await location.setSoftware([]);
			}
			if (req.body.packages && req.body.packages.length) {
				await location.setPackages(req.body.packages.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await location.setPackages([]);
			}
			if (req.body.articles && req.body.articles.length) {
				logger.warn(req.body.articles);
				await location.setArticles(req.body.articles.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await location.setArticles([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await location.setGroups(req.body.groups);
			} else {
				await location.setGroups([]);
			}
			res.json({location, created: true});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
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
		Location.findById(req.params.id).then(async location => {
			if (!location) {
				next(404);
				return null;
			}
			if (sanitizeHTML(req.body.imageRemoved, config.sanitizeHTML.allowNone) !== 'true') {
				location.idImage = newFileUploadID || location.idImage;
			} else {
				location.idImage = null;
			}
			location.modifiedBy = req.user.id;
			location.title = sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
			location.descriptionShort = sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone);
			location.roomNotes = req.body.roomNotes;
			location.idSpacePhase = sanitizeHTML(req.body.idSpacePhase, config.sanitizeHTML.allowNone);
			location.idLocationType = sanitizeHTML(req.body.idLocationType, config.sanitizeHTML.allowNone);
			location.hasPrinter = sanitizeHTML(req.body.hasPrinter, config.sanitizeHTML.allowNone);
			location.hasColorPrinter = sanitizeHTML(req.body.hasColorPrinter, config.sanitizeHTML.allowNone);
			location.hasPharos = sanitizeHTML(req.body.hasPharos, config.sanitizeHTML.allowNone);
			location.hasProjection = sanitizeHTML(req.body.hasProjection, config.sanitizeHTML.allowNone);
			location.hasDualProjection = sanitizeHTML(req.body.hasDualProjection, config.sanitizeHTML.allowNone);
			location.hasDocCamera = sanitizeHTML(req.body.hasDocCamera, config.sanitizeHTML.allowNone);
			location.hasLectureCap = sanitizeHTML(req.body.hasLectureCap, config.sanitizeHTML.allowNone);
			location.hasVoiceAmp = sanitizeHTML(req.body.hasVoiceAmp, config.sanitizeHTML.allowNone);
			location.hasWirelessVoiceAmp = sanitizeHTML(req.body.hasWirelessVoiceAmp, config.sanitizeHTML.allowNone);
			location.hasPOD = sanitizeHTML(req.body.hasPOD, config.sanitizeHTML.allowNone);
			location.hasDisplay = sanitizeHTML(req.body.hasDisplay, config.sanitizeHTML.allowNone);
			location.hasHostPC = sanitizeHTML(req.body.hasHostPC, config.sanitizeHTML.allowNone);
			location.hasWacomTouchscreen = sanitizeHTML(req.body.hasWacomTouchscreen, config.sanitizeHTML.allowNone);
			location.hasHDMILaptopCable = sanitizeHTML(req.body.hasHDMILaptopCable, config.sanitizeHTML.allowNone);
			location.hasUSBCLaptopCable = sanitizeHTML(req.body.hasUSBCLaptopCable, config.sanitizeHTML.allowNone);
			location.hasBlurayPlayer = sanitizeHTML(req.body.hasBlurayPlayer, config.sanitizeHTML.allowNone);
			location.hasZoomCapable = sanitizeHTML(req.body.hasZoomCapable, config.sanitizeHTML.allowNone);
			location.room = sanitizeHTML(req.body.room, config.sanitizeHTML.allowNone);
			location.seats = sanitizeHTML(req.body.seats, config.sanitizeHTML.allowNone) || null;
			location.computers = sanitizeHTML(req.body.computers, config.sanitizeHTML.allowNone) || null;
			location.idBuilding = sanitizeHTML(req.body.idBuilding, config.sanitizeHTML.allowNone);
			location.dateReviewBy = G.defaultDateReviewByFunction();
			location.accessRestricted = sanitizeHTML(req.body.accessRestricted, config.sanitizeHTML.allowNone) == 'true';
			if (req.body.tags && req.body.tags.length) {
				await location.setTags(req.body.tags.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await location.setTags([]);
			}
			if (req.body.audiences && req.body.audiences.length) {
				await location.setAudiences(req.body.audiences.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await location.setAudiences([]);
			}
			if (req.body.aliases && req.body.aliases.length) {
				await location.setAliases(req.body.aliases.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await location.setAliases([]);
			}
			if (req.body.software && req.body.software.length) {
				await location.setSoftware(req.body.software.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await location.setSoftware([]);
			}
			if (req.body.packages && req.body.packages.length) {
				await location.setPackages(req.body.packages.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await location.setPackages([]);
			}
			if (req.body.articles && req.body.articles.length) {
				await location.setArticles(req.body.articles.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await location.setArticles([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await location.setGroups(req.body.groups);
			} else {
				await location.setGroups([]);
			}
			location.save().then(async location_ => {
				res.json(
					{
						location: location_,
						created: false,
						canRemoveGroups: await G.checkPermissions({req, entity: 'location', level: 'delete', entityID: location_.id})
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
						model: Location,
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
						entity: 'location',
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
