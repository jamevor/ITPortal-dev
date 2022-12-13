const config = require('../config.js');
const multer = require('multer');

module.exports = {
	storage: multer.diskStorage({
		destination: (req, file, done) => {
			done(null, config.fileUpload.dir);
		},
		filename: (req, file, done) => {
			const ext = file.mimetype.split('/')[1];
			done(null, `${file.fieldname}-${Date.now()}.${ext}`);
		}
	}),
	fileFilter: (req, file, done) => {
		if (!file) {
			done();
		}
		if (Object.values(config.fileUpload.mime).includes(file.mimetype)) {
			done(null, true);
		} else {
			done({
				message: 'File not supported'
			}, false);
		}
	}
};