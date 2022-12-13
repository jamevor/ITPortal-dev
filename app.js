'use strict';
require('pkginfo')(module, 'version');
const config = require('./config.js');
const errors = require('./errors.js');
const path = require('path');
const fs = require('fs');
const express = require('express');
const logger = require('./server/logger.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const url = require('url');
const G = require('./server/_global_logic.js');
const search =  require('./server/search_server.js');
const moment = require('moment-timezone');
const Greeting = require('./models/Greeting.js');

const $SERVER_ROOT = process.env.SERVER_ROOT || '';
const PORT = process.env.PORT || 3000;
const app = express();


/**
 * Trust the reverse proxy information.
 * This allows req.ip to contain the client ip instead of localhost on every request.
 */
app.enable('trust proxy');


/**
 * create the upload directory dynamically if it doesn't exist
 */
let buildDir = '', splitDir = config.fileUpload.dir.split('/');
splitDir.forEach(s => {
	buildDir += s + '/';
	if (fs.existsSync(buildDir)) {
		logger.notify(`directory already exists: ${buildDir}`);
	} else {
		fs.mkdirSync(buildDir);
		logger.notify(`created directory: ${buildDir}`);
	}
});

/**
 * Let's make a database.
 */
const modelsBuilder = require('./models');
modelsBuilder().then(models => {
	app.set('models', models);
	if (process.env.BUILD_DB == 'true' && process.env.NODE_APP_INSTANCE === '0') {
		app.get('models').sequelize.sync().then(() => {
			return setup();
		}).catch(err => {
			logger.err(err);
			return err;
		});
	} else {
		setup();
	}
}).catch(err => {
	logger.err(err);
	logger.err('Connection failed, initializing default app instance...');
	initializeFallbackApplication();
});


function setup() {
	/**
	 * Create the app using express
	 */
	app.listen(PORT, () => {
		logger.info(`nodejs version: ${process.version}`);
		logger.info(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
		logger.info(`The WPI Hub running on port: ${PORT}`);
		logger.info(`The WPI Hub version: ${module.exports.version}`);
		logger.info(`Process args: ${process.argv.toString()}`);
	});

	app.set('view engine', 'ejs'); // use ejs as templating engine

	/**
	 * Listen for unhandled promise rejections and log http requests on dev using morgan.
	 */
	if (process.env.NODE_ENV === 'development') {


		// TODO this should probably be handled by Apache2 | nginx, but in dev I just want to test it. Sincerely, Ryan :)
		app.use((req, res, next) => {
			res.header('Set-Cookie', 'HttpOnly;Secure;SameSite=None');
			next();
		});

		process.on('unhandledRejection', (p, reason) => {
			logger.warn(`Unhandled rejection: ${p}, reason: ${reason}`);
		});
	}

	/**
	 * Let the users have stuff that's public
	 */
	setupStaticPaths();

	/**
	 * Parse body, so that data sent from client gets stored in {req.body} on requests
	 */
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());

	/**
	 * Session store in database
	 */
	app.use(cookieParser());

	const sessionStore = new SequelizeStore({
		db: app.get('models').sequelize,
		expiration: 7* 24 * 60 * 60 * 1000 // one week (in milliseconds)
	});

	if (process.env.NODE_APP_INSTANCE === '0') {
		sessionStore.sync();
	}

	app.use(session({
		secret: config.sessionSecret,
		store: sessionStore,
		saveUninitialized: true,
		resave: true,
		proxy: true
	}));


	/**
	 * Use passport for SAML2 auth
	 */
	app.use(passport.initialize());
	app.use(passport.session());
	require('./server/passport_server.js').init(passport);

	if (process.env.NODE_APP_INSTANCE === '0') {
		require('./server/database_builder/_create_super_user.js')();
		if (process.env.IMPORT_DATA === 'true') {
			require('./server/database_builder/_generate_default_database_values.js')();
		}
	}

	/**
	 * variables that are available to all EJS views
	 */
	app.use(async(req, res, next) => {
		res.locals.$SERVER_ROOT = $SERVER_ROOT;
		res.locals.robots = 'index, follow';
		res.locals.includeGetSupport = true;
		res.locals.url = req.originalUrl;
		res.locals.user = req.user;
		res.locals.oauths = {
			canvas: req.user && req.user.userOauths && req.user.userOauths.some(u => u.type === 'canvas'),
			azure: req.user && req.user.userOauths && req.user.userOauths.some(u => u.type === 'azure')
		};
		res.locals.userSidebarWidgets = true;
		res.locals.userAttributes = req.session.userAttributes || {};
		res.locals.userOpenTicketCount = req.session.userOpenTicketCount || '';
		res.locals.userOpenApprovalCount = req.session.userOpenApprovalCount || '';
		res.locals.userAssetCount = req.session.userAssetCount || '';
		res.locals.version = module.exports.version;
		res.locals.siteInfo = config.siteInfo;
		res.locals.siteInfo.phoneDisplay = G.formatPhoneNumber(res.locals.siteInfo.phone);
		res.locals.grecaptcha_public_key = config.grecaptcha.publicKey;
		res.locals.descriptionShort = 'IT Service & Support enables the effective use of technology for teaching, learning, research, and the administrative work of the University by providing technology and mobility solutions, support, IT content and communications.';
		if (req.isAuthenticated()) {
			res.locals.preferences = req.user.userPreference || {};
			req.session.preferences = req.user.userPreference || {};
		} else {
			res.locals.preferences = req.session.preferences || {};
		}
		res.locals.snowEnabled = isSnowEnabled();
		res.locals.moment = moment;
		res.locals.ColorConverter = require('./server/modules/ColorConverter.js');
		if (req.user && req.session.userAttributes && req.session.userAttributes.givenname) {
			try {
				res.locals.greeting = `Hi ${req.session.userAttributes.givenname}!`;
				let langHeader = req.header('Accept-Language').split('-')[0].toLocaleLowerCase();
				let greeting = await Greeting.findByPk(langHeader);
				if (greeting) {
					res.locals.greeting = greeting.greeting.replace(/{{\s*name\s*}}/g, req.session.userAttributes.givenname);
				}
			} catch (err) {
				logger.err(err);
			}
		}
		return next();
	});

	/**
	 * check browser compatibility
	 */
	app.use(require('./server/browser_compatibility_checker.js'));

	/**
	 * Let's do some routing
	 */
	require('./server/routes.js')(app);

	/**
	 * Setup job to run at midnight refreshing search index
	 */
	if (process.env.NODE_APP_INSTANCE === '0' && process.env.NODE_ENV === 'production') {
		require('./server/_cron.js')();
	}

	/**
	 * Error handling
	 */
	app.use(async(err, req, res, next) => {
		const error = err instanceof Error ? err : new Error();
		const errorStatus = typeof err === 'number' ? err : err.status;
		error.status = errorStatus in errors ? errorStatus : 500;

		if (process.env.NODE_ENV === 'development' || error.status !== 404) {
			logger.err(error);
		}

		const localVars = {
			error: errors[error.status],
			robots: 'noindex, nofollow',
			title: 'The WPI Hub | Error'
		};

		if (req.accepts('html') !== false) {
			switch(error.status) {
				case 500: {
					res.status(error.status).render('errors/500.ejs', localVars);
					break;
				}
				case 403: {
					res.status(error.status).render('errors/403.ejs', localVars);
					break;
				}
				case 404: {
					const smartQuery = beSmartAndSuggestive(url.parse(req.originalUrl).pathname);
					localVars.result = await search.queryIndexSilent({...smartQuery, length: 5});
					localVars.query = smartQuery.query;
					localVars.terms = smartQuery.query.split(' ').filter(q => q != '');
					res.status(error.status).render('errors/404.ejs', localVars);
					break;
				}
				default: {
					res.status(error.status).render('errors/error.ejs', localVars);
					break;
				}
			}
		} else {
			res.status(error.status).json(
				{
					status: error.status,
					error: errors[error.status]
				}
			);
		}
		return null;
	});

	return null;
}

function setupStaticPaths() {

	const ages = {
		short: 2628000000, // 1 month
		medium: 15768000000, // 6 months
		long: 31536000000 // 1 year
	};

	if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
		app.use('/css',
			(req, res, next) => {
				req.url = req.url.replace('.css', '.min.css');
				return next();
			},
			express.static(path.join(__dirname, '/resources/css/dist/'), {extensions: ['min.css', 'css']})
		);
		app.use('/js', express.static(path.join(__dirname, '/resources/js/dist/')));
	} else {
		app.use('/css', express.static(path.join(__dirname, '/resources/css/src/')));
		app.use('/js', express.static(path.join(__dirname, '/resources/js/src/')));
	}
	if (process.env.NODE_ENV !== 'production') {
		app.use('/', express.static(path.join(__dirname, `/resources/static/${process.env.NODE_ENV}`)));
	}
	app.use('/', express.static(path.join(__dirname, '/resources/static/production')));
	app.use('/img', express.static(path.join(__dirname, '/resources/img/'), { maxAge: ages.long }));
	app.use('/resources/uploads', express.static(path.join(__dirname, '/resources/uploads/'))); // ? is this needed?
	app.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist/'), { maxAge: ages.medium }));
	app.use('/font-awesome', express.static(path.join(__dirname, '/node_modules/@fortawesome/fontawesome-pro/'), { maxAge: ages.medium }));
	app.use('/qrcode', express.static(path.join(__dirname, '/node_modules/qrcode/build'), { maxAge: ages.medium }));
	app.use('/datatables', express.static(path.join(__dirname, '/node_modules/datatables.net/'), { maxAge: ages.medium }));
	app.use('/filterizr', express.static(path.join(__dirname, '/node_modules/filterizr/dist'), { maxAge: ages.medium }));
	app.use('/datatables-buttons', express.static(path.join(__dirname, '/node_modules/datatables.net-buttons/'), { maxAge: ages.medium }));
	app.use('/datatables-buttons-zf', express.static(path.join(__dirname, '/node_modules/datatables.net-buttons-zf/'), { maxAge: ages.medium }));
	app.use('/datatables-zf', express.static(path.join(__dirname, '/node_modules/datatables.net-zf/'), { maxAge: ages.medium }));
	app.use('/jszip', express.static(path.join(__dirname, '/node_modules/jszip/dist/'), { maxAge: ages.medium }));
	app.use('/pdfmake', express.static(path.join(__dirname, '/node_modules/pdfmake/build/'), { maxAge: ages.medium }));
	app.use('/onscan', express.static(path.join(__dirname, '/node_modules/onscan.js/'), { maxAge: ages.medium }));

	app.use('/foundation', express.static(path.join(__dirname, '/node_modules/foundation-sites/dist/'), { maxAge: ages.medium }));
	app.use('/flickity', express.static(path.join(__dirname, '/node_modules/flickity/dist/'), { maxAge: ages.medium }));
	app.use('/flickity-fullscreen', express.static(path.join(__dirname, '/node_modules/flickity-fullscreen/'), { maxAge: ages.medium }));
	app.use('/moment', express.static(path.join(__dirname, '/node_modules/moment/min/'), { maxAge: ages.medium }));
	app.use('/moment-timezone', express.static(path.join(__dirname, '/node_modules/moment-timezone/builds/'), { maxAge: ages.medium }));
	app.use('/simplebar', express.static(path.join(__dirname, '/node_modules/simplebar/dist/'), { maxAge: ages.medium }));
	app.use('/editorjs/editorjs', express.static(path.join(__dirname, '/node_modules/@editorjs/editorjs/dist/'), { maxAge: ages.medium }));
	app.use('/editorjs/image', express.static(path.join(__dirname, '/node_modules/@editorjs/image/dist/'), { maxAge: ages.medium }));
	app.use('/editorjs/table', express.static(path.join(__dirname, '/node_modules/@editorjs/table/dist/'), { maxAge: ages.medium }));
	app.use('/editorjs/code', express.static(path.join(__dirname, '/node_modules/@editorjs/code/dist/'), { maxAge: ages.medium }));
	app.use('/editorjs/inline-code', express.static(path.join(__dirname, '/node_modules/@editorjs/inline-code/dist/'), { maxAge: ages.medium }));
	app.use('/editorjs/checklist', express.static(path.join(__dirname, '/node_modules/@editorjs/checklist/dist/'), { maxAge: ages.medium }));
	app.use('/editorjs/embed', express.static(path.join(__dirname, '/node_modules/@editorjs/embed/dist/'), { maxAge: ages.medium }));
	app.use('/editorjs/quote', express.static(path.join(__dirname, '/node_modules/@editorjs/quote/dist/'), { maxAge: ages.medium }));
	app.use('/easy-autocomplete', express.static(path.join(__dirname, '/node_modules/easy-autocomplete/dist/'), { maxAge: ages.medium }));
	app.use('/modules/ColorConverter.js', express.static(path.join(__dirname, '/server/modules/ColorConverter.js'), { maxAge: ages.long }));
	app.use('/leaflet', express.static(path.join(__dirname, '/node_modules/leaflet/dist/'), { maxAge: ages.medium }));
	app.use('/algoliasearch', express.static(path.join(__dirname, '/node_modules/algoliasearch/dist/'), { maxAge: ages.medium }));
	app.use('/instantsearch', express.static(path.join(__dirname, '/node_modules/instantsearch.js/dist/'), { maxAge: ages.medium }));
	app.use('/instantsearch', express.static(path.join(__dirname, '/node_modules/instantsearch.css/themes/'), { maxAge: ages.medium }));
	app.use('/conversational-form', express.static(path.join(__dirname, '/node_modules/conversational-form/dist/'), { maxAge: ages.medium }));
	app.use('/jsbarcode', express.static(path.join(__dirname, '/node_modules/jsbarcode/dist/'), { maxAge: ages.medium }));
	app.use('/chart.js', express.static(path.join(__dirname, '/node_modules/chart.js/dist/'), { maxAge: ages.long }));
	app.use('/dragula', express.static(path.join(__dirname, '/node_modules/dragula/dist/'), { maxAge: ages.long }));
	app.use('/intro.js', express.static(path.join(__dirname, '/node_modules/intro.js/minified/'), { maxAge: ages.medium }));
	app.use('/jeditable', express.static(path.join(__dirname, '/node_modules/jquery-jeditable/dist/'), { maxAge: ages.medium }));
	app.use('/isotope', express.static(path.join(__dirname, '/node_modules/isotope-layout/dist/'), { maxAge: ages.medium }));
}

// now its a seasonal theme but kinda a manual process of changing the unicode character in snow.js, etc.
function isSnowEnabled() {
	return (new Date().getMonth() <= 4 || new Date().getMonth() >= 10); // 0-11 Jan-Dec
}

/**
 * @param {String} str - string to be smart about.
 */
function beSmartAndSuggestive(str) {
	const parts = decodeURI(str).split('/').map(p => p.toLowerCase()).slice(1); // tokenize, lowercase, remove first blank path
	const possibleFacets = ['article', 'news', 'component', 'service', 'portfolio', 'action', 'software', 'location', 'building', 'page', 'spread', 'server'];
	const stopWords = ['', 'about', 'above', 'after', 'again', 'all', 'also', 'am', 'an', 'and', 'another','any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below','between', 'both', 'but', 'by', 'came', 'can', 'cannot', 'come', 'could', 'did','do', 'does', 'doing', 'during', 'each', 'few', 'for', 'from', 'further', 'get','got', 'has', 'had', 'he', 'have', 'her', 'here', 'him', 'himself', 'his', 'how','if', 'in', 'into', 'is', 'it', 'its', 'itself', 'like', 'make', 'many', 'me','might', 'more', 'most', 'much', 'must', 'my', 'myself', 'never', 'now', 'of', 'on','only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own','said', 'same', 'see', 'should', 'since', 'so', 'some', 'still', 'such', 'take', 'than','that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they','this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was','way', 'we', 'well', 'were', 'what', 'where', 'when', 'which', 'while', 'who','whom', 'with', 'would', 'why', 'you', 'your', 'yours', 'yourself','a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n','o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '$', '1','2', '3', '4', '5', '6', '7', '8', '9', '0', '_'];
	let facetFilters = null;
	if (possibleFacets.includes(parts[0])) {
		facetFilters = [[`type:${parts.shift()}`]];
	}
	let query = parts.reduce((acc, w) => [...acc, ...w.replace(/[^A-z0-9]/g, ' ').split(' ')], []).filter(w => !stopWords.includes(w)).join(' ');
	return { facetFilters, query };
}

function initializeFallbackApplication() {
	app.listen(PORT, () => {
		logger.info(`nodejs version: ${process.version}`);
		logger.info(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
		logger.info(`ITPortal running on port: ${PORT}`);
		logger.info(`ITPortal version: ${module.exports.version}`);
		logger.info(`Process args: ${process.argv.toString()}`);
	});

	app.set('view engine', 'ejs'); // use ejs as templating engine

	setupStaticPaths();

	app.get('*', render503);
}

function render503(req, res) {
	res.status(503).render('errors/503.ejs',
		{
			includeGetSupport: true,
			robots: 'noindex, nofollow',
			title: 'The WPI Hub | Error',
			siteInfo: {
				...config.siteInfo,
				phoneDisplay: G.formatPhoneNumber(config.siteInfo.phone)
			}
		}
	);
}


