const G = require('./_global_logic.js');
const SubSite = require('../models/SubSite.js');
const SubSitePhase = require('../models/SubSitePhase.js');
const SubSiteFeaturedContent = require('../models/SubSiteFeaturedContent.js');
const SubSiteFeaturedContentPosition = require('../models/SubSiteFeaturedContentPosition.js');
const config = require('../config.js');
const sanitizeHTML = require('sanitize-html');
const url = require('url');
const Group = require('../models/Group.js');
const UserEditHistory = require('../models/UserEditHistory.js');
const FileUpload = require('../models/FileUpload.js');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');

module.exports = {
	renderById: async(req, res, next) => {
		const enforcePublished = await G.checkPermissions({req, entity: 'subsite', level: 'read', entityID: req.params.id}) ? {} : {title: 'publish'};
		SubSite.findOne(
			{
				where: {
					id: req.params.id
				},
				include: [
					{
						model: SubSitePhase,
						where: enforcePublished
					}
				]
			}).then(subsite => {
			if (!subsite) {
				next(404);
				return null;
			}
			res.redirect(url.format({
				pathname: subsite.getURL(),
				query: req.query
			}));
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	render: async(req, res, next) => {
		SubSite.findById(req.params.id, !(await G.checkPermissions({req, entity: 'subsite', level: 'read', entityID: req.params.id}))).then(async subsite => {
			let imageSrc;
			if (subsite && subsite.image) {
				imageSrc = subsite.image.getURL();
			}
			if (!subsite) {
				next(404);
				return null;
			} else if (req.path != subsite.getURL()) {
				res.redirect(url.format({
					pathname: subsite.getURL(),
					query: req.query
				}));
				return null;
			} else if (await G.checkPermissions({req, entity: 'subsite', level: 'read', entityID: req.params.id})) {
				const canEdit = await G.checkPermissions({req, entity: 'subsite', level: 'author', entityID: req.params.id});
				const featuredContentImageSources = [];
				for (let fc of subsite.subSiteFeaturedContents) {
					if (fc.image) {
						featuredContentImageSources.push(fc.image.getURL());
					} else {
						featuredContentImageSources.push(null);
					}
				}
				subsite = subsite.toJSON();
				if (imageSrc) {
					subsite.image.src = imageSrc;
				}
				res.render('subsite/view.ejs', {
					subsite,
					canEdit,
					featuredContentImageSources,
					title: `The WPI Hub | ${subsite.title}`
				});
				return null;
			} else if (subsite.getPhaseTitle() === 'publish') {
				const featuredContentImageSources = [];
				for (let fc of subsite.subSiteFeaturedContents) {
					if (fc.image) {
						featuredContentImageSources.push(fc.image.getURL());
					} else {
						featuredContentImageSources.push(null);
					}
				}
				subsite = subsite.toJSON();
				if (imageSrc) {
					subsite.image.src = imageSrc;
				}
				res.render('subsite/view.ejs', {
					subsite,
					featuredContentImageSources,
					canEdit: false,
					title: `The WPI Hub | ${subsite.title}`
				});
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
	getOne: (req, res, next) => {
		SubSite.findById(req.params.id).then(subsite => {
			if (!subsite) {
				return next(404);
			} else if (subsite.getPhaseTitle() === 'publish') {
				return res.json(subsite);
			} else if (G.checkPermissions({req, entity: 'subsite', level: 'read', entityID: req.params.id})) {
				return res.json(subsite);
			} else {
				return next(404);
			}
		}).catch(err => {
			return next(err);
		});
	},
	getAll: (req, res, next) => {
		SubSite.findAll(
			{
				where: {
					isArchived: false
				},
				include: [
					{
						model: SubSitePhase,
						where: {
							title: 'publish'
						}
					}
				]
			}
		).then(subsites => {
			res.json(subsites);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getAllPublic: (req, res, next) => {
		SubSite.findAll(
			{
				where: {
					isArchived: false,
					isPublic: true
				},
				include: [
					{
						model: SubSitePhase,
						where: {
							title: 'publish'
						}
					}
				]
			}
		).then(subsites => {
			res.json(subsites);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getAllFeatured: (req, res, next) => {
		SubSite.findAll(
			{
				where: {
					isArchived: false,
					isPublic: true,
					isFeatured: true
				},
				include: [
					{
						model: SubSitePhase,
						where: {
							title: 'publish'
						}
					}
				]
			}
		).then(subsites => {
			res.json(subsites);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	new: (req, res, next) => {
		SubSitePhase.findAll().then(async phases => {
			res.render('subsite/view.ejs', {
				edit: true,
				canEdit: true,
				phases,
				contentPositions: await SubSiteFeaturedContentPosition.findAll()
			});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	edit: (req, res, next) => {
		SubSite.findById(req.params.id).then(async subsite => {
			if (!subsite) {
				next(404);
				return null;
			} else {
				// check permission level
				const canPublish = await G.checkPermissions({req, entity: 'subsite', level: 'publish', entityID: req.params.id});
				let canRemoveGroups = await G.checkPermissions({req, entity: 'subsite', level: 'delete', entityID: req.params.id});

				let phases = [];
				if (canPublish) { // get phases if users can set the phase
					phases = await SubSitePhase.findAll();
				}

				await UserEditHistory.recordView(req.user.id, 'subsite', subsite.id);

				res.render('subsite/view.ejs', {
					subsite,
					edit: true,
					canEdit: true,
					phases,
					canPublish,
					canRemoveGroups,
					contentPositions: await SubSiteFeaturedContentPosition.findAll(),
					featuredContents: await SubSiteFeaturedContent.findAll(
						{
							where: {
								idSubsite: subsite.id
							}
						}
					),
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
		SubSite.create({
			createdBy: req.user.id,
			idSubSitePhase: sanitizeHTML(req.body.idSubSitePhase, config.sanitizeHTML.allowNone),
			title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
			titleRoute: sanitizeHTML(req.body.titleRoute, config.sanitizeHTML.allowNone),
			// icon: sanitizeHTML(req.body.icon, config.sanitizeHTML.allowNone),
			// color: sanitizeHTML(req.body.color, config.sanitizeHTML.allowNone),
			isPublic: sanitizeHTML(req.body.isPublic, config.sanitizeHTML.allowNone) === 'true',
			isFeatured: sanitizeHTML(req.body.isFeatured, config.sanitizeHTML.allowNone) === 'true',
			dateReviewBy: G.defaultDateReviewByFunction(),
			idImage: newFileUploadID
		}).then(async subsite => {
			if (req.body.audiences && req.body.audiences.length) {
				await subsite.setAudiences(req.body.audiences);
			} else {
				await subsite.setAudiences([]);
			}
			if (req.body.tags && req.body.tags.length) {
				await subsite.setTags(req.body.tags);
			} else {
				await subsite.setTags([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await subsite.setGroups(req.body.groups);
			} else {
				await subsite.setGroups([]);
			}
			res.json({
				subsite,
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
		SubSite.findById(req.params.id).then(async subsite => {
			if (!subsite) {
				next(404);
				return null;
			}
			if (sanitizeHTML(req.body.imageRemoved, config.sanitizeHTML.allowNone) !== 'true') {
				subsite.idImage = newFileUploadID || subsite.idImage;
			} else {
				subsite.idImage = null;
			}
			subsite.modifiedBy = req.user.id;
			subsite.idSubSitePhase = sanitizeHTML(req.body.idSubSitePhase, config.sanitizeHTML.allowNone);
			subsite.title = sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone);
			subsite.titleRoute = sanitizeHTML(req.body.titleRoute, config.sanitizeHTML.allowNone);
			// subsite.icon = sanitizeHTML(req.body.icon, config.sanitizeHTML.allowNone);
			// subsite.color = sanitizeHTML(req.body.color, config.sanitizeHTML.allowNone);
			subsite.isPublic = sanitizeHTML(req.body.isPublic, config.sanitizeHTML.allowNone) === 'true';
			subsite.isFeatured = sanitizeHTML(req.body.isFeatured, config.sanitizeHTML.allowNone) === 'true';
			subsite.dateReviewBy = G.defaultDateReviewByFunction();

			if (req.body.audiences && req.body.audiences.length) {
				await subsite.setAudiences(req.body.audiences);
			} else {
				await subsite.setAudiences([]);
			}
			if (req.body.tags && req.body.tags.length) {
				await subsite.setTags(req.body.tags);
			} else {
				await subsite.setTags([]);
			}
			if (req.body.groups && req.body.groups.length) {
				await subsite.setGroups(req.body.groups);
			} else {
				await subsite.setGroups([]);
			}
			subsite.save().then(async subsite_ => {
				res.json(
					{
						subsite: subsite_,
						created: false,
						canRemoveGroups: await G.checkPermissions({req, entity: 'subsite', level: 'delete', entityID: subsite_.id})
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
	getFeaturedContent: (req, res, next) => {
		SubSiteFeaturedContent.findAll({
			where: {
				idSubSite: req.params.id,
				isPublished: true
			},
			include: [
				{
					model: FileUpload,
					as: 'image',
					attributes: ['id', 'guidPublic', 'title']
				},
				{
					model: SubSiteFeaturedContentPosition,
					attributes: ['id', 'title']
				}
			],
			order: [
				['order', 'ASC']
			]
		}).then(metas => {
			res.json(
				metas.map(meta => {
					const fileUploadURL = meta.image ? meta.image.getURL() : '';
					meta = meta.toJSON();
					meta.fileUploadURL = fileUploadURL;
					return meta;
				})
			);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	createFeaturedContent: async(req, res, next) => {
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
		SubSiteFeaturedContent.create({
			createdBy: req.user.id,
			title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
			link: sanitizeHTML(req.body.link, config.sanitizeHTML.allowNone),
			isPublished: sanitizeHTML(req.body.published, config.sanitizeHTML.allowNone) === 'true',
			idPosition: parseInt(sanitizeHTML(req.body.position, config.sanitizeHTML.allowNone)),
			idSubSite: req.params.id,
			idFileUpload: newFileUploadID
		}).then(meta => {
			res.json({meta, created: true});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	updateFeaturedContent: async(req, res, next) => {
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
		SubSiteFeaturedContent.findByPk(req.body.id).then(meta => {
			if (meta.idSubSite != req.params.id) {
				next(400);
				return null;
			}
			meta.update(
				{
					modifiedBy: req.user.id,
					title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
					link: sanitizeHTML(req.body.link, config.sanitizeHTML.allowNone),
					isPublished: sanitizeHTML(req.body.published, config.sanitizeHTML.allowNone),
					idPosition: sanitizeHTML(req.body.position, config.sanitizeHTML.allowNone),
					idFileUpload: newFileUploadID || meta.idFileUpload
				}
			).then(meta_ => {
				res.json({meta: meta_, created: false});
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
	updateFeaturedContentOrder: async(req, res, next) => {
		if (Array.isArray(req.body.items)) {
			try {
				await SubSiteFeaturedContent.update(
					{
						order: null
					},
					{
						where: {}
					}
				);
				for (const item of req.body.items) {
					await SubSiteFeaturedContent.update(
						{
							modifiedBy: req.user.id,
							order: item.order
						},
						{
							where: {
								id: item.id
							}
						}
					);
				}
				res.json(
					{
						success: true,
						reorder_count: req.body.items.length
					}
				);
				return null;
			} catch(err) {
				next(err);
				return null;
			}
		}
		next(400);
		return null;
	},
	setIsPublishedFeaturedContent: (req, res, next) => {
		SubSiteFeaturedContent.findByPk(req.body.id).then(meta => {
			meta.isPublished = req.body.published === 'true';
			return meta.save().then(() => {
				res.status(204).send();
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
						model: SubSite,
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
						entity: 'subsite',
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
