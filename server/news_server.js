const News = require('../models/News.js');
const NewsType = require('../models/NewsType.js');
const NewsSubType = require('../models/NewsSubType.js');
const NewsPhase = require('../models/NewsPhase.js');
const NewsStatus = require('../models/NewsStatus.js');
const NewsSub = require('../models/NewsSub.js');
const UserViewHistory = require('../models/UserViewHistory.js');
const CopyToken = require('../models/CopyToken.js');
const G = require('./_global_logic.js');
const config = require('../config.js');
const sanitizeHTML = require('sanitize-html');
const FileUpload = require('../models/FileUpload.js');
const path = require('path');
const moment = require('moment');
const fs = require('fs');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const logger = require('./logger.js');
const url = require('url');
const { Op } = require('sequelize');
const Group = require('../models/Group.js');
const GroupPermissionLevel = require('../models/GroupPermissionLevel.js');
const Permission = require('../models/Permission.js');
const PermissionLevel = require('../models/PermissionLevel.js');
const UserEditHistory = require('../models/UserEditHistory.js');

module.exports = {
	renderById: async(req, res, next) => {
		const enforcePublished = await G.checkPermissions({req, entity: 'news', level: 'read', entityID: req.params.id}) ? {} : {title: 'publish'};
		News.findOne(
			{
				where: {
					id: req.params.id
				},
				include: [
					{
						model: NewsPhase,
						where: enforcePublished
					}
				]
			}).then(news => {
			if (!news) {
				next(404);
				return null;
			}
			res.redirect(url.format({
				pathname: news.getURL(),
				query: req.query
			}));
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	render: async(req, res, next) => {
		News.findById(req.params.id, !(await G.checkPermissions({req, entity: 'news', level: 'read', entityID: req.params.id}))).then(async news => {
			let imageSrc;
			if (news && news.image) {
				imageSrc = news.image.getURL();
			}
			if (!news) {
				next(404);
				return null;
			} else if (req.path != news.getURL()) {
				res.redirect(url.format({
					pathname: news.getURL(),
					query: req.query
				}));
				return null;
			} else if (await G.checkPermissions({req, entity: 'news', level: 'read', entityID: req.params.id})) {
				const canEdit = await G.checkPermissions({req, entity: 'news', level: 'author', entityID: req.params.id});
				news = news.toJSON();
				if (imageSrc) {
					news.image.src = imageSrc;
				}
				res.render('news/view.ejs', {
					news,
					canEdit
				});
				if (req.isAuthenticated()) {
					try {
						await UserViewHistory.recordView(req.user.id, 'news', news.id, news.title);
					} catch (err) {
						logger.err(err);
					}
					return null;
				} else {
					return null;
				}
			} else if (news.getPhaseTitle() === 'publish') {
				news = news.toJSON();
				if (imageSrc) {
					news.image.src = imageSrc;
				}
				res.render('news/view.ejs', {
					news,
					canEdit: false
				});
				if (req.isAuthenticated()) {
					try {
						await UserViewHistory.recordView(req.user.id, 'news', news.id, news.title);
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
		News.findById(req.params.id).then(news => {
			res.json(news);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	// getMany: (req, res, next) => {
	// limit = # default: *
	// isHome true || false
	// isWPIToday true || false
	// showAlert true || false
	// newsType filter
	// ?dateStartFrom
	// ?dateStartTo
	// ?dateEndFrom
	// ?dateEndTo
	// ?datePostFrom
	// ?datePostTo
	// ?newsSub true || false default true
	// },
	/**
   * Home news stuff
   */
	metaHomeGet: (req, res, next) => {
		const sequelize = req.app.get('models').sequelize;
		News.findAll(
			{
				group: ['news.id'],
				subQuery: false,
				limit: 5,
				where: {
					isHome: true
				},
				include: [
					{
						model: NewsType,
						required: true
					},
					{
						model: NewsPhase,
						required: true,
						where: {
							title: 'publish'
						},
					},
					{
						model: NewsStatus,
						required: true
					},
					{
						model: NewsSub,
						separate: true
					},
					{
						model: FileUpload,
						as: 'image'
					}
				],
				order: [
					['isPinned', 'DESC' ],
					[sequelize.col('news.updatedAt'), 'DESC']
				]
			}
		).then(news => {
			return res.json(
				news.map(newsItem => {
					let href = newsItem.getURL();
					let imageSrc = newsItem.image ? newsItem.image.getURL() : null;
					newsItem = newsItem.toJSON();
					newsItem.href = href;
					if (imageSrc) {
						newsItem.image.src = imageSrc;
					}
					return newsItem;
				})
			);
		}).catch(err => {
			return res.send(err);
		});
	},
	getAll: (req, res, next) => {
		const sequelize = req.app.get('models').sequelize;
		News.findAll(
			{
				group: ['news.id'],
				subQuery: false,
				include: [
					{
						model: NewsType,
						required: true
					},
					{
						model: NewsPhase,
						required: true,
						where: {
							title: 'publish'
						},
					},
					{
						model: NewsStatus,
						required: true
					},
					{
						model: NewsSub,
						separate: true
					},
					{
						model: FileUpload,
						as: 'image'
					}
				],
				order: [
					['isPinned', 'DESC' ],
					[sequelize.col('news.updatedAt'), 'DESC']
				]
			}
		).then(news => {
			return res.json(
				news.map(newsItem => {
					let href = newsItem.getURL();
					let imageSrc = newsItem.image ? newsItem.image.getURL() : null;
					newsItem = newsItem.toJSON();
					newsItem.href = href;
					if (imageSrc) {
						newsItem.image.src = imageSrc;
					}
					return newsItem;
				})
			);
		}).catch(err => {
			next(err);
			return null;
		});
	},
	new: (req, res, next) => {
		return Promise.all([ NewsPhase.findAll(), NewsStatus.findAll(), NewsType.findAll(), NewsSubType.findAll()]).then(values => {
			res.render('news/view.ejs', {
				edit: true,
				canEdit: true,
				phases: values[0],
				statuses: values[1],
				types: values[2],
				subTypes: values[3]
			});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	edit: (req, res, next) => {
		News.findById(req.params.id).then(news => {
			let imageSrc;
			if (news && news.image) {
				imageSrc = news.image.getURL();
			}
			if (!news) {
				next(404);
				return null;
			} else {
				return Promise.all([ NewsStatus.findAll(), NewsType.findAll(), NewsSubType.findAll()]).then(async values => {
					news = news.toJSON();
					if (imageSrc) {
						news.image.src = imageSrc;
					}

					// check permission level
					const canPublish = await G.checkPermissions({req, entity: 'news', level: 'publish', entityID: req.params.id});
					let canRemoveGroups = await G.checkPermissions({req, entity: 'news', level: 'delete', entityID: req.params.id});

					if (!canRemoveGroups && typeof req.query !== 'undefined' && typeof req.query.copy_token === 'string') {
						const copyToken = await CopyToken.findOne(
							{
								where: {
									entity: 'news',
									entityID: news.id,
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
						phases = await NewsPhase.findAll();
					}

					await UserEditHistory.recordView(req.user.id, 'news', news.id);

					res.render('news/view.ejs', {
						news,
						edit: true,
						canEdit: true,
						phases,
						statuses: values[0],
						types: values[1],
						subTypes: values[2],
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
		News.create({
			createdBy: req.user.id,
			idNewsType: sanitizeHTML(req.body.idNewsType, config.sanitizeHTML.allowNone),
			idNewsPhase: sanitizeHTML(req.body.idNewsPhase, config.sanitizeHTML.allowNone),
			idNewsStatus: sanitizeHTML(req.body.idNewsStatus, config.sanitizeHTML.allowNone),
			title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
			descriptionShort: sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone),
			why: sanitizeHTML(req.body.why, config.sanitizeHTML.allowNone),
			impact: sanitizeHTML(req.body.impact, config.sanitizeHTML.allowNone),
			benefits: sanitizeHTML(req.body.benefits, config.sanitizeHTML.allowNone),
			actionDescription: sanitizeHTML(req.body.actionDescription, config.sanitizeHTML.allowNone),
			details: req.body.details,
			dateStart: G.formatISODate(req.body.dateStart),
			dateEnd: G.formatISODate(req.body.dateEnd),
			datePost: G.formatISODate(req.body.datePost),
			showAlert: sanitizeHTML(req.body.showAlert, config.sanitizeHTML.allowNone),
			isWPIToday: sanitizeHTML(req.body.isWPIToday, config.sanitizeHTML.allowNone),
			isPinned: sanitizeHTML(req.body.isPinned, config.sanitizeHTML.allowNone),
			isHome: sanitizeHTML(req.body.isHome, config.sanitizeHTML.allowNone),
			idImage: newFileUploadID,
			accessRestricted: sanitizeHTML(req.body.accessRestricted, config.sanitizeHTML.allowNone) == 'true'
		}).then(async news => {

			if (req.body.newsSubs && req.body.newsSubs.length) {
				for (const newsSub of req.body.newsSubs) {
					if (newsSub.isNew == 'true') {
						try {
							const newsSub_ = await NewsSub.create(
								{
									createdBy: req.user.id,
									idNews: news.id,
									idNewsSubType: sanitizeHTML(newsSub.newsSubType, config.sanitizeHTML.allowNone),
									title: sanitizeHTML(newsSub.title, config.sanitizeHTML.allowNone),
									descriptionShort: sanitizeHTML(newsSub.descriptionShort, config.sanitizeHTML.allowNone),
									datePost: G.formatISODate(newsSub.datePost)
								}
							);
							await newsSub_.setActions(newsSub.actions || []);
							await news.addNewsSub(newsSub_);
						} catch (e) {
							next(e);
							return null;
						}
					} else {
						try {
							const newsSub_ = await NewsSub.findByPk(newsSub.id);
							newsSub_.idNewsSubType = sanitizeHTML(newsSub.newsSubType, config.sanitizeHTML.allowNone);
							newsSub_.title = sanitizeHTML(newsSub.title, config.sanitizeHTML.allowNone);
							newsSub_.descriptionShort = sanitizeHTML(newsSub.descriptionShort, config.sanitizeHTML.allowNone);
							newsSub_.datePost = G.formatISODate(newsSub.datePost);
							newsSub_.modifiedBy = req.user.id;
							await newsSub_.setActions(newsSub.actions || []);
							await newsSub_.save();
							await news.addNewsSub(newsSub_);
						} catch (e) {
							next(e);
							return null;
						}
					}
				}
			}
			if (req.body.actions && req.body.actions.length) {
				await news.setActions(req.body.actions.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await news.setActions([]);
			}
			if (req.body.tags && req.body.tags.length) {
				await news.setTags(req.body.tags.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await news.setTags([]);
			}
			if (req.body.audiences && req.body.audiences.length) {
				await news.setAudiences(req.body.audiences.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await news.setAudiences([]);
			}
			if (req.body.components && req.body.components.length) {
				await news.setComponents(req.body.components.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await news.setComponents([]);
			}
			if (req.body.services && req.body.services.length) {
				await news.setServices(req.body.services.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await news.setServices([]);
			}
			if (req.body.software && req.body.software.length) {
				await news.setSoftware(req.body.software.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await news.setSoftware([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await news.setGroups(req.body.groups.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await news.setGroups([]);
			}
			if (req.body.articles && req.body.articles.length) {
				await news.setArticles(req.body.articles.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await news.setArticles([]);
			}
			res.json(
				{
					news,
					created: true
				}
			);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	copyOne: (req, res, next) => {
		News.findByPk(req.params.id).then(newsSrc => {
			News.create({
				createdBy: req.user.id,
				idNewsType: newsSrc.idNewsType,
				idNewsPhase: 1,
				idNewsStatus: 1,
				title: `${newsSrc.title} copy`,
				descriptionShort: newsSrc.descriptionShort,
				why: newsSrc.why,
				impact: newsSrc.impact,
				benefits: newsSrc.benefits,
				actionDescription: newsSrc.actionDescription,
				details: newsSrc.details,
				showAlert: false,
				isWPIToday: false,
				isPinned: false,
				isHome: true,
				accessRestricted: newsSrc.accessRestricted
			}).then(async news => {
				await news.setActions(await newsSrc.getActions());
				await news.setTags(await newsSrc.getTags());
				await news.setAudiences(await newsSrc.getAudiences());
				await news.setComponents(await newsSrc.getComponents());
				await news.setServices(await newsSrc.getServices());
				await news.setSoftware(await newsSrc.getSoftware());
				await news.setGroups(await newsSrc.getGroups());
				const copyToken = await CopyToken.create(
					{
						entity: 'news',
						entityID: news.id
					}
				);
				news.save().then(news_ => {
					res.json(
						{
							type: 'news',
							id: news_.id,
							news: news_,
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
		News.findById(req.params.id).then(async news => {
			if (!news) {
				next(404);
				return null;
			}

			if (req.body.newsSubs && req.body.newsSubs.length) {
				for (const newsSub of req.body.newsSubs) {
					if (newsSub.isNew == 'true' && newsSub.isDeleted != 'true') {
						try {
							const newsSub_ = await NewsSub.create(
								{
									idNews: news.id,
									idNewsSubType: sanitizeHTML(newsSub.newsSubType, config.sanitizeHTML.allowNone),
									title: sanitizeHTML(newsSub.title, config.sanitizeHTML.allowNone),
									descriptionShort: sanitizeHTML(newsSub.descriptionShort, config.sanitizeHTML.allowNone),
									datePost: G.formatISODate(newsSub.datePost),
									createdBy: req.user.id
								}
							);
							await newsSub_.setActions(newsSub.actions || []);
							await news.addNewsSub(newsSub_);
						} catch (e) {
							next(e);
							return null;
						}
					} else if (newsSub.isDeleted == 'true') {
						if (newsSub.isNew != 'true') {
							try {
								const newsSub_ = await NewsSub.findByPk(newsSub.id);
								await newsSub_.destroy();
							} catch (e) {
								next(e);
								return null;
							}
						} // else we don't care, it was created and deleted before it was ever saved
					} else {
						try {
							const newsSub_ = await NewsSub.findByPk(newsSub.id);
							newsSub_.idNewsSubType = sanitizeHTML(newsSub.newsSubType, config.sanitizeHTML.allowNone);
							newsSub_.title = sanitizeHTML(newsSub.title, config.sanitizeHTML.allowNone);
							newsSub_.descriptionShort = sanitizeHTML(newsSub.descriptionShort, config.sanitizeHTML.allowNone);
							newsSub_.datePost = G.formatISODate(newsSub.datePost);
							newsSub_.modifiedBy = req.user.id;
							await newsSub_.setActions(newsSub.actions || []);
							await newsSub_.save();
							await news.addNewsSub(newsSub_);
						} catch (e) {
							next(e);
							return null;
						}
					}
				}
			}

			news.modifiedBy = req.user.id;
			news.idNewsType = sanitizeHTML(req.body.idNewsType, config.sanitizeHTML.allowNone);
			news.idNewsPhase = sanitizeHTML(req.body.idNewsPhase, config.sanitizeHTML.allowNone);
			news.idNewsStatus = sanitizeHTML(req.body.idNewsStatus, config.sanitizeHTML.allowNone);
			news.title = sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
			news.descriptionShort = sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone);
			news.why = sanitizeHTML(req.body.why, config.sanitizeHTML.allowNone);
			news.impact = sanitizeHTML(req.body.impact, config.sanitizeHTML.allowNone);
			news.benefits = sanitizeHTML(req.body.benefits, config.sanitizeHTML.allowNone);
			news.actionDescription = sanitizeHTML(req.body.actionDescription, config.sanitizeHTML.allowNone);
			news.details = req.body.details;
			news.dateStart = G.formatISODate(req.body.dateStart);
			news.dateEnd = G.formatISODate(req.body.dateEnd);
			news.datePost = G.formatISODate(req.body.datePost);
			news.showAlert = sanitizeHTML(req.body.showAlert, config.sanitizeHTML.allowNone);
			news.isWPIToday = sanitizeHTML(req.body.isWPIToday, config.sanitizeHTML.allowNone);
			news.isPinned = sanitizeHTML(req.body.isPinned, config.sanitizeHTML.allowNone);
			news.isHome = sanitizeHTML(req.body.isHome, config.sanitizeHTML.allowNone);
			news.accessRestricted = sanitizeHTML(req.body.accessRestricted, config.sanitizeHTML.allowNone) == 'true';
			if (sanitizeHTML(req.body.imageRemoved, config.sanitizeHTML.allowNone) !== 'true') {
				news.idImage = newFileUploadID || news.idImage;
			} else {
				news.idImage = null;
			}
			if (req.body.actions && req.body.actions.length) {
				await news.setActions(req.body.actions.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await news.setActions([]);
			}
			if (req.body.tags && req.body.tags.length) {
				await news.setTags(req.body.tags.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await news.setTags([]);
			}
			if (req.body.audiences && req.body.audiences.length) {
				await news.setAudiences(req.body.audiences.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await news.setAudiences([]);
			}
			if (req.body.components && req.body.components.length) {
				await news.setComponents(req.body.components.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await news.setComponents([]);
			}
			if (req.body.services && req.body.services.length) {
				await news.setServices(req.body.services.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await news.setServices([]);
			}
			if (req.body.software && req.body.software.length) {
				await news.setSoftware(req.body.software.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await news.setSoftware([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await news.setGroups(req.body.groups.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await news.setGroups([]);
			}
			if (req.body.articles && req.body.articles.length) {
				await news.setArticles(req.body.articles.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await news.setArticles([]);
			}

			// mark copy token invalid if it exists
			if (typeof req.query !== 'undefined' && typeof req.query.copy_token === 'string') {
				const copyToken = await CopyToken.findOne(
					{
						where: {
							entity: 'news',
							entityID: news.id,
							guid: req.query.copy_token
						}
					}
				);
				copyToken.isValid = false;
				await copyToken.save();
			}

			news.save().then(async news_ => {
				res.json(
					{
						news: news_,
						created: false,
						canRemoveGroups: await G.checkPermissions({req, entity: 'news', level: 'delete', entityID: news_.id})
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
						model: News,
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
						entity: 'news',
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
