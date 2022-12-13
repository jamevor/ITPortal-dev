'use strict';
const express = require('express');

const router = express.Router();

router.get('/IDPError', (req, res, next) => {
	res.redirect('/error/IDP');
	return null;
});

router.get('/error/IDP', (req, res, next) => {
	res.render('errors/IDP.ejs');
	return null;
});
router.get('/error/:status([0-9]{3})', (req, res, next) => {
	return next(parseInt(req.params.status));
});

// export router
module.exports = router;