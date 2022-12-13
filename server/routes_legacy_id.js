'use strict';
const express = require('express');

// helpers
const stripID_redirect = (req, res, next) => {
	return res.redirect(301, `/${req.url.split('/')[1]}/${req.params.id}`);
};

const router = express.Router();
// strip ID from legacy routes
router.get('/article/id/:id(\\d+)/:title?', stripID_redirect);
router.get('/software/id/:id(\\d+)/:title?', stripID_redirect);
router.get('/news/id/:id(\\d+)/:title?', stripID_redirect);
router.get('/component/id/:id(\\d+)/:title?', stripID_redirect);
router.get('/service/id/:id(\\d+)/:title?', stripID_redirect);
router.get('/building/id/:id(\\d+)/:title?', stripID_redirect);
router.get('/location/id/:id(\\d+)/:title?', stripID_redirect);
router.get('/glossary/id/:id(\\d+)/:title?', stripID_redirect);
router.get('/package/id/:id(\\d+)/:title?', stripID_redirect);
router.get('/server/id/:id(\\d+)/:title?', stripID_redirect);

// permanent redirect old routes to new ones
router.get('/All-Software', (req, res, next) => {
	return res.redirect(301, '/Software-Library');
});
router.get('/All-News', (req, res, next) => {
	return res.redirect(301, '/News-and-Events');
});
router.get('/All-Articles', (req, res, next) => {
	return res.redirect(301, '/Knowledge-Base');
});
router.get('/All-Locations', (req, res, next) => {
	return res.redirect(301, '/Locations');
});
router.get('/All-Services', (req, res, next) => {
	return res.redirect(301, '/Service-Catalog');
});
router.get('/Utilities', (req, res, next) => {
	return res.redirect(301, '/App-Marketplace');
});

/**
 * Redirect legacy forms
 */

router.get('/io/Visitor', (req, res, next) => {
	return res.redirect(301, '/io/Campus-Visitor');
});
router.get('/io/Vendor', (req, res, next) => {
	return res.redirect(301, '/io/Campus-Visitor');
});
router.get('/io/Human-Subjects', (req, res, next) => {
	return res.redirect(301, '/io/Campus-Visitor');
});
router.get('/io/External-Partner', (req, res, next) => {
	return res.redirect(301, '/io/Campus-Visitor');
});
router.get('/io/Department-Log', (req, res, next) => {
	return res.redirect(301, '/io/Campus-Visitor');
});


// export router
module.exports = router;