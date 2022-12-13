const Article = require('../models/Article.js');
const ArticleContent = require('../models/ArticleContent.js');
const Group = require('../models/Group.js');
const ArticlePhase = require('../models/ArticlePhase.js');
const UserViewHistory = require('../models/UserViewHistory.js');
const FileUpload = require('../models/FileUpload.js');
const G = require('./_global_logic.js');
const sanitizeHTML = require('sanitize-html');
const config = require('../config.js');
const sequelize = require('sequelize');
const logger = require('./logger.js');
const path = require('path');
const moment = require('moment');
const fs = require('fs');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const url = require('url');
const GroupPermissionLevel = require('../models/GroupPermissionLevel.js');
const PermissionLevel = require('../models/PermissionLevel.js');
const Permission = require('../models/Permission.js');
const UserEditHistory = require('../models/UserEditHistory.js');

module.exports = {
	/**
	 * VIEWS
	 */
	renderById: async(req, res, next) => {
		const enforcePublished = await G.checkPermissions({req, entity: 'article', level: 'read', entityID: req.params.id}) ? {} : {title: 'publish'};
		Article.findOne(
			{
				where: {
					id: req.params.id
				},
				include: [
					{
						model: ArticlePhase,
						where: enforcePublished
					}
				]
			}
		).then(article => {
			if (!article) {
				next(404);
				return null;
			} else if (article.requireAuth && !req.isAuthenticated()) {
				G.ensureAuthenticated(req, res, next);
				return null;
			} else {
				res.redirect(url.format(
					{
						pathname: article.getURL(),
						query: req.query
					}
				));
				return null;
			}
		}).catch(err => {
			next(err);
			return null;
		});
	},
	render: async(req, res, next) => {
		const extractArticleData = data => {
			let data_;
			try {
				data_ = JSON.parse(data).blocks;
			} catch (error) {
				data_ = data;
			}
			return data_ || '';
		};

		Article.findById(req.params.id, !(await G.checkPermissions({req, entity: 'article', entityID: req.params.id, level: 'read'}))).then(async article => {
			let imageSrc;
			if (article && article.image) {
				imageSrc = article.image.getURL();
			}
			if (!article) {
				next(404);
				return null;
			} else if (article.requireAuth && !req.isAuthenticated()) {
				G.ensureAuthenticated(req, res, next);
				return null;
			} else if (req.path != article.getURL()) {
				res.redirect(url.format(
					{
						pathname: article.getURL(),
						query: req.query
					}
				));
				return null;
			} else {
				article = article.toJSON();
				if (imageSrc) {
					article.image.src = imageSrc;
				}
				if (!extractArticleData(article.content).length > 0) {
					delete article.content;
				}
				if (!extractArticleData(article.contentAlt).length > 0) {
					delete article.contentAlt;
				}
				if (!extractArticleData(article.contentInternal).length > 0) {
					delete article.contentInternal;
				}
				if (!extractArticleData(article.contentLegacy).length > 0) {
					delete article.contentLegacy;
				}
				if (!extractArticleData(article.contentAltLegacy).length > 0) {
					delete article.contentAltLegacy;
				}
				if (!extractArticleData(article.contentInternalLegacy).length > 0) {
					delete article.contentInternalLegacy;
				}
				/**
				 * TODO article internal is temporarily disabled because there is no permissions infrastructure for it.
				 */
				if ('contentInternal' in article) {
					delete article.contentInternal;
				}
				if ('contentInternalLegacy' in article) {
					delete article.contentInternalLegacy;
				}
				//

				const canEdit = await G.checkPermissions({req, entity: 'article', level: 'author', entityID: req.params.id});
				res.render('article/view.ejs', {
					article,
					canEdit: canEdit
				});
				if (req.isAuthenticated()) {
					try {
						await UserViewHistory.recordView(req.user.id, 'article', article.id, article.title);
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
	new: (req, res, next) => {
		ArticlePhase.findAll().then(articlePhases => {
			res.render('article/view.ejs', {
				edit: true,
				canEdit: true,
				phases: articlePhases
			});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	edit: (req, res, next) => {
		Article.findById(req.params.id).then(async article => {
			if (!article) {
				next(404);
				return null;
			} else {
				// get header image for article
				let imageSrc;
				if (article && article.image) {
					imageSrc = article.image.getURL();
				}
				article = article.toJSON();
				if (imageSrc) {
					article.image.src = imageSrc;
				}
				// check permission level
				const canPublish = await G.checkPermissions({req, entity: 'article', level: 'publish', entityID: req.params.id});
				const canRemoveGroups = await G.checkPermissions({req, entity: 'article', level: 'delete', entityID: req.params.id});
				let phases = [];
				if (canPublish) { // get phases if users can set the phase
					phases = await ArticlePhase.findAll();
				}
				await UserEditHistory.recordView(req.user.id, 'article', article.id);
				res.render('article/view.ejs', {
					article: article,
					edit: true,
					canEdit: true,
					canPublish,
					canRemoveGroups,
					phases
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
		Article.create({
			createdBy: req.user.id,
			title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
			descriptionShort: sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone),
			idArticlePhase: sanitizeHTML(req.body.idArticlePhase, config.sanitizeHTML.allowNone),
			requireAuth: sanitizeHTML(req.body.requireAuth, config.sanitizeHTML.allowNone) == 'true',
			modifiedBy: req.user.id,
			dateReviewBy: G.defaultDateReviewByFunction(),
			content: req.body.content,
			contentAlt: req.body.contentAlt,
			contentInternal: req.body.contentInternal,
			useLegacy: sanitizeHTML(req.body.useLegacy, config.sanitizeHTML.allowNone) == 'true',
			contentLegacy: sanitizeHTML(req.body.contentLegacy, config.sanitizeHTML.default),
			contentAltLegacy: sanitizeHTML(req.body.contentAltLegacy, config.sanitizeHTML.default),
			contentInternalLegacy: sanitizeHTML(req.body.contentInternalLegacy, config.sanitizeHTML.default),
			idImage: newFileUploadID,
			accessRestricted: sanitizeHTML(req.body.accessRestricted, config.sanitizeHTML.allowNone) == 'true',
			displayMode: sanitizeHTML(req.body.displayMode, config.sanitizeHTML.allowNone)
		}).then(async article => {
			if (req.body.actions && req.body.actions.length) {
				await article.setActions(req.body.actions.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await article.setActions([]);
			}
			if (req.body.tags && req.body.tags.length) {
				await article.setTags(req.body.tags.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await article.setTags([]);
			}
			if (req.body.audiences && req.body.audiences.length) {
				await article.setAudiences(req.body.audiences.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await article.setAudiences([]);
			}
			if (req.body.services && req.body.services.length) {
				await article.setServices(req.body.services.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await article.setServices([]);
			}
			if (req.body.components && req.body.components.length) {
				await article.setComponents(req.body.components.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await article.setComponents([]);
			}
			if (req.body.softwares && req.body.softwares.length) {
				await article.setSoftware(req.body.softwares.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await article.setSoftware([]);
			}
			await article.setArticlePhase(req.body.idArticlePhase);

			if (req.body.groups && req.body.groups.length) {
				await article.setGroups(req.body.groups.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await article.setGroups([]);
			}

			// Suggested Articles
			if (req.body.siblingArticles && req.body.siblingArticles.length) {
				await article.setSiblingArticles(req.body.siblingArticles.filter((value, index, self) => self.indexOf(value) === index && parseInt(value) !== article.id));
			} else {
				await article.setSiblingArticles([]);
			}

			/**
			 * ArticleContent
			 */
			if (Array.isArray(req.body.articleContent)) {
				for (const articleContentData of req.body.articleContent) {
					const {id, title, content, order} = articleContentData;
					const articleContent = await ArticleContent.findByPk(id);
					if (articleContent) {
						articleContent.order = order;
						articleContent.content = content;
						articleContent.title = title;
						await articleContent.save();
					} else {
						await ArticleContent.create(
							{
								idArticle: article.id,
								title,
								content,
								order,
							}
						);
					}
				}
			}
			if (Array.isArray(req.body.deletedArticleContent)) {
				for (const id of req.body.deletedArticleContent) {
					const articleContent = await ArticleContent.findByPk(id);
					if (articleContent) {
						await articleContent.destroy();
					}
				}
			}

			article.save().then(article_ => {
				res.json(
					{
						article: article_,
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
	getGroups: (req, res, next) => {
		Group.findAll(
			{
				attributes: ['id', 'title'],
				include: [
					{
						model: Article,
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
						entity: 'article',
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
	getOne: (req, res, next) => {
		Article.findById(req.params.id).then(async article => {
			let imageSrc;
			if (article && article.image) {
				imageSrc = article.image.getURL();
			}
			if (!article) {
				next(404);
				return null;
			} else if (article.requireAuth && !req.isAuthenticated()) {
				next(401);
				return null;
			} else if (await G.checkPermissions({req, entity: 'article', level: 'read', entityID: req.params.id})) {
				article = article.toJSON();
				if (imageSrc) {
					article.image.src = imageSrc;
				}
				/**
				 * TODO article internal is temporarily disabled because there is no permissions infrastructure for it.
				 */
				if ('contentInternal' in article) {
					delete article.contentInternal;
				}
				if ('contentInternalLegacy' in article) {
					delete article.contentInternalLegacy;
				}
				//
				return res.json(article);
			} else if (article.isPublished()) {
				if (await G.checkPermissions({req, entity: 'articleinternal', level: 'read', entityID: req.params.id}) === false) {
					article = article.toJSON();
					if (imageSrc) {
						article.image.src = imageSrc;
					}
					delete article.contentInternal;
				}
				/**
				 * TODO article internal is temporarily disabled because there is no permissions infrastructure for it.
				 */
				if ('contentInternal' in article) {
					delete article.contentInternal;
				}
				if ('contentInternalLegacy' in article) {
					delete article.contentInternalLegacy;
				}
				//
				return res.json(article);
			} else {
				next(404);
				return null;
			}
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getMany: (req, res, next) => {
		const QUERY = {
			where: {
				[sequelize.Op.or]: [
					{ requireAuth: false },
					{ requireAuth: true }
				]
			},
			include: [
				{
					model: ArticlePhase,
					where: {
						title: 'publish'
					}
				}
			]
		};


		if (req.query.attributes instanceof Array) {
			QUERY.attributes = ['requireAuth', 'idArticlePhase', ...req.query.attributes];
		}


		if (req.query.limit) {
			try {
				QUERY.limit = parseInt(req.query.limit);
			} catch (err) {
				next(err);
				return null;
			}
		}

		if (req.query.sort instanceof Array && req.query.sort.length >= 2) {
			QUERY.order = [[req.query.sort[0], req.query.sort[1]]];
			if (QUERY.attributes) {
				QUERY.attributes = [req.query.sort[0], ...QUERY.attributes];
			}
		}

		/**
		 * filter : [
		 *    ['column', 'operation', 'column']
		 * ]
		 */
		if (req.query.filterByColumn instanceof Array) {
			for (const filter_ of req.query.filterByColumn) {
				if (filter_ instanceof Array && filter_.length === 3) {
					QUERY.where[filter_[0]] = {
						[sequelize.Op[filter_[1]]]: sequelize.col(`article.${filter_[2]}`)
					};
					if (QUERY.attributes) {
						QUERY.attributes = [filter_[0], filter_[2], ...QUERY.attributes];
					}
				}
			}
		}

		/**
		 * filter : [
		 *    ['column', 'operation', 'value']
		 * ]
		 */
		if (req.query.filterByValue instanceof Array) {
			for (const filter_ of req.query.filterByValue) {
				if (filter_ instanceof Array && filter_.length === 3) {
					QUERY.where[filter_[0]] = {
						[sequelize.Op[filter_[1]]]: filter_[2]
					};
					if (QUERY.attributes) {
						QUERY.attributes = [filter_[0], ...QUERY.attributes];
					}
				}
			}
		}

		if (QUERY.attributes) {
			QUERY.attributes.filter((value, index, self) => self.indexOf(value) === index);
		}


		Article.findAll(QUERY).then(articles => {
			res.json(articles);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getAll: (req, res, next) => {
		Article.findAll(
			{
				include: [
					{
						model: ArticlePhase,
						where: {
							title: 'publish'
						}
					}
				]
			}
		).then(articles => {
			res.json(articles);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	updateOne: (req, res, next) => {
		let newFileUploadID = null;
		Article.findById(req.params.id).then(async article => {
			if (!article) {
				next(404);
				return null;
			}
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
			article.modifiedBy = req.user.id;
			article.dateReviewBy = G.defaultDateReviewByFunction();
			article.title = sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
			article.descriptionShort = sanitizeHTML(req.body.descriptionShort, config.sanitizeHTML.allowNone);
			article.content = req.body.content;
			article.contentAlt = req.body.contentAlt;
			article.contentInternal = req.body.contentInternal;
			article.useLegacy = sanitizeHTML(req.body.useLegacy, config.sanitizeHTML.allowNone) == 'true';
			article.requireAuth = sanitizeHTML(req.body.requireAuth, config.sanitizeHTML.allowNone) == 'true';
			article.contentLegacy = sanitizeHTML(req.body.contentLegacy, config.sanitizeHTML.default);
			article.contentAltLegacy = sanitizeHTML(req.body.contentAltLegacy, config.sanitizeHTML.default);
			article.contentInternalLegacy = sanitizeHTML(req.body.contentInternalLegacy, config.sanitizeHTML.default);
			article.displayMode = sanitizeHTML(req.body.displayMode, config.sanitizeHTML.allowNone);
			if (sanitizeHTML(req.body.imageRemoved, config.sanitizeHTML.allowNone) !== 'true') {
				article.idImage = newFileUploadID || article.idImage;
			} else {
				article.idImage = null;
			}
			if (req.body.actions && req.body.actions.length) {
				await article.setActions(req.body.actions.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await article.setActions([]);
			}
			if (req.body.tags && req.body.tags.length) {
				await article.setTags(req.body.tags.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await article.setTags([]);
			}
			if (req.body.audiences && req.body.audiences.length) {
				await article.setAudiences(req.body.audiences.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await article.setAudiences([]);
			}
			if (req.body.services && req.body.services.length) {
				await article.setServices(req.body.services.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await article.setServices([]);
			}
			if (req.body.components && req.body.components.length) {
				await article.setComponents(req.body.components.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await article.setComponents([]);
			}
			if (req.body.softwares && req.body.softwares.length) {
				await article.setSoftware(req.body.softwares.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await article.setSoftware([]);
			}
			await article.setArticlePhase(req.body.idArticlePhase);

			article.accessRestricted = sanitizeHTML(req.body.accessRestricted, config.sanitizeHTML.allowNone) == 'true';
			if (req.body.groups && req.body.groups.length) {
				await article.setGroups(req.body.groups.filter((value, index, self) => self.indexOf(value) === index));
			} else {
				await article.setGroups([]);
			}

			// Suggested Articles
			if (req.body.siblingArticles && req.body.siblingArticles.length) {
				await article.setSiblingArticles(req.body.siblingArticles.filter((value, index, self) => self.indexOf(value) === index && parseInt(value) !== article.id));
			} else {
				await article.setSiblingArticles([]);
			}

			/**
			 * ArticleContent
			 */
			if (Array.isArray(req.body.articleContent)) {
				for (const articleContentData of req.body.articleContent) {
					const {id, title, content, order} = articleContentData;
					const articleContent = await ArticleContent.findByPk(id);
					if (articleContent) {
						articleContent.order = order;
						articleContent.content = content;
						articleContent.title = title;
						await articleContent.save();
					} else {
						await ArticleContent.create(
							{
								idArticle: article.id,
								title,
								content,
								order,
							}
						);
					}
				}
			}
			if (Array.isArray(req.body.deletedArticleContent)) {
				for (const id of req.body.deletedArticleContent) {
					const articleContent = await ArticleContent.findByPk(id);
					if (articleContent) {
						await articleContent.destroy();
					}
				}
			}

			article.save().then(article_ => {
				res.json(
					{
						article: article_,
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
	deleteOne: (req, res, next) => {
		return res.send('Congrats you deleted one article.');
	}
};
