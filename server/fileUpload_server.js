const config = require('../config.js');
const FileUpload = require('../models/FileUpload.js');
const path = require('path');
const fs = require('fs');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const sanitizeHTML = require('sanitize-html');
const moment = require('moment');

module.exports = {
	renderStreamByGUID: (req, res, next) => {
		FileUpload.findOne(
			{
				where: {
					guidPublic: req.params.guid
				}
			}).then(fileUpload => {
			if (!fileUpload) {
				next(404);
				return null;
			}
			res.redirect(fileUpload.getURL());
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	renderStream: (req, res, next) => {
		FileUpload.findOne(
			{
				where: {
					guidPublic: req.params.guid
				}
			}).then(fileUpload => {
			if (!fileUpload) {
				next(404);
				return null;
			}
			if (req.url !== fileUpload.getURL()) {
				res.redirect(fileUpload.getURL());
				return null;
			}
			const type = fileUpload.mimeType;
			const s = fs.createReadStream(fileUpload.path);
			s.on('open', () => {
				res.set('Cache-Control', 'max-age=31536000'); // cache images for 1 year
				res.set('Content-Type', type); // set content type to fileupload mime type
				s.pipe(res);
				return null;
			});
			s.on('error', () => {
				next(404);
				return null;
			});
		}).catch(err => {
			next(err);
			return null;
		});
	},
	create: (req, res, next) => {
		if (!req.file) {
			next(400);
			return null;
		}
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
				if (req.body.via === 'editorjs') {
					res.json(
						{
							success: 1,
							file: {
								url: newFileUpload_s.getURL()
							}
						}
					);
				} else {
					res.json(newFileUpload_s);
				}
				return null;
			}).catch(err => {
				next(err);
				return null;
			});
		});
	},
};