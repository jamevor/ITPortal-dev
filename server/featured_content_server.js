const Meta_Home_FeaturedContent = require('../models/Meta_Home_FeaturedContent.js');
const Meta_Home_FeaturedContentPosition = require('../models/Meta_Home_FeaturedContentPosition.js');
const FileUpload = require('../models/FileUpload.js');
const path = require('path');
const fs = require('fs');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const sanitizeHTML = require('sanitize-html');
const moment = require('moment');
const config = require('../config.js');
const G = require('./_global_logic.js');

module.exports = {
	metaHomeGet: (req, res, next) => {
		Meta_Home_FeaturedContent.findAll({
			where: {
				isPublished: true,
				isArchived: false
			},
			include: [
				{
					model: FileUpload,
					attributes: ['id', 'guidPublic', 'title']
				},
				{
					model: Meta_Home_FeaturedContentPosition,
					attributes: ['id', 'title']
				}
			],
			order: [
				['order', 'ASC']
			]
		}).then(metas => {
			res.json(
				metas.map(meta => {
					const fileUploadURL = meta.fileUpload ? meta.fileUpload.getURL() : '';
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
	setPublished: (req, res, next) => {
		Meta_Home_FeaturedContent.findByPk(req.params.id).then(meta => {
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
		if (sanitizeHTML(req.body.published, config.sanitizeHTML.allowNone) === 'true') {
			const canPublish = await G.checkPermissions({req, entity: 'featuredcontent', level: 'publish'});
			if (!canPublish) {
				next(403);
				return null;
			}
		}
		Meta_Home_FeaturedContent.create({
			createdBy: req.user.id,
			title: sanitizeHTML(req.body.title, config.sanitizeHTML.allowNone),
			link: sanitizeHTML(req.body.link, config.sanitizeHTML.allowNone),
			isPublished: sanitizeHTML(req.body.published, config.sanitizeHTML.allowNone) === 'true',
			idPosition: parseInt(sanitizeHTML(req.body.position, config.sanitizeHTML.allowNone)),
			idFileUpload: newFileUploadID
		}).then(meta => {
			res.json({meta, created: true});
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
		if (sanitizeHTML(req.body.published, config.sanitizeHTML.allowNone) === 'true') {
			const canPublish = await G.checkPermissions({req, entity: 'featuredcontent', level: 'publish'});
			if (!canPublish) {
				next(403);
				return null;
			}
		}
		Meta_Home_FeaturedContent.findByPk(req.params.id).then(meta => {
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
	updateOrder: async(req, res, next) => {
		if (Array.isArray(req.body.items)) {
			try {
				await Meta_Home_FeaturedContent.update(
					{
						order: null
					},
					{
						where: {}
					}
				);
				for (const item of req.body.items) {
					await Meta_Home_FeaturedContent.update(
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
};