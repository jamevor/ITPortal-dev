const G = require('./_global_logic.js');
const passport = require('passport');
const passport_ = require('./passport_server.js');
const logger = require('./logger.js');
const config = require('../config.js');
const sanitizeHTML = require('sanitize-html');
const path = require('path');
const compose = require('./compose_server.js');
const article = require('./article_server.js');
const news = require('./news_server.js');
const software = require('./software_server.js');
const softwareOS = require('./softwareOS_server.js');
const softwareType = require('./softwareType_server.js');
const portfolio = require('./portfolio_server.js');
const component = require('./component_server.js');
const service = require('./service_server.js');
const building = require('./building_server.js');
const location = require('./location_server.js');
const license = require('./license_server.js');
const package_ = require('./package_server.js');
const server = require('./server_server.js');
const user = require('./user_server.js');
const session = require('./session_server.js');
const action = require('./action_server.js');
const tag = require('./tag_server.js');
const audience = require('./audience_server.js');
const alias = require('./alias_server.js');
const featuredContent = require('./featured_content_server.js');
const preview = require('./preview_server.js');
const search = require('./search_server.js');
const feed = require('./feed_server.js');
const console_ = require('./console_server.js');
const spread = require('./spread_server.js');
const hours = require('./hours_server.js');
const myapp = require('./myapp_server.js');
const subsite = require('./subsite_server.js');
const gizmo = require('./gizmo_server.js');
// const requestLog = require('./requestLog_server.js');
const group = require('./group_server.js');
const oauth_router = require('./oauth');

// const virtualAgent = require('./modules/virtual-agent');
// const Intro = new virtualAgent(undefined, { resave: true });

const fileUpload = require('./fileUpload_server.js');
const multer = require('multer');
const { ensureAuthenticatedUnless } = require('./_global_logic.js');

module.exports = app => {
	/**
	 * file upload middleware config
	 */
	const multerConfig = require('./multer_config.js');

	/**
	 * @deprecated This is a sub module for forwarding legacy routes.
	 */
	app.use(require('./routes_legacy_id.js'));

	/**
	 * Middlewares that run on every request
	 */
	app.use(G.setActiveTab);
	app.use(G.buildPageTitle);
	/**
	 * Middlewares that run sometimes
	 */
	app.use('/console', G.ensureAuthenticated, console_.buildConsoleTabs);
	app.use('/Me', G.ensureAuthenticatedUnless, user.buildMeTabs);

	/**
	 * other stuff
	 */
	app.get('/', compose.index);
	app.get('/Service-Catalog', compose.renderServiceCatalog);
	app.get('/News-and-Events', compose.renderNewsAndEvents);
	app.get('/Software-Library', compose.renderSoftwareLibrary);
	// `/Locations` now redirects to `/Locations-and-Servers`
	app.get('/Locations', compose.renderLocationsAndServers);
	app.get('/Locations-and-Servers', compose.renderLocationsAndServers);
	app.get('/Knowledge-Base', compose.renderKnowledgeBase);
	app.get('/Sites', compose.renderSitesSite);
	app.get('/App-Marketplace', compose.renderAppMarketplace);
	app.get('/Help', compose.help);
	app.get('/Community', compose.community);
	app.get('/Accounts', compose.accounts);
	app.get('/Admin', compose.admin);
	app.get('/Search', compose.search);
	app.get('/Site-Map', compose.sitemap);
	app.get('/byewpi', compose.byeWPI);
	app.get('/Discover-Canvas', compose.renderDiscoverCanvas);
	app.get('/Hub-Birthday', compose.renderHubBirthday);
	app.get('/io/Laptop-Recommendation', compose.renderLaptopRec);
	app.get('/io/NSC',G.ensureAuthenticated, compose.authNSC);
	app.get('/Lever', compose.renderLever);
	app.get('/Amogus', compose.renderAmogus);
	app.get('/IE/:subsite?/:id(\\d+)?', compose.renderSIE);
	app.get('/SIE/:subsite?/:id(\\d+)?', compose.renderSIE);

	// app.get('/Staff-Council', G.ensureAuthenticated, compose.renderStaffCouncil);

	

	/**
	 * Forms and IOs
	 */
	// VIEWs
	
	app.get('/Request', compose.renderHelpForm);
	app.get('/Feedback', compose.renderFeedbackForm);
	// app.get('/io/Lab-Reopening', G.ensureAuthenticated, compose.renderCovid19Form);
	// app.get('/io/Lab-Reopening-Addition', G.ensureAuthenticated, compose.renderCovid19AddForm);
	// app.get('/io/Lab-Reopening-Human-Subjects', G.ensureAuthenticated, compose.renderCovid19HumanSubjectsForm);
	// app.get('/io/Research-Continuity', G.ensureAuthenticated, compose.renderCovid19ResearchContForm);
	// app.get('/io/Research-And-Project-Continuity', G.ensureAuthenticated, compose.renderCovid19ResearchContForm);
	// app.get('/io/Lab-Reopening-External-Partner', G.ensureAuthenticated, compose.renderCovid19ExternalForm);
	// app.get('/io/Department-Reopening', G.ensureAuthenticated, compose.renderCovid19FormCampus);
	app.get('/io/Grade-Format-Request', G.ensureAuthenticated, compose.renderPassFailForm);
	app.get('/io/Student-Intent-legacy', G.ensureAuthenticated, compose.renderStudentIntent);
	app.get('/io/NSO', G.ensureAuthenticated, compose.renderNSOForm);
	// app.get('/io/Change-Test-Day', G.ensureAuthenticated, compose.renderTestChangeForm);
	// app.get('/io/Change-Arrival', G.ensureAuthenticated, compose.renderArrivalChangeForm);
	// app.get('/io/Change-Onboarding', G.ensureAuthenticated, compose.renderOnboardingChangeForm);
	// app.get('/io/Campus-Visitor', compose.renderCampusVisitor);
	app.get('/io/Add-Drop', G.ensureAuthenticated, compose.renderAddDrop);
	app.get('/io/Summer', compose.renderETerm2022);
	app.get('/io/Intent-To-Graduate', G.ensureAuthenticated, compose.renderIntentToGraduate);
	// app.get('/io/Student-Concern/:STUDENTID?/:STUDENTNAME?/:CRN?/:CRTITLE?', G.ensureAuthenticated, compose.renderStudentConcern);
	app.get('/io/Workday-Request/', G.ensureAuthenticated, compose.renderWorkdayRequest);
	app.get('/io/Software-Request/', G.ensureAuthenticated, compose.renderSoftwareRequest);
	// Bursar Forms
	app.get('/io/TitleIV/', G.ensureAuthenticated, compose.renderBursarTitleIV);
	app.get('/io/Graduate-Health-Fee/', G.ensureAuthenticated, compose.renderBursarGradHealthFee);
	app.get('/io/Meal-Plan-Change/', G.ensureAuthenticated, compose.renderBursarMealPlanChange);
	app.get('/io/Move-Credit-Funds/', G.ensureAuthenticated, compose.renderBursarMoveCredit);
	app.get('/io/Parent-Plus-Loan-Authorization/', compose.renderBursarParentPlusLoan);
	app.get('/io/Request-A-Refund/', G.ensureAuthenticated, compose.renderBursarRefund);
	app.get('/io/Tuition-And-Fee-Letter/', G.ensureAuthenticated, compose.renderBursarTuitionLetter);
	app.get('/io/Graduate-Insurance-Opt/', G.ensureAuthenticated, compose.renderBursarGradInsuranceOpt);
	app.get('/io/Voluntary-Meal-Plan/', G.ensureAuthenticated, compose.renderBursarVoluntaryMealplan);

	// app.get('/io/Commencement-Participation/', G.ensureAuthenticated, compose.renderCommencementParticipation);
	// app.get('/io/Commencement-Participation/', G.ensureAuthenticated, compose.redirectCommencementParticipation);

	/**
	 * AlgoliaSearch
	 */
	// VIEW
	// API
	app.get('/api/v1/search', search.query);
	app.get('/api/v1/search/refresh', G.nextIfAdmin, search.refresh);
	app.get('/api/v1/search/viewObject', G.nextIfAdmin, search.preview);

	/**
	 * Preview
	 */
	// VIEWS
	app.get('/preview/:guid', preview.view);
	// API
	app.post('/api/v1/preview/create/one', async(req, res, next) => {
		if (await G.checkPermissions({req, entity: sanitizeHTML(req.body.entity, config.sanitizeHTML.allowNone), entityID: sanitizeHTML(req.body.entityID, config.sanitizeHTML.allowNone), level: 'read'})) {
			next();
		} else {
			next(403);
		}
	}, preview.create);
	/**
	 * 8x8 Telephony
	 */
	app.post('/api/v1/8x8/ScreenPop/:token?', compose.renderScreenPop);

	/**
	 * CONSOLE
	 */
	/**
	 * VIEWS
	 */
	app.get('/console', G.hasPermissions({entity: 'console'}), console_.dashboard);
	app.get('/console/my-groups', G.hasPermissions({entity: 'console'}), console_.myGroups);
	app.get('/console/history', G.hasPermissions({entity: 'console'}), console_.history);
	app.get('/console/site', G.hasPermissions({entity: 'featuredcontent', level: 'read'}), console_.site);
	app.get('/console/permissions', G.hasPermissions({entity: 'permission', level: 'read'}), console_.permissions);
	app.get('/console/users', G.hasPermissions({entity: 'user', level: 'read'}), console_.users);
	app.get('/console/groups', G.nextIfAdmin, console_.groups);
	app.get('/console/hours', G.hasPermissions({entity: 'hours', level: 'read'}), console_.hours);
	/*
	app.get('/console/documents-and-images', G.hasPermissions('fileupload', 'read'), console_.documentsAndImages);
	app.get('/console/preview-links', G.hasPermissions({entity: 'preview', level: 'read'}), console_.previewLinks);
	*/
	// console pages with phases -> entity-table with page editing
	app.get('/console/subsite', G.hasPermissions({entity: 'subsite', level: 'read'}), console_.entityTable);
	app.get('/console/article', G.hasPermissions({entity: 'article', level: 'read'}), console_.entityTable);
	app.get('/console/spread', G.hasPermissions({entity: 'spread', level: 'read'}), console_.entityTable);
	app.get('/console/news', G.hasPermissions({entity: 'news', level: 'read'}), console_.entityTable);
	app.get('/console/portfolio', G.hasPermissions({entity: 'portfolio', level: 'read'}), console_.entityTable);
	app.get('/console/service', G.hasPermissions({entity: 'service', level: 'read'}), console_.entityTable);
	app.get('/console/component', G.hasPermissions({entity: 'component', level: 'read'}), console_.entityTable);
	app.get('/console/building', G.hasPermissions({entity: 'building', level: 'read'}), console_.entityTable);
	app.get('/console/location', G.hasPermissions({entity: 'location', level: 'read'}), console_.entityTable);
	app.get('/console/software', G.hasPermissions({entity: 'software', level: 'read'}), console_.entityTable);
	app.get('/console/server', G.hasPermissions({entity: 'server', level: 'read'}), console_.entityTable);
	app.get('/console/package', G.hasPermissions({entity: 'package', level: 'read'}), console_.entityTable);
	app.get('/console/license', G.hasPermissions({entity: 'license', level: 'read'}), console_.entityTable);
	app.get('/console/app', G.hasPermissions({entity: 'myapp', level: 'read'}), console_.entityTable);
	// console pages with phases & modals -> entity-table with modal editing
	app.get('/console/alias', G.hasPermissions({entity: 'alias', level: 'read'}), console_.modalTable);
	app.get('/console/audience', G.hasPermissions({entity: 'audience', level: 'read'}), console_.modalTable);
	app.get('/console/glossary', G.hasPermissions({entity: 'glossary', level: 'read'}), console_.modalTable);
	app.get('/console/tag', G.hasPermissions({entity: 'tag', level: 'read'}), console_.modalTable);
	app.get('/console/action', G.hasPermissions({entity: 'action', level: 'read'}), console_.modalTable);
	//
	// app.get('/console/io', G.hasPermissions('io', 'read'), console_.io);
	// app.get('/console/conversation', G.hasPermissions('conversation', 'read'), console_.conversation);
	// app.get('/console/user-forms', G.hasPermissions('userform', 'read'), console_.userForms);
	// app.get('/console/request-logs', G.nextIfAdmin, console_.renderRequestLogs);
	/**
	 * API
	 */
	app.get('/api/v1/console/alias/table-data/get', G.hasPermissions({entity: 'alias', level: 'read'}), console_.getAliasTableData);
	app.get('/api/v1/console/audience/table-data/get', G.hasPermissions({entity: 'audience', level: 'read'}), console_.getAudienceTableData);
	app.get('/api/v1/console/glossary/table-data/get', G.hasPermissions({entity: 'glossary', level: 'read'}), console_.getGlossaryTableData);
	app.get('/api/v1/console/tag/table-data/get', G.hasPermissions({entity: 'tag', level: 'read'}), console_.getTagTableData);
	app.get('/api/v1/console/action/table-data/get', G.hasPermissions({entity: 'action', level: 'read'}), console_.getActionTableData);
	app.get('/api/v1/entity-table/:entity/data/get/all', console_.getEntityTableData);
	app.get('/api/v1/history-table/data/get/all', console_.getHistoryTableData);
	

	/**
	 * Article
	 */
	// VIEWS
	app.get('/article/:id(\\d+)', G.hasPermissions({entity: 'article', level: null, checkReqParamsID: true}), article.renderById);
	app.get('/article/:id(\\d+)/:title', G.hasPermissions({entity: 'article', level: null, checkReqParamsID: true}), article.render);
	app.get('/console/article/new', G.hasPermissions({entity: 'article', level: 'create'}), article.new);
	app.get('/console/article/edit/:id(\\d+)', G.hasPermissions({entity: 'article', level: 'author', checkReqParamsID: true}), article.edit);
	// API
	app.post('/api/v1/article/create/one', G.hasPermissions({entity: 'article', level: 'create'}), multer(multerConfig).single('fileupload'), G.nextIfValidPhaseForUser('article', 'idArticlePhase'), G.requireReqBodyTitle, G.validateReqBodyGroups('article'), article.createOne);
	app.get('/api/v1/article/get/one/:id(\\d+)', article.getOne);
	app.get('/api/v1/article/get/many', article.getMany);
	app.get('/api/v1/article/get/all', article.getAll);
	app.put('/api/v1/article/update/one/:id(\\d+)', G.hasPermissions({entity: 'article', level: 'author', checkReqParamsID: true}), multer(multerConfig).single('fileupload'), G.nextIfValidPhaseForUser('article', 'idArticlePhase', true), G.requireReqBodyTitle, G.validateReqBodyGroups('article', true), article.updateOne);
	app.get('/api/v1/article/group/get/:id(\\d+)', G.hasPermissions({entity: 'article', level: 'read', checkReqParamsID: true}), article.getGroups);

	/**
	 * Spread
	 */
	// VIEWS
	app.get('/spread/:id(\\d+)', G.hasPermissions({entity: 'spread', level: null, checkReqParamsID: true}), spread.renderById);
	app.get('/spread/:id(\\d+)/:title', G.hasPermissions({entity: 'spread', level: null, checkReqParamsID: true}), spread.render);
	app.get('/console/spread/new', G.hasPermissions({entity: 'spread', level: 'create'}), spread.new);
	app.get('/console/spread/edit/:id(\\d+)', G.hasPermissions({entity: 'spread', level: 'author', checkReqParamsID: true}), spread.edit);
	// API
	app.post('/api/v1/spread/create/one', G.hasPermissions({entity: 'spread', level: 'create'}), multer(multerConfig).single('fileupload'), G.nextIfValidPhaseForUser('spread', 'idSpreadPhase'), G.requireReqBodyTitle, G.validateReqBodyGroups('spread'), spread.createOne);
	app.post('/api/v1/spread/copy/one/:id(\\d+)', G.hasPermissions({entity: 'spread', level: 'author', checkReqParamsID: true}), spread.copyOne);
	app.put('/api/v1/spread/update/one/:id(\\d+)', G.hasPermissions({entity: 'spread', level: 'author', checkReqParamsID: true}), multer(multerConfig).single('fileupload'), G.nextIfValidPhaseForUser('spread', 'idSpreadPhase', true), G.requireReqBodyTitle, G.validateReqBodyGroups('spread', true), spread.updateOne);
	app.get('/api/v1/spread/group/get/:id(\\d+)', G.hasPermissions({entity: 'spread', level: 'read', checkReqParamsID: true}), spread.getGroups);

	/**
	 * News
	 */
	// FEEDS
	app.get('/news/feed/:type', feed.getNewsFeed);
	app.get('/cybernews/feed/:type', feed.getCyberNewsFeed);
	app.get('/news/discord/:type', feed.getNewsPush);
	// VIEWS
	app.get('/news/:id(\\d+)', G.hasPermissions({entity: 'news', level: null, checkReqParamsID: true}), news.renderById);
	app.get('/news/:id(\\d+)/:title', G.hasPermissions({entity: 'news', level: null, checkReqParamsID: true}), news.render);
	app.get('/console/news/new', G.hasPermissions({entity: 'news', level: 'create'}), news.new);
	app.get('/console/news/edit/:id(\\d+)', G.hasPermissions({entity: 'news', level: 'author', checkReqParamsID: true}), news.edit);
	// API
	app.post('/api/v1/news/create/one', G.hasPermissions({entity: 'news', level: 'create'}), multer(multerConfig).single('fileupload'), G.nextIfValidPhaseForUser('news', 'idNewsPhase'), G.requireReqBodyTitle, G.validateReqBodyGroups('news'), news.createOne);
	app.post('/api/v1/news/copy/one/:id(\\d+)', G.hasPermissions({entity: 'news', level: 'author', checkReqParamsID: true}), news.copyOne);
	app.get('/api/v1/news/get/one/:id(\\d+)', news.getOne);
	app.get('/api/v1/news/get/all', news.getAll);
	app.put('/api/v1/news/update/one/:id(\\d+)', G.hasPermissions({entity: 'news', level: 'author', checkReqParamsID: true}), multer(multerConfig).single('fileupload'), G.nextIfValidPhaseForUser('news', 'idNewsPhase', true), G.requireReqBodyTitle, G.validateReqBodyGroups('news', true), news.updateOne);
	app.get('/api/v1/news/group/get/:id(\\d+)', G.hasPermissions({entity: 'news', level: 'read', checkReqParamsID: true}), news.getGroups);


	/**
	 * License
	 */
	// VIEWS
	// API
	app.get('/api/v1/license/get/all', license.getAll);

	/**
	 * Software
	 */
	// VIEWS
	app.get('/software/:id(\\d+)', G.hasPermissions({entity: 'software', level: null, checkReqParamsID: true}), software.renderById);
	app.get('/software/:id(\\d+)/:title', G.hasPermissions({entity: 'software', level: null, checkReqParamsID: true}), software.render);
	app.get('/console/software/new', G.hasPermissions({entity: 'software', level: 'create'}), software.new);
	app.get('/console/software/edit/:id(\\d+)', G.hasPermissions({entity: 'software', level: 'author', checkReqParamsID: true}), software.edit);
	// API
	app.post('/api/v1/software/create/one', G.hasPermissions({entity: 'software', level: 'create'}), G.nextIfValidPhaseForUser('software', 'idSoftwarePhase'), G.requireReqBodyTitle, G.validateReqBodyGroups('software'), software.createOne);
	app.post('/api/v1/software/copy/one/:id(\\d+)', G.hasPermissions({entity: 'software', level: 'author', checkReqParamsID: true}), software.copyOne);
	app.get('/api/v1/software/get/one/:id(\\d+)', software.getOne);
	app.get('/api/v1/software/get/all', software.getAll);
	app.put('/api/v1/software/update/one/:id(\\d+)', G.hasPermissions({entity: 'software', level: 'author', checkReqParamsID: true}), G.nextIfValidPhaseForUser('software', 'idSoftwarePhase'), G.requireReqBodyTitle, G.validateReqBodyGroups('software', true), software.updateOne);
	app.get('/api/v1/software/group/get/:id(\\d+)', G.hasPermissions({entity: 'software', level: 'read', checkReqParamsID: true}), software.getGroups);

	/**
	 * SoftwareOS
	 */
	// VIEWS
	// API
	app.get('/api/v1/softwareos/get/all', softwareOS.getAll);

	/**
	 * SoftwareType
	 */
	// VIEWS
	// API
	app.get('/api/v1/softwaretype/get/all', softwareType.getAll);

	/**
	 * Portfolio
	 */
	// VIEWS
	app.get('/portfolio/:id(\\d+)', G.hasPermissions({entity: 'portfolio', level: null, checkReqParamsID: true}), portfolio.renderById);
	app.get('/portfolio/:id(\\d+)/:title', G.hasPermissions({entity: 'portfolio', level: null, checkReqParamsID: true}), portfolio.render);
	app.get('/console/portfolio/new', G.hasPermissions({entity: 'portfolio', level: 'create'}), portfolio.new);
	app.get('/console/portfolio/edit/:id(\\d+)', G.hasPermissions({entity: 'portfolio', level: 'author'}), portfolio.edit);
	// API
	app.post('/api/v1/portfolio/create/one', G.hasPermissions({entity: 'portfolio', level: 'create'}), G.nextIfValidPhaseForUser('portfolio', 'idCatalogPhase'), G.requireReqBodyTitle, G.validateReqBodyGroups('portfolio'), portfolio.createOne);
	app.get('/api/v1/portfolio/get/one/:id(\\d+)', portfolio.getOne);
	app.get('/api/v1/portfolio/get/all', portfolio.getAll);
	app.put('/api/v1/portfolio/update/one/:id(\\d+)', G.hasPermissions({entity: 'portfolio', level: 'author', checkReqParamsID: true}), G.nextIfValidPhaseForUser('portfolio', 'idCatalogPhase'), G.requireReqBodyTitle, G.validateReqBodyGroups('portfolio', true), portfolio.updateOne);
	app.get('/api/v1/portfolio/group/get/:id(\\d+)', G.hasPermissions({entity: 'portfolio', level: 'read', checkReqParamsID: true}), portfolio.getGroups);

	/**
	 * Service
	 */
	// VIEWS
	app.get('/service/:id(\\d+)', G.hasPermissions({entity: 'service', level: null, checkReqParamsID: true}), service.renderById);
	app.get('/service/:id(\\d+)/:title', G.hasPermissions({entity: 'service', level: null, checkReqParamsID: true}), service.render);
	app.get('/console/service/new', G.hasPermissions({entity: 'service', level: 'create'}), service.new);
	app.get('/console/service/edit/:id(\\d+)', G.hasPermissions({entity: 'service', level: 'author', checkReqParamsID: true}), service.edit);
	// API
	app.post('/api/v1/service/create/one', G.hasPermissions({entity: 'service', level: 'create'}), G.nextIfValidPhaseForUser('service', 'idCatalogPhase'), G.requireReqBodyTitle, G.validateReqBodyGroups('service'), service.createOne);
	app.get('/api/v1/service/get/one/:id(\\d+)', service.getOne);
	app.put('/api/v1/service/update/one/:id(\\d+)', G.hasPermissions({entity: 'service', level: 'author', checkReqParamsID: true}), G.nextIfValidPhaseForUser('service', 'idCatalogPhase'), G.requireReqBodyTitle, G.validateReqBodyGroups('service', true), service.updateOne);
	app.get('/api/v1/service/get/all', service.getAll);
	app.get('/api/v1/service/group/get/:id(\\d+)', G.hasPermissions({entity: 'service', level: 'read', checkReqParamsID: true}), service.getGroups);

	/**
	 * Component
	 */
	// VIEWS
	app.get('/component/:id(\\d+)', G.hasPermissions({entity: 'component', level: null, checkReqParamsID: true}), component.renderById);
	app.get('/component/:id(\\d+)/:title', G.hasPermissions({entity: 'component', level: null, checkReqParamsID: true}), component.render);
	app.get('/console/component/new', G.hasPermissions({entity: 'component', level: 'create'}), component.new);
	app.get('/console/component/edit/:id(\\d+)', G.hasPermissions({entity: 'component', level: 'author', checkReqParamsID: true}), component.edit);
	// API
	app.post('/api/v1/component/create/one', G.hasPermissions({entity: 'component', level: 'create'}), G.nextIfValidPhaseForUser('component', 'idCatalogPhase'), G.requireReqBodyTitle, G.validateReqBodyGroups('component'), component.createOne);
	app.get('/api/v1/component/get/one/:id(\\d+)', component.getOne);
	app.get('/api/v1/component/get/many', component.getMany);
	app.get('/api/v1/component/get/all', component.getAll);
	app.put('/api/v1/component/update/one/:id(\\d+)', G.hasPermissions({entity: 'component', level: 'author', checkReqParamsID: true}), G.nextIfValidPhaseForUser('component', 'idCatalogPhase'), G.requireReqBodyTitle, G.validateReqBodyGroups('component', true), component.updateOne);
	app.get('/api/v1/component/group/get/:id(\\d+)', G.hasPermissions({entity: 'component', level: 'read', checkReqParamsID: true}), component.getGroups);


	/**
	 * Building
	 */
	// VIEWS
	app.get('/building/:id(\\d+)', G.hasPermissions({entity: 'building', level: null, checkReqParamsID: true}), building.renderById);
	app.get('/building/:id(\\d+)/:title', G.hasPermissions({entity: 'building', level: null, checkReqParamsID: true}), building.render);
	app.get('/console/building/new', G.hasPermissions({entity: 'building', level: 'create'}), building.new);
	app.get('/console/building/edit/:id(\\d+)', G.hasPermissions({entity: 'building', level: 'author', checkReqParamsID: true}), building.edit);
	// API
	app.post('/api/v1/building/create/one', G.hasPermissions({entity: 'building', level: 'create'}), G.nextIfValidPhaseForUser('building', 'idSpacePhase'), G.requireReqBodyTitle, G.validateReqBodyGroups('building'), building.createOne);
	app.get('/api/v1/building/get/one/:id(\\d+)', building.getOne);
	app.get('/api/v1/building/get/all', building.getAll);
	app.put('/api/v1/building/update/one/:id(\\d+)', G.hasPermissions({entity: 'building', level: 'author', checkReqParamsID: true }), G.nextIfValidPhaseForUser('building', 'idSpacePhase'), G.requireReqBodyTitle, G.validateReqBodyGroups('building', true), building.updateOne);
	app.get('/api/v1/building/group/get/:id(\\d+)', G.hasPermissions({entity: 'building', level: 'read', checkReqParamsID: true}), building.getGroups);

	/**
	 * Location
	 */
	// VIEWS
	app.get('/location/:id(\\d+)', G.hasPermissions({entity: 'location', level: null, checkReqParamsID: true}), location.renderById);
	app.get('/location/:id(\\d+)/:title', G.hasPermissions({entity: 'location', level: null, checkReqParamsID: true}), location.render);
	app.get('/console/location/new', G.hasPermissions({entity: 'location', level: 'create'}), location.new);
	app.get('/console/location/edit/:id(\\d+)', G.hasPermissions({entity: 'location', level: 'author', checkReqParamsID: true}), location.edit);
	// API
	app.post('/api/v1/location/create/one', G.hasPermissions({entity: 'location', level: 'create'}), multer(multerConfig).single('fileupload'), G.nextIfValidPhaseForUser('location', 'idSpacePhase'), G.requireReqBodyTitle, G.validateReqBodyGroups('location'), location.createOne);
	app.get('/api/v1/location/get/one/:id(\\d+)', location.getOne);
	app.get('/api/v1/location/get/all', location.getAll);
	app.put('/api/v1/location/update/one/:id(\\d+)', G.hasPermissions({entity: 'location', level: 'author', checkReqParamsID: true}), multer(multerConfig).single('fileupload'), G.nextIfValidPhaseForUser('location', 'idSpacePhase'), G.requireReqBodyTitle, G.validateReqBodyGroups('location', true), location.updateOne);
	app.get('/api/v1/location/group/get/:id(\\d+)', G.hasPermissions({entity: 'location', level: 'read', checkReqParamsID: true}), location.getGroups);

	/**
	 * Hours
	 */
	// VIEWS
	// API
	app.post('/api/v1/location/hours/update/one/:id(\\d+)', G.hasPermissions({entity: 'hours', level: 'publish'}), hours.updateOne);

	/**
	 * Package
	 */
	// VIEWS // ! not end-user facing, people need read permissions to see these pages.
	app.get('ckage/:id(\\d+)', G.hasPermissions({entity: 'package', level: 'read', checkReqParamsID: true}), package_.renderById);
	app.get('/package/:id(\\d+)/:title', G.hasPermissions({entity: 'package', level: 'read', checkReqParamsID: true}), package_.render);
	app.get('/console/package/new', G.hasPermissions({entity: 'package', level: 'create'}), package_.new);
	app.get('/console/package/edit/:id(\\d+)', G.hasPermissions({entity: 'package', level: 'author', checkReqParamsID: true}), package_.edit);
	// API
	app.post('/api/v1/package/create/one', G.hasPermissions({entity: 'package', level: 'create'}), G.nextIfValidPhaseForUser('package', 'idPackagePhase'), G.requireReqBodyTitle, package_.createOne);
	app.get('/api/v1/package/get/one/:id(\\d+)', package_.getOne);
	app.get('/api/v1/package/get/all', package_.getAll);
	app.put('/api/v1/package/update/one/:id(\\d+)', G.hasPermissions({entity: 'package', level: 'author', checkReqParamsID: true}), G.nextIfValidPhaseForUser('package', 'idPackagePhase'), G.requireReqBodyTitle, package_.updateOne);

	/**
	 * Server
	 */
	// VIEWS
	app.get('/server/:id(\\d+)', G.hasPermissions({entity: 'server', level: null, checkReqParamsID: true}), server.renderById);
	app.get('/server/:id(\\d+)/:title', G.hasPermissions({entity: 'server', level: null, checkReqParamsID: true}), server.render);
	app.get('/console/server/new', G.hasPermissions({entity: 'server', level: 'create'}), server.new);
	app.get('/console/server/edit/:id(\\d+)', G.hasPermissions({entity: 'server', level: 'author', checkReqParamsID: true}), server.edit);
	// API
	app.post('/api/v1/server/create/one', G.hasPermissions({entity: 'server', level: 'create'}), G.nextIfValidPhaseForUser('server', 'idServerPhase'), G.requireReqBodyTitle, G.validateReqBodyGroups('server'), server.createOne);
	app.get('/api/v1/server/get/one/:id(\\d+)', server.getOne);
	app.get('/api/v1/server/get/all', server.getAll);
	app.put('/api/v1/server/update/one/:id(\\d+)', G.hasPermissions({entity: 'server', level: 'author', checkReqParamsID: true}), G.nextIfValidPhaseForUser('server', 'idServerPhase'), G.requireReqBodyTitle, G.validateReqBodyGroups('server', true), server.updateOne);
	app.get('/api/v1/server/group/get/:id(\\d+)', G.hasPermissions({entity: 'server', level: 'read', checkReqParamsID: true}), server.getGroups);

	/**
	 * Glossary
	 */
	// VIEWS
	// API

	/**
	 * Action
	 */
	// VIEWS
	// API
	app.post('/api/v1/action/create/one', G.hasPermissions({entity: 'action', level: 'create'}), G.nextIfValidPhaseForUser('action', 'idMetadataPhase'), G.requireReqBodyTitle, action.createOne);
	app.put('/api/v1/action/update/one/:id(\\d+)', G.hasPermissions({entity: 'action', level: 'author', checkReqParamsID: true}), G.nextIfValidPhaseForUser('action', 'idMetadataPhase'), G.requireReqBodyTitle, action.updateOne);
	app.get('/api/v1/action/get/all', action.getAll);

	/**
	 * Tag
	 */
	// VIEWS
	app.get('/tag/:id(\\d+)', tag.renderById);
	// API
	app.post('/api/v1/tag/create/one', G.hasPermissions({entity: 'tag', level: 'create'}), G.nextIfValidPhaseForUser('tag', 'idMetadataPhase'), G.requireReqBodyTitle, tag.createOne);
	app.put('/api/v1/tag/update/one/:id(\\d+)', G.hasPermissions({entity: 'tag', level: 'author', checkReqParamsID: true}), G.nextIfValidPhaseForUser('tag', 'idMetadataPhase'), G.requireReqBodyTitle, tag.updateOne);
	app.get('/api/v1/tag/get/all', tag.getAll);

	/**
	 * Audience
	 */
	// VIEWS
	app.get('/audience/:id(\\d+)', audience.renderById);
	// API
	app.post('/api/v1/audience/create/one', G.hasPermissions({entity: 'audience', level: 'create'}), G.nextIfValidPhaseForUser('audience', 'idMetadataPhase'), G.requireReqBodyTitle, audience.createOne);
	app.put('/api/v1/audience/update/one/:id(\\d+)', G.hasPermissions({entity: 'audience', level: 'author', checkReqParamsID: true}), G.nextIfValidPhaseForUser('audience', 'idMetadataPhase'), G.requireReqBodyTitle, audience.updateOne);
	app.get('/api/v1/audience/get/all', audience.getAll);

	/**
	 * Alias
	 */
	// VIEWS
	app.get('/alias/:id(\\d+)', alias.renderById);
	// API
	app.post('/api/v1/alias/create/one', G.hasPermissions({entity: 'alias', level: 'create'}), G.nextIfValidPhaseForUser('alias', 'idMetadataPhase'), G.requireReqBodyTitle, alias.createOne);
	app.put('/api/v1/alias/update/one/:id(\\d+)', G.hasPermissions({entity: 'alias', level: 'author', checkReqParamsID: true}), G.nextIfValidPhaseForUser('alias', 'idMetadataPhase'), G.requireReqBodyTitle, alias.updateOne);
	app.get('/api/v1/alias/get/all', alias.getAll);

	/**
	 * Meta_Home
	 */
	//API
	app.get('/api/v1/meta-home/news/get', news.metaHomeGet);
	app.get('/api/v1/meta-home/featured-content/get', featuredContent.metaHomeGet);
	app.get('/api/v1/meta-home/wpinews/get', compose.WPIRSSGet);
	app.patch('/api/v1/meta-home/featured-content/set-published/:id(\\d+)', G.hasPermissions({entity: 'featuredcontent', level: 'publish', checkReqParamsID: true}), featuredContent.setPublished);
	app.post('/api/v1/meta-home/featured-content/create/one', G.hasPermissions({entity: 'featuredcontent', level: 'create'}), multer(multerConfig).single('img'), G.requireReqBodyTitle, featuredContent.createOne);
	app.put('/api/v1/meta-home/featured-content/update/one/:id(\\d+)', G.hasPermissions({entity: 'featuredcontent', level: 'author', checkReqParamsID: true}), multer(multerConfig).single('img'), G.requireReqBodyTitle, featuredContent.updateOne);
	app.post('/api/v1/meta-home/featured-content/update/order', G.hasPermissions({entity: 'featuredcontent', level: 'author'}), featuredContent.updateOrder);




	/**
	 * FileUpload
	 */
	// VIEW
	app.get('/file-upload/:guid', fileUpload.renderStreamByGUID);
	app.get('/file-upload/:guid/:title', fileUpload.renderStream);
	// API
	app.post('/api/v1/file-upload/create/one', G.hasPermissions({entity: 'fileupload', level: 'create'}), multer(multerConfig).single('fileupload'), fileUpload.create);


	/**
	 * User
	 */
	// VIEWS
	app.get('/Me', user.myDashboard);
	app.get('/Me/My-ITS', user.myDashboard);
	// app.get('/Me/My-TechFlex', user.myTechFlex);
	app.get('/api/v1/instructed/get/all', G.nextIfAdmin, user.myInstructedJSON);
	app.get('/Me/My-Dashboard', user.myDashboard);
	app.get('/Me/My-Account', user.myDashboard);
	app.get('/Me/My-Case', user.myTechFlexCase);
	app.get('/Me/My-NSO', user.myNSO);
	app.get('/Me/My-GSO', user.myGSO);
	app.get('/Me/My-Trainings', user.myTrainings);
	app.get('/Public/My-NSO',ensureAuthenticatedUnless, user.myNSO);
	app.get('/Me/My-Commencement', user.myCommencement);
	app.get('/Me/My-Commencement/Tickets/:id', user.myCommencementTickets);

	app.get('/Me/My-Tickets', user.myTickets);
	app.get('/Me/My-Approvals', user.myApprovals);
	app.get('/Me/My-Assets', user.myAssets);
	app.get('/Me/My-Apps', user.myApps);
	app.get('/Me/My-Canvas', G.requireOauthConsent('canvas'), user.myCanvas);
	app.get('/Me/History', user.history);
	app.get('/Me/Widgets', user.widgets);
	app.get('/Me/Settings', user.settings);
	app.get('/Me/Registrar-Utilities', user.registrar);
	app.get('/Me/My-Delegations', user.myDelegations);
	app.get('/user/:guidPublic', G.hasPermissions({entity: 'user', level: 'read'}), user.renderByGuidPublic);
	app.get('/console/user-permissions/edit/:guidPublic', G.hasPermissions({entity: 'permission', level: 'publish'}), user.edit);
	// API
	app.patch('/api/v1/user/settings/update', G.isAuthenticated, user.updateSettings);
	app.put('/api/v1/user/widgets/update', G.isAuthenticated, user.updateWidgets);
	app.put('/api/v1/user/widgets/sidebar/update', G.isAuthenticated, user.updateSidebarWidgets);
	app.put('/api/v1/user-permissions/update/one/:id(\\d+)', G.hasPermissions({entity: 'permission', level: 'publish'}), user.updatePermissions);
	app.get('/api/v1/user/get/all', G.nextIfAdmin, user.getAll);

	app.get('/Commencement/Ticket/:id', user.GetCommencementTicketByID); //special exception
	app.get('/Commencement/Manager', G.ensureAuthenticated, user.GetCommencementManager);
	app.get('/CovidTests/Manager', G.ensureAuthenticated, user.GetCovidTestManager);
	app.get('/CM', function(req, res){
		res.redirect('/Commencement/Manager');
	});
	app.get('/CTM', function(req, res){
		res.redirect('/CovidTests/Manager');
	});
	/**
	 * new User
	 */
	// VIEWS
	app.get('/Me/My-TechFlex', user.new_myTechFlex);


	/**
	 * User History
	 */
	app.get('/api/v1/me/history/get/all', G.isAuthenticated, user.getAllHistory);
	app.delete('/api/v1/me/history/delete/all', G.isAuthenticated, user.clearHistory);

	/**
	 * User -> MyApps
	 */
	// VIEWS
	app.get('/app/:id(\\d+)', G.hasPermissions({entity: 'myapp', level: null, checkReqParamsID: true}), myapp.renderById);
	app.get('/app/:id(\\d+)/:title', G.hasPermissions({entity: 'myapp', level: null, checkReqParamsID: true}), myapp.render);
	app.get('/console/app/new', G.hasPermissions({entity: 'myapp', level: 'create'}), myapp.new);
	app.get('/console/app/edit/:id(\\d+)', G.hasPermissions({entity: 'myapp', level: 'author', checkReqParamsID: true}), myapp.edit);
	// API
	// me
	app.get('/api/v1/me/app/get/installed', G.isAuthenticated, myapp.getMeInstalled);
	app.get('/api/v1/me/app/get/favorites', G.isAuthenticated, myapp.getMeFavorites);
	app.get('/api/v1/me/app/get/available', G.isAuthenticated, myapp.getMeAvailable);
	app.patch('/api/v1/me/app/set-favorite/one', G.isAuthenticated, myapp.setIsFavorite);
	app.post('/api/v1/me/app/set-installed/one', G.isAuthenticated, myapp.setIsInstalled);
	// app
	app.post('/api/v1/app/create/one', G.hasPermissions({entity: 'myapp', level: 'create'}), multer(multerConfig).single('fileupload'), G.nextIfValidPhaseForUser('myapp', 'idMyAppPhase'), G.requireReqBodyTitle, myapp.createOne);
	app.get('/api/v1/app/get/all', myapp.getAll);
	app.put('/api/v1/app/update/one/:id(\\d+)', G.hasPermissions({entity: 'myapp', level: 'author', checkReqParamsID: true}), multer(multerConfig).single('fileupload'), G.nextIfValidPhaseForUser('myapp', 'idMyAppPhase'), G.requireReqBodyTitle, myapp.updateOne);

	/**
	 * Groups
	 */
	// VIEWS
	app.get('/group/:id(\\d+)', G.hasPermissions({entity: 'group', checkReqParamsID: true, level: 'read'}), group.render);
	app.get('/console/group/new', G.nextIfAdmin, group.new);
	app.get('/console/group/edit/:id(\\d+)', G.nextIfAdmin, group.edit);
	// API
	app.post('/api/v1/group/create/one', G.nextIfAdmin, group.createOne);
	app.get('/api/v1/group/get/all', G.hasPermissions({entity: 'console'}), group.getAll);
	app.get('/api/v1/group/get', G.hasPermissions({entity: 'console'}), group.getAllWithContext); // ?entity=entity
	app.put('/api/v1/group/update/one/:id(\\d+)', G.nextIfAdmin, group.updateOne);
	app.get('/api/v1/me/group/get', G.isAuthenticated, group.getMyGroups); // ?entity=entity&level=level (optionally &isdefault=true)
	app.get('/api/v1/me/group/get/all', G.isAuthenticated, group.getAllMyGroups);

	/**
	 * SubSites & Gizmos
	 */
	// VIEWS
	app.get('/subsite/:id(\\d+)/:title?', G.hasPermissions({entity: 'subsite', level: null, checkReqParamsID: true}), subsite.renderById);
	app.get('/s/:id(\\d+)', G.hasPermissions({entity: 'subsite', level: null, checkReqParamsID: true}), subsite.renderById);
	app.get('/s/:id(\\d+)/:title', G.hasPermissions({entity: 'subsite', level: null, checkReqParamsID: true}), subsite.render);
	app.get('/console/subsite/new', G.hasPermissions({entity: 'subsite', level: 'create'}), subsite.new);
	app.get('/console/subsite/edit/:id(\\d+)', G.hasPermissions({entity: 'subsite', level: 'author', checkReqParamsID: true}), subsite.edit);
	// API
	app.post('/api/v1/subsite/create/one', G.hasPermissions({entity: 'subsite', level: 'create'}), multer(multerConfig).single('fileupload'), G.nextIfValidPhaseForUser('subsite', 'idSubSitePhase'), G.requireReqBodyTitle, G.validateReqBodyGroups('server'), subsite.createOne);
	app.get('/api/v1/subsite/get/one/:id(\\d+)', subsite.getOne);
	app.get('/api/v1/subsite/get/all', subsite.getAll);
	app.get('/api/v1/subsite/get/featured', subsite.getAllFeatured);
	app.get('/api/v1/subsite/get/public', subsite.getAllPublic);
	app.put('/api/v1/subsite/update/one/:id(\\d+)', G.hasPermissions({entity: 'subsite', level: 'author', checkReqParamsID: true}), multer(multerConfig).single('fileupload'), G.nextIfValidPhaseForUser('subsite', 'idSubSitePhase'), G.requireReqBodyTitle, G.validateReqBodyGroups('subsite', true), subsite.updateOne);
	app.get('/api/v1/subsite/group/get/:id(\\d+)', G.hasPermissions({entity: 'subsite', level: 'read', checkReqParamsID: true}), subsite.getGroups);
	app.post('/api/v1/subsite/:id(\\d+)/gizmo/create/one', G.hasPermissions({entity: 'subsite', level: 'author', checkReqParamsID: true}), gizmo.createOne);
	app.put('/api/v1/subsite/:id(\\d+)/gizmo/update/one', G.hasPermissions({entity: 'subsite', level: 'author', checkReqParamsID: true}), gizmo.updateOne);
	app.delete('/api/v1/subsite/:id(\\d+)/gizmo/delete/one', G.hasPermissions({entity: 'subsite', level: 'author', checkReqParamsID: true}), gizmo.deleteOne);
	app.get('/api/v1/gizmo/data/get/:id(\\d+)', gizmo.getData);
	app.get('/api/v1/subsite/:id(\\d+)/featured-content/get', subsite.getFeaturedContent);
	app.post('/api/v1/subsite/:id(\\d+)/featured-content/create/one', G.hasPermissions({entity: 'subsite', level: 'author', checkReqParamsID: true}), multer(multerConfig).single('img'), G.requireReqBodyTitle, subsite.createFeaturedContent);
	app.put('/api/v1/subsite/:id(\\d+)/featured-content/update/one', G.hasPermissions({entity: 'subsite', level: 'author', checkReqParamsID: true}), multer(multerConfig).single('img'), G.requireReqBodyTitle, subsite.updateFeaturedContent);
	app.patch('/api/v1/subsite/:id(\\d+)/featured-content/set-published', G.hasPermissions({entity: 'subsite', level: 'author', checkReqParamsID: true}), subsite.setIsPublishedFeaturedContent);

	/**
	 * Banner
	 */
	app.use(require('./banner/index.js'));

	/**
	 * Cherwell
	 */
	app.use(require('./cherwell/index.js'));

		/**
	 * Workday
	 */
	app.use(require('./workday/index.js'));
	/**
	 * Get Inclusive
	 */
	app.use(require('./getInclusive/index.js'));



	/**
	 * Session
	 */
	app.patch('/api/v1/session/update', session.update);

	/**
	 * Local login
	 */
	app.get('/login/local', (req, res, next) => {
		res.render('user/login-local.ejs');
	});
	app.post('/api/v1/user/login/local', passport.authenticate('local'), (req, res, next) => {
		res.redirect('/');
	});

	/**
	 * SAML
	 */
	app.get('/login', (req, res, next) => {
		req.session['saml-referrer'] = req.session['saml-referrer'] || sanitizeHTML(typeof req.get('Referrer') !== 'undefined' && req.get('Referrer') !== 'undefined' ? req.get('Referrer') : '/', config.sanitizeHTML.allowNone);
		return res.redirect('/api/v1/user/login/sso');
	});

	app.get('/api/v1/user/login/sso', (req, res, next) => {
		req.session['saml-referrer'] = req.session['saml-referrer'] || sanitizeHTML(typeof req.get('Referrer') !== 'undefined' && req.get('Referrer') !== 'undefined' ? req.get('Referrer') : '/', config.sanitizeHTML.allowNone);
		return next();
	}, passport.authenticate('saml'));

	app.post('/api/v1/saml/login/callback', passport.authenticate('saml'), (req, res, next) => {
		const redirectLocation = req.session['saml-referrer'];
		delete req.session['saml-referrer'];
		req.session.save(err => {
			if (err) {
				return next(err);
			}
			if (typeof redirectLocation !== 'undefined' && redirectLocation !== 'undefined') {
				return res.redirect(redirectLocation);
			} else {
				return res.redirect('/');
			}
		});
	});


	app.get('/logout', (req, res, next) => {
		return res.redirect('/api/v1/user/logout/sso');
	});

	app.get('/api/v1/user/logout/sso', (req, res, next) => {
		req.user.nameID = req.session.userAttributes.nameID;
		req.user.nameIDFormat = req.session.userAttributes.nameIDFormat;
		passport_.samlStrategy.logout(req, (err, request) => {
			req.logout();
			req.session.destroy();
			if (err) {
				return next(err);
			} else {
				return res.redirect(request);
			}
		});
	});

	app.get('/api/v1/saml/logout/callback', (req, res, next) => {
		return res.redirect('/');
	});

	/**
	 * Oauth
	 */
	app.use(oauth_router);


	/**
	 * @deprecated This is a sub module for adapting legacy database objects to the new database.
	 */
	if (config.adapterDatabase.enabled === true) {
		app.use(require('./routes_legacy_adapter.js'));
	}

	/**
	 * more other stuff
	 */
	// app.get('/robots.txt', compose.robotsTXT);
	app.get('/sitemap', compose.sitemapXML);

	/**
	 * override
	 * https://github.com/pawelczak/EasyAutocomplete/issues/206
	 */
	app.get('/easy-autocomplete/easy-autocomplete.min.css.map', (req, res) => res.status(204).send());

	app.use(require('./errorPages_server.js'));



	// ! For testing only for admins
	app.get('/api/v0/user-info', G.nextIfAdmin, (req, res) => {
		return res.json({
			user: req.user,
			session: req.session
		});
	});
	

	if (process.env.NODE_ENV === 'development') {
		app.get('/conversation', G.ensureAuthenticated, (req, res, next) => {
			res.render('pages/conversation.ejs', {
				userAttributes: req.session.userAttributes
			});
			return null;
		});

		app.post('/api/v0/convo/submit', G.isAuthenticated, (req, res, next) => {
			return res.json(
				{
					success: true
				}
			);
		});

		app.get('/api/v0/what-is-my-hostname', (req, res, next) => {
			const dns = require('dns');
			dns.reverse(req.ip, (err, hostnames) => {
				if (err) {
					next(err);
					return null;
				} else {
					const wpiDomain = /.*\.wpi\.edu/;
					let hostname = hostnames[0];
					if (wpiDomain.test(hostname)) {
						res.json({success: true, ip: req.ip, hostname: hostname.split('.')[0]});
					} else {
						res.json({success: false, ip: req.ip, reason: 'We could not guess your hostname'});
					}
					return null;
				}
			});
		});

		app.get('/rachel-look-here-for-changes', G.nextIfAdmin, (req, res, next) => {
			res.sendFile(path.join(__dirname, '../CHANGELOG.md'));
			return null;
		});

		app.get('/api/v0/tour', G.nextIfAdmin, (req, res, next) => {
			const User = require('../models/User.js');
			User.findById(req.user.id).then(async user => {
				res.json({
					user,
					tour: await user.getUserSiteTour()
				});
				return null;
			}).catch(err => {
				next(err);
				return null;
			});
		});
		app.get('/robots.txt', compose.nobotsTXT);

		// app.get('/chatbot', G.nextIfAdmin, Intro.render);
	}else if (process.env.NODE_ENV === 'staging') {
		app.get('/robots.txt', compose.nobotsTXT);
	}else{
		app.get('/robots.txt', compose.robotsTXT);
	}

	/**
	 * catch all 404
	 */
	app.all('*', (req, res, next) => {
		logger.err(`404 at ${req.url}`);
		const error = new Error('Catch all 404');
		error.status = 404;
		return next(error);
	});
};