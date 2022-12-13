const router = require('express').Router();
const uaParser = require('ua-parser-js');
const url = require('url');

router.use((req, res, next) => {
	if (isBrowserCompatibilityIgnored(req)) {
		next();
	} else {
		const oldRedirectURI = typeof req.session.browserCompatibility !== 'undefined' && req.session.browserCompatibility.redirectURI ? req.session.browserCompatibility.redirectURI : null;
		req.session.browserCompatibility = {
			isIgnored: 'false',
			redirectURI: req.path !== '/browser-compatibility' ? req.path : oldRedirectURI
		};
		const userAgent = uaParser(req.headers['user-agent']);
		const browser = userAgent.browser;
		if (!isSupported(browser) && req.path !== '/browser-compatibility') {
			res.redirect('/browser-compatibility');
		} else {
			req.session.browserCompatibility.isIgnored = 'true';
			next();
		}
	}
	return null;
});

router.get('/browser-compatibility', (req, res, next) => {
	const userAgent = uaParser(req.headers['user-agent']);
	const browser = userAgent.browser;
	res.render('pages/browser-compatibility.ejs', {
		title: 'Browser Compatibility Checker',
		browserDetected: browser && browser.name,
		supported: isSupported(browser),
		browserName: browser && browser.name ? browser.name : '',
		browserVersion: browser && browser.major ? browser.major : ''
	});
});

router.get('/browser-compatibility/ignore', (req, res, next) => {
	req.session.browserCompatibility.isIgnored = 'true';
	res.redirect(url.format(
		{
			pathname: req.session.browserCompatibility.redirectURI || '/',
			query: {
				traffic_source: 'browser-compatibility'
			}
		}
	));
	return null;
});

const isBrowserCompatibilityIgnored = req => typeof req.session !== 'undefined' && typeof req.session.browserCompatibility !== 'undefined' && req.session.browserCompatibility.isIgnored === 'true';

const isSupported = browser => typeof browser !== 'undefined' && browser.name !== 'IE';

module.exports = router;