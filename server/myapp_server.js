'use strict';
const MyApp = require('../models/MyApp.js');
const MyAppPhase = require('../models/MyAppPhase.js');
const UserHasMyApp = require('../models/UserHasMyApp.js');
const FileUpload = require('../models/FileUpload.js');
const Op = require('sequelize').Op;
const G = require('./_global_logic.js');
const config = require('../config.js');
const sanitizeHTML = require('sanitize-html');
const path = require('path');
const fs = require('fs');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const moment = require('moment');
const logger = require('./logger.js');

module.exports = {
	/**
   * Me
   */
	getMeInstalled: (req, res, next) => {
		UserHasMyApp.findAll(
			{
				where: {
					idUser: req.user.id,
					isFavorite: false
				},
				include: [
					{
						model: MyApp,
						required: true,
						where: {
							isArchived: false
						},
						include: [
							{
								model: MyAppPhase,
								required: true,
								where: {
									title: 'publish'
								}
							},
							{
								model: FileUpload,
								as: 'image'
							}
						]
					}
				]
			}
		).then(userHasMyApps => {
			res.json(
				userHasMyApps.map(u => {
					let imageSrc = u.myApp.image ? u.myApp.image.getURL() : null;
					u = u.toJSON();
					u.myApp.imageSrc = imageSrc;
					return u.myApp;
				})
			);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getMeFavorites: (req, res, next) => {
		UserHasMyApp.findAll(
			{
				where: {
					idUser: req.user.id,
					isFavorite: true
				},
				include: [
					{
						model: MyApp,
						required: true,
						where: {
							isArchived: false
						},
						include: [
							{
								model: MyAppPhase,
								required: true,
								where: {
									title: 'publish'
								}
							},
							{
								model: FileUpload,
								as: 'image'
							}
						]
					}
				]
			}
		).then(userHasMyApps => {
			res.json(
				userHasMyApps.map(u => {
					let imageSrc = u.myApp.image ? u.myApp.image.getURL() : null;
					u = u.toJSON();
					u.myApp.imageSrc = imageSrc;
					return u.myApp;
				})
			);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getMeAvailable: (req, res, next) => {
		UserHasMyApp.findAll(
			{
				where: {
					idUser: req.user.id
				},
				include: [
					{
						model: MyApp,
						required: true,
						where: {
							isArchived: false
						},
						include: [
							{
								model: MyAppPhase,
								required: true,
								where: {
									title: 'publish'
								}
							}
						]
					}
				]
			}
		).then(userHasMyApps => {
			const installedAppsIDs = userHasMyApps.map(u => u.myApp.id);
			return MyApp.findAll(
				{
					where: {
						isArchived: false,
						id: {
							[Op.notIn]: installedAppsIDs
						}
					},
					include: [
						{
							model: MyAppPhase,
							required: true,
							where: {
								title: 'publish'
							}
						},
						{
							model: FileUpload,
							as: 'image'
						}
					]
				}
			).then(availableApps => {
				res.json(
					availableApps.map(u => {
						let imageSrc = u.image ? u.image.getURL() : null;
						u = u.toJSON();
						u.imageSrc = imageSrc;
						return u;
					}).sort((a, b) => {
						return a.title > b.title;
					})
				);
				return null;
			});
		}).catch(err => {
			next(err);
			return null;
		});
	},
	setIsFavorite: (req, res, next) => {
		UserHasMyApp.findOne(
			{
				where: {
					idUser: req.user.id,
					idMyApp: req.body.id
				}
			}
		).then(async userHasMyApp => {
			if (!userHasMyApp) { // install first
				userHasMyApp = await UserHasMyApp.create(
					{
						idUser: req.user.id,
						idMyApp: req.body.id
					}
				);
			}
			userHasMyApp.isFavorite = req.body.favorite;
			userHasMyApp.save().then(() => {
				MyApp.findById(req.body.id, true, true).then(app => {
					let imageSrc = app.image ? app.image.getURL() : null;
					app = app.toJSON();
					app.imageSrc = imageSrc;
					res.json(
						{
							success: true,
							app
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
	},
	setIsInstalled: async(req, res, next) => {
		if (req.body.installed === 'true') {
			const myApp = await MyApp.findById(req.body.id, true, true);
			if (!myApp) {
				next(400);
				return null;
			}
			UserHasMyApp.findOrCreate(
				{
					where: {
						idUser: req.user.id,
						idMyApp: req.body.id
					}
				}
			).then(([userHasMyApp, created]) => { // eslint-disable-line
				MyApp.findById(req.body.id, true, true).then(app => {
					let imageSrc = app.image ? app.image.getURL() : null;
					app = app.toJSON();
					app.imageSrc = imageSrc;
					res.json(
						{
							success: true,
							installed: created,
							app
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
		} else {
			UserHasMyApp.destroy(
				{
					where: {
						idUser: req.user.id,
						idMyApp: req.body.id
					}
				}
			).then(count => {
				MyApp.findById(req.body.id, true, true).then(app => {
					let imageSrc = app.image ? app.image.getURL() : null;
					app = app.toJSON();
					app.imageSrc = imageSrc;
					res.json(
						{
							success: true,
							uninstalled: count > 0,
							app
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
		}
	},
	/**
   * Not me
   */
	/**
   * Views
   */
	renderById: async(req, res, next) => {
		const enforcePublished = await G.checkPermissions({req, entity: 'myapp', level: 'read', entityID: req.params.id}) ? {} : {title: 'publish'};
		MyApp.findOne(
			{
				where: {
					id: req.params.id,
					isArchived: false
				},
				include: [
					{
						model: MyAppPhase,
						where: enforcePublished
					}
				]
			}).then(app => {
			if (!app) {
				next(404);
				return null;
			}
			res.redirect(app.getURL());
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	render: async(req, res, next) => {
		MyApp.findById(req.params.id, !(await G.checkPermissions({req, entity: 'myapp', level: 'read', entityID: req.params.id}))).then(async app => {
			let appIsFavorite = false;
			let appIsInstalled = false;
			if (app && req.isAuthenticated()) {
				try {
					let userHasMyApp = await UserHasMyApp.findOne(
						{
							where: {
								idUser: req.user.id,
								idMyApp: app.id
							}
						}
					);
					if (userHasMyApp) {
						appIsInstalled = true;
						if (userHasMyApp.isFavorite) {
							appIsFavorite = true;
						}
					}
				} catch (err) {
					next(err);
					return null;
				}
			}
			if (!app) {
				next(404);
				return null;
			} else if (req.url != app.getURL()) {
				res.redirect(app.getURL());
				return null;
			} else if (await G.checkPermissions({req, entity: 'myapp', level: 'read', entityID: req.param.id})) {
				const canEdit = await G.checkPermissions({req, entity: 'myapp', level: 'author', entityID: req.params.id});
				let imageSrc = app.image ? app.image.getURL() : null;
				app = app.toJSON();
				app.imageSrc = imageSrc;
				res.render('app/view.ejs', {
					app,
					canEdit,
					appIsFavorite,
					appIsInstalled
				});
			} else if (app.getPhaseTitle() === 'publish') {
				let imageSrc = app.image ? app.image.getURL() : null;
				app = app.toJSON();
				app.imageSrc = imageSrc;
				res.render('app/view.ejs', {
					app,
					canEdit: false,
					appIsFavorite,
					appIsInstalled
				});
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
		MyAppPhase.findAll().then(phases => {
			res.render('app/view.ejs', {
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
		MyApp.findById(req.params.id).then(app => {
			if (!app) {
				next(404);
				return null;
			} else {
				let imageSrc = app.image ? app.image.getURL() : null;
				app = app.toJSON();
				app.imageSrc = imageSrc;
				return MyAppPhase.findAll().then(phases => {
					res.render('app/view.ejs', {
						app,
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
	createOne: async(req, res, next) => {
		let newFileUploadID = null;
		if (req.file) {
			await new Promise((resolve, reject) => {
				const newFileUpload = FileUpload.build({
					path: sanitizeHTML(req.file.path, config.sanitizeHTML.allowNone),
					title: req.body.title ? sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone) : sanitizeHTML(moment().toISOString(), config.sanitizeHTML.allowNone),
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
		MyApp.create({
			createdBy: req.user.id,
			idMyAppPhase: sanitizeHTML(req.body.idMyAppPhase, config.sanitizeHTML.allowNone),
			idMyAppStatus: 1,
			title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
			link: sanitizeHTML(req.body.link, config.sanitizeHTML.allowNone),
			descriptionShort: sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone),
			idImage: newFileUploadID,
			isQuick: sanitizeHTML(req.body.isQuick, config.sanitizeHTML.allowNone) === 'true',
			// target: sanitizeHTML(req.body.target, config.sanitizeHTML.allowNone),
			// URIscheme: sanitizeHTML(req.body.URIscheme, config.sanitizeHTML.allowNone),
			// color: sanitizeHTML(req.body.color, config.sanitizeHTML.allowNone),
		}).then(async app => {
			if (req.body.articles && req.body.articles.length) {
				await app.setArticles(req.body.articles);
			} else {
				await app.setArticles([]);
			}
			res.json({
				app,
				created: true
			});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	updateOne: async(req, res, next) => {
		let newFileUploadID = null;
		if (req.file) {
			await new Promise((resolve, reject) => {
				const newFileUpload = FileUpload.build({
					path: sanitizeHTML(req.file.path, config.sanitizeHTML.allowNone),
					title: req.body.title ? sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone) : sanitizeHTML(moment().toISOString(), config.sanitizeHTML.allowNone),
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
		MyApp.findByPk(req.params.id).then(async app => {
			if (!app) {
				next(404);
				return null;
			}
			app.modifiedBy = req.user.id;
			app.idMyAppPhase = sanitizeHTML(req.body.idMyAppPhase, config.sanitizeHTML.allowNone);
			app.idMyAppStatus = 1;
			app.title = sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
			app.link = sanitizeHTML(req.body.link, config.sanitizeHTML.allowNone);
			app.descriptionShort = sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone);
			app.idImage = newFileUploadID || app.idImage;
			app.isQuick = sanitizeHTML(req.body.isQuick, config.sanitizeHTML.allowNone) === 'true';
			if (req.body.articles && req.body.articles.length) {
				await app.setArticles(req.body.articles);
			} else {
				await app.setArticles([]);
			}
			app.save().then(app_ => {
				res.json(
					{
						app: app_,
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
	getAll: (req, res, next) => {
		if (req.isAuthenticated()) {
			// all installed apps, favorite and not favorite
			UserHasMyApp.findAll(
				{
					where: {
						idUser: req.user.id
					},
					include: [
						{
							model: MyApp,
							required: true,
							where: {
								isArchived: false
							},
							include: [
								{
									model: MyAppPhase,
									required: true,
									where: {
										title: 'publish'
									}
								},
								{
									model: FileUpload,
									as: 'image'
								}
							]
						}
					]
				}
			).then(userHasMyApps => {
				const installedApps = userHasMyApps.map(
					u => {
						let imageSrc = u.myApp.image ? u.myApp.image.getURL() : null;
						u = u.toJSON();
						u.myApp.imageSrc = imageSrc;
						u.myApp.isInstalled = true;
						u.myApp.isFavorite = u.isFavorite;
						u.myApp.isUserLoggedIn = true;
						return u.myApp;
					}
				);
				const installedAppsIDs = userHasMyApps.map(u => u.myApp.id);
				// all apps, filter out installed IDs
				return MyApp.findAll(
					{
						where: {
							id: {
								[Op.notIn]: installedAppsIDs
							},
							isArchived: false
						},
						include: [
							{
								model: MyAppPhase,
								required: true,
								where: {
									title: 'publish'
								}
							},
							{
								model: FileUpload,
								as: 'image'
							}
						]
					}
				).then(availableApps => {
					const availableApps_ = availableApps.map(
						a => {
							let imageSrc = a.image ? a.image.getURL() : null;
							a = a.toJSON();
							a.imageSrc = imageSrc;
							a.isInstalled = false;
							a.isFavorite = false;
							a.isUserLoggedIn = true;
							return a;
						}
					);
					const allApps = [...installedApps, ...availableApps_];
					allApps.sort(G.sortByTitle);
					res.json(allApps);
					return null;
				});
			}).catch(err => {
				next(err);
				return null;
			});
		} else {
			MyApp.findAll(
				{
					where: {
						isArchived: false
					},
					include: [
						{
							model: MyAppPhase,
							required: true,
							where: {
								title: 'publish'
							}
						},
						{
							model: FileUpload,
							as: 'image'
						}
					]
				}
			).then(apps => {
				res.json(
					apps.map(a => {
						let imageSrc = a.image ? a.image.getURL() : null;
						a = a.toJSON();
						a.imageSrc = imageSrc;
						a.isInstalled = false;
						a.isFavorite = false;
						a.isUserLoggedIn = false;
						return a;
					}).sort(G.sortByTitle)
				);
				return null;
			}).catch(err => {
				next(err);
				return null;
			});
		}
	}
};