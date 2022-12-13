const G = require('./_global_logic.js');
const logger = require('./logger.js');
const path = require('path');
const sequelize = require('sequelize');
const Article = require('../models/Article.js');
const ArticlePhase = require('../models/ArticlePhase.js');
const Spread = require('../models/Spread.js');
const SpreadPhase = require('../models/SpreadPhase.js');
const Service = require('../models/Service.js');
const CatalogPhase = require('../models/CatalogPhase.js');
const Component = require('../models/Component.js');
const Alias = require('../models/Alias.js');
const Tag = require('../models/Tag.js');
const News = require('../models/News.js');
const NewsType = require('../models/NewsType.js');
const NewsPhase = require('../models/NewsPhase.js');
const Portfolio = require('../models/Portfolio.js');
const Software = require('../models/Software.js');
const SoftwarePhase = require('../models/SoftwarePhase.js');
const SoftwareOS = require('../models/SoftwareOS.js');
const LocationType = require('../models/LocationType.js');
const Location = require('../models/Location.js');
const Building = require('../models/Building.js');
const UserHasMyApp = require('../models/UserHasMyApp.js');
const MyApp = require('../models/MyApp.js');
const MyAppPhase = require('../models/MyAppPhase.js');
const FileUpload = require('../models/FileUpload.js');
const SubSite = require('../models/SubSite.js');
const SubSitePhase = require('../models/SubSitePhase.js');
const sitemap_ = require('./modules/Sitemap.js');
const { XMLParser} = require("fast-xml-parser");
const sitemap = new sitemap_(
	{
		hostname: process.env.SERVER_ROOT,
		cacheTime: 1000 * 60 * 15 // 15 minutes in ms
	}
);
const url = require('url');
const BannerAPI = require('./banner/BannerAPI.js');
const bannerAPI = new BannerAPI();
const CherwellAPI = require('./cherwell/Cherwell.js');
const { cherwell } = require('../config.js');
const cherwellAPI = new CherwellAPI();
const WorkdayAPI = require('./workday/WorkdayAPI.js');
const workdayAPI = new WorkdayAPI();
const { clearingHouse } = require('../config.js');
const { tel8x8 } = require('../config.js');
const requestPromise = require('request-promise-native');

module.exports = {
	index: async(req, res, next) => {
		res.locals.tabs['index'] = 'active';
		let alert;
		if (typeof req.session !== 'undefined' && !req.session.alertClosed) {
			News.findOne(
				{
					group: ['news.id'],
					subQuery: false,
					where: {
						isHome: true,
						showAlert: true
					},
					include: [
						{
							model: NewsType,
							required: true
						},
						{
							model: NewsPhase,
							required: true,
							where: {
								title: 'publish'
							},
						}
					],
					order: [
						[sequelize.col('news.updatedAt'), 'DESC']
					]
				}
			).then(async news => {
				if (news) {
					alert = {
						newsID: news.id,
						title: news.title,
						content: news.descriptionShort,
						type: {
							title: news.newsType.title,
							icon: news.newsType.icon,
							color: news.newsType.color
						}
					};
				}
			}).catch(err => {
				next(err);
				return null;
			});
		}
		let userApps = [];
		let quickApps = [];
		if (req.isAuthenticated()) {
					// try including user apps
			try {
				userApps = await UserHasMyApp.findAll(
					{
						where: {
							idUser: req.user.id,
							isFavorite: true
						},
						include: [
							{
								model: MyApp,
								required: true,
								include: [
									{
										model: MyAppPhase,
										required: true,
										where: {
											title: 'publish'
										}
									},
									{
										model: FileUpload,
										as: 'image'
									}
								]
							}
						]
					}
				);
			} catch (err2) {
				next(err2);
				return null;
			}
			userApps = userApps.map(u => {
				let imageSrc = u.myApp.image ? u.myApp.image.getURL() : null;
				u = u.toJSON();
				u.myApp.imageSrc = imageSrc;
				return u.myApp;
			});

			if (!userApps.length) {
				// otherwise try including default apps
				try {
					quickApps = await MyApp.findAll(
						{
							where: {
								isQuick: true
							},
							include: [
								{
									model: MyAppPhase,
									required: true,
									where: {
										title: 'publish'
									}
								},
								{
									model: FileUpload,
									as: 'image'
								}
							]
						}
					);
					quickApps = quickApps.map(a => {
						let imageSrc = a.image ? a.image.getURL() : null;
						a = a.toJSON();
						a.imageSrc = imageSrc;
						return a;
					});
				} catch (err2) {
					next(err2);
					return null;
				}
			}
		}
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
					},
					{
						model: FileUpload,
						as: 'image'
					}
				]
			}
		).then(subsites => {
			const subsites_ = [];
			for (let subsite of subsites) {
				let imageSrc = subsite.image ? subsite.image.getURL() : null;
				subsite = subsite.toJSON();
				if (subsite.image) {
					let site = {
						...subsite
					};
					site.image.src = imageSrc;
					subsites_.push(site);
				} else {
					subsites_.push(subsite);
				}
			}
			res.render('index.ejs', {
				alert,
				userApps,
				quickApps,
				subsites: subsites_
			});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
		
		return null;
	},
	help: async(req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/Help') {
			return res.redirect(url.format({
				pathname: '/Help',
				query: req.query
			}));
		}
		const serviceDesk = await Location.findById(110, false, false);
		const serviceDeskHours = await serviceDesk.getOpenTimesFromDay();
		const serviceDeskCallCenter = await Location.findById(111, false, false);
		const serviceDeskCallCenterHours = await serviceDeskCallCenter.getOpenTimesFromDay();
		res.render('pages/help.ejs',
			{
				serviceDeskHours,
				serviceDeskCallCenterHours
			}
		);
		return null;
	},
	WPIRSSGet: async(req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		return new Promise((resolve, reject) => {
			
			requestPromise(
				{
					method: 'GET',
					url: 'https://www.wpi.edu/news/latest/rss',
					headers: {
						'Cache-Control': 'no-cache'
					},
					followAllRedirects: true,
				}
			).then(body => {
				const options = {
					ignoreAttributes: false,
				};
				const parser = new XMLParser(options);
				let jObj = parser.parse(body);

				resolve(res.json(jObj))
			}
			).catch(err => reject(err));
		});
	},
	
	community: async(req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/Community') {
			return res.redirect(url.format({
				pathname: '/Community',
				query: req.query
			}));
		}

		res.render('pages/community.ejs');
		return null;
	},
	renderHelpForm: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/Request') {
			return res.redirect(url.format({
				pathname: '/Request',
				query: req.query
			}));
		}
		res.render('forms/help/view.ejs');
		return null;
	},
	renderHubBirthday: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/Hub-Birthday') {
			return res.redirect(url.format({
				pathname: '/Hub-Birthday',
				query: req.query
			}));
		}
		res.render('pages/hub-birthday.ejs');
		return null;
	},
	renderLaptopRec: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Laptop-Recommendation') {
			return res.redirect(url.format({
				pathname: '/io/Laptop-Recommendation',
				query: req.query
			}));
		}
		res.render('pages/laptop-rec.ejs');
		return null;
	},
	authNSC: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/NSC') {
			return res.redirect(url.format({
				pathname: '/io/NSC',
				query: req.query
			}));
		}
		let requestURL =  clearingHouse.requestURL
		let referral_url = `${process.env.SERVER_ROOT}/io/NSC`
		let username = clearingHouse.username
		let password = clearingHouse.password
		// let pathtype = 'PATHTYPE';

		return new Promise((resolve, reject) => {
			requestPromise(
				{
					method: 'POST',
					url: requestURL,
					form: {
						user_id: username,
						password: password,
						id: req.user.employeeID
					},
					headers: {
						'Cache-Control': 'no-cache'
					},
					followAllRedirects: true,
					headers: {
						'User-Agent': '',
						'Referer': referral_url,
					}
					

				}
			).then(body => resolve(res.render('pages/nsc.ejs', {body}))).catch(err => reject(err));
		});
	},
	renderLever: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/Lever') {
			return res.redirect(url.format({
				pathname: '/Lever',
				query: req.query
			}));
		}

		res.render('pages/lever.ejs');
		return null;
	},
	renderAmogus: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/Amogus') {
			return res.redirect(url.format({
				pathname: '/Amogus',
				query: req.query
			}));
		}

		res.render('pages/amogus.ejs');
		return null;
	},
	renderStaffCouncil: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/Staff-Council') {
			return res.redirect(url.format({
				pathname: '/Staff-Council',
				query: req.query
			}));
		}

		res.render('pages/staffcouncil/staffcouncil.ejs');
		return null;
	},
	
	renderSIE: async (req, res, next) => {

		
		const subSite = req.params.subsite;
		const goalID = req.params.id;
		var departments;
		var goals;
		var action;

		goals = await cherwellAPI.getSIEGoals()
		if(subSite == "Goals"){
			departments = await cherwellAPI.getSIEDept()
		}else if(subSite == "Action"){
			if(goalID != null && goalID != ""){
				action = await cherwellAPI.getASIEGoal(goalID)
			}else{
				action = null;
			}
		}else{
			departments = null;
			action = null;
		}
		res.render('pages/SIE/SIE.ejs', 
		{
			subSite,
			goalID,
			departments,
			action,
			goals
		});
		return null;
	},
	renderScreenPop: async (req, res, next) => {

		if(req.body && req.query.token){
			if(req.query.token == tel8x8.screenPopToken){
				const CallBody = req.body;
				var CallRecord = null;
				var ExistingInteraction = false

				if(CallBody.InteractionGuid && CallBody.InteractionGuid != null && CallBody.InteractionGuid != 'undefined' && CallBody.InteractionGuid != ''){

					ExistingInteraction = await cherwellAPI.getCallLogByInteractionGUID(CallBody.InteractionGuid)
					CallRecord = await cherwellAPI.createOrUpdateCall(CallBody, ExistingInteraction.length >=1 ? CallBody.InteractionGuid : null)
				}
				
				
				res.render('pages/8x8/ScreenPop.ejs', 
				{
					CallBody,
					CallRecord,
					ExistingInteraction
				});
				return null;
			}else{
				next(403);
				return null;
			}
		}else{
			next(400);
			return null;
		}
	},
	renderFeedbackForm: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/Feedback') {
			return res.redirect(url.format({
				pathname: '/Feedback',
				query: req.query
			}));
		}
		res.render('forms/feedback/view.ejs');
		return null;
	},
	renderCovid19Form: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Lab-Reopening') {
			return res.redirect(url.format({
				pathname: '/io/Lab-Reopening',
				query: req.query
			}));
		}
		res.render('forms/covid19/view.ejs');
		return null;
	},
	renderCovid19AddForm: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Lab-Reopening-Addition') {
			return res.redirect(url.format({
				pathname: '/io/Lab-Reopening-Addition',
				query: req.query
			}));
		}
		res.render('forms/covid19-update/view.ejs');
		return null;
	},
	renderCovid19HumanSubjectsForm: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Lab-Reopening-Human-Subjects') {
			return res.redirect(url.format({
				pathname: '/io/Lab-Reopening-Human-Subjects',
				query: req.query
			}));
		}
		res.render('forms/covid19-update-human/view.ejs');
		return null;
	},
	renderCovid19ResearchContForm: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Research-and-Project-Continuity') {
			return res.redirect(url.format({
				pathname: '/io/Research-and-Project-Continuity',
				query: req.query
			}));
		}
		res.render('forms/covid19-research-cont/view.ejs');
		return null;
	},
	renderCovid19ExternalForm: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Lab-Reopening-External-Partner') {
			return res.redirect(url.format({
				pathname: '/io/Lab-Reopening-External-Partner',
				query: req.query
			}));
		}
		res.render('forms/covid19-update-external/view.ejs');
		return null;
	},
	renderCovid19FormCampus: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Department-Reopening') {
			return res.redirect(url.format({
				pathname: '/io/Department-Reopening',
				query: req.query
			}));
		}
		res.render('forms/departmentReopening/view.ejs');
		return null;
	},
	renderPassFailForm: async(req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Grade-Format-Request') {
			return res.redirect(url.format({
				pathname: '/io/Grade-Format-Request',
				query: req.query
			}));
		}
		let title = 'The WPI Hub';
		try {
			title = `${res.locals.title.split(' | ')[0]} | Grade Format Request`;
		} catch (titleErr) {
			logger.err(titleErr); // handle silently
		}
		try {
			var userID = req.user.employeeID;
			let customer =  await cherwellAPI.getCustomerByID(userID);
			customer = JSON.parse(customer).businessObjects[0];
			let courses = await workdayAPI.getCourseEnrollmentForUser(userID,'2022_Summer_Full_Semester_202203-E','JSON');
			courses = JSON.parse(courses).Report_Entry;
			courses = courses.filter(item => item.CF_LRV_Course_Registration_Status == "Completed" 
			&& (item.Offering_Period == "2022 Summer Session II" || item.Offering_Period == "2022 Summer Semester")
			&& !item.Course_Definition.includes('IQP') 
			&& !item.Course_Definition.includes('MQP') 
			&& !item.Course_Definition.includes('PQP')
			&& !item.Course_Section_Definition.includes('DX')
			&& !item.Course_Section_Definition.includes('DD')
			)
			
			res.render('forms/passfail/view.ejs', {
				courses,
				customer,
				title
			});
			return null;
		} catch (err) {
			logger.err(err);
			res.render('forms/passfail/view.ejs',
				{
					title
				}
			);
			return null;
		}
	},
	renderAddDrop: async(req, res, next) => {
		const currentAcademicPeriod = '2022_Fall_Full_Semester_202301-1';
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Add-Drop') {
			return res.redirect(url.format({
				pathname: '/io/Add-Drop',
				query: req.query
			}));
		}
		let title = 'The WPI Hub';
		try {
			title = `${res.locals.title.split(' | ')[0]} | Add Drop Form`;
		} catch (titleErr) {
			logger.err(titleErr); // handle silently
		}
		try {
			let UserEnrollments = await workdayAPI.getCourseEnrollmentForUser(req.user.employeeID,currentAcademicPeriod,'json');
			
			UserEnrollments = JSON.parse(UserEnrollments).Report_Entry;
			UserEnrollments = UserEnrollments.filter(item => item.CF_LRV_Course_Registration_Status == "Registered")
			UserEnrollments = UserEnrollments.filter(item => item.Offering_Period == "2022 Fall B Term")
			res.render('forms/adddrop/view.ejs', {
				UserEnrollments,
				title,
				query: req.query
			});
			return null;
		} catch (err) {
			let UserEnrollments = null;
			res.render('forms/adddrop/view.ejs', {
				UserEnrollments,
				title,
				query: req.query
			});
			return null;
		}
	},
	renderETerm2022: async(req, res, next) => {
		const currentAcademicPeriod = '2022_Summer_Full_Semester_202203-E';
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Summer') {
			return res.redirect(url.format({
				pathname: '/io/Summer',
				query: req.query
			}));
		}
		let title = 'The WPI Hub';
		try {
			title = `${res.locals.title.split(' | ')[0]} | Summer 2022 at WPI`;
		} catch (titleErr) {
			logger.err(titleErr); // handle silently
		}
		try {
			// let courses = await workdayAPI.getCourse(null,null,'2022_Summer_Full_Semester_202203-E',0,'json');
			// courses = JSON.parse(courses).Report_Entry;
			let courses2 = await workdayAPI.getCourse(null,null,'2022_Summer_Session_I_202203-E1',0,'json');
			courses2 = JSON.parse(courses2).Report_Entry;
			let courses3 = await workdayAPI.getCourse(null,null,'2022_Summer_Session_II_202203-E2',0,'json');
			courses3 = JSON.parse(courses3).Report_Entry;
			courses = [...courses2,...courses3]
			res.render('pages/summer2022.ejs', {
				courses,
				title,
				query: req.query
			});
			return null;
		} catch (err) {
			next(err);
			return null;
		}

		
	},
	renderStudentIntent: async(req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Student-Intent') {
			return res.redirect(url.format({
				pathname: '/io/Student-Intent',
				query: req.query
			}));
		}
		let title = 'The WPI Hub';
		try {
			title = `${res.locals.title.split(' | ')[0]} | Student Intent Fall 2020`;
		} catch (titleErr) {
			logger.err(titleErr); // handle silently
		}
		try {
			const { rows: BannerUser } = await bannerAPI.getBannerUserByID(req.user.employeeID);

			res.render('forms/student-intent/view.ejs', {
				BannerUser,
				title,
				query : req.query
			});
			return null;
		} catch (err) {
			logger.err(err);
			res.render('forms/student-intent/view.ejs',
				{
					title
				}
			);
			return null;
		}
	},
	renderNSOForm: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/NSO') {
			return res.redirect(url.format({
				pathname: '/io/NSO',
				query: req.query
			}));
		}
		res.render('forms/nso/view.ejs');
		return null;
	},
	renderTestChangeForm: async(req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Change-Test-Day') {
			return res.redirect(url.format({
				pathname: '/io/Change-Test-Day',
				query: req.query
			}));
		}
		let customer =  await cherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		let intent = await cherwellAPI.getRelatedBusinessObjects('93405caa107c376a2bd15c4c8885a900be316f3a72', customer.busObRecId, '9466569ae4c5f4a00d39ec4273aab1d5fd8ab1ff23')
		intent = JSON.parse(intent).relatedBusinessObjects;

		res.render('forms/Change-Test-Day/view.ejs',{
			intent
		});
		return null;
	},
	renderArrivalChangeForm: async(req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Change-Arrival') {
			return res.redirect(url.format({
				pathname: '/io/Change-Arrival',
				query: req.query
			}));
		}
		let customer =  await cherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		let intent = await cherwellAPI.getRelatedBusinessObjects('93405caa107c376a2bd15c4c8885a900be316f3a72', customer.busObRecId, '9466569ae4c5f4a00d39ec4273aab1d5fd8ab1ff23')
		intent = JSON.parse(intent).relatedBusinessObjects;

		res.render('forms/Change-pre-arrival-Day/view.ejs',{
			intent
		});
		return null;
	},
	renderOnboardingChangeForm: async(req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Change-Onboarding') {
			return res.redirect(url.format({
				pathname: '/io/Change-Onboarding',
				query: req.query
			}));
		}
		let customer =  await cherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		let intent = await cherwellAPI.getRelatedBusinessObjects('93405caa107c376a2bd15c4c8885a900be316f3a72', customer.busObRecId, '9466569ae4c5f4a00d39ec4273aab1d5fd8ab1ff23')
		intent = JSON.parse(intent).relatedBusinessObjects;

		res.render('forms/Change-Onboarding-Day/view.ejs',{
			intent
		});
		return null;
	},
	renderVisitorForm: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Visitor') {
			return res.redirect(url.format({
				pathname: '/io/Visitor',
				query: req.query
			}));
		}
		res.render('forms/Covid-Visitors/view.ejs');
		return null;
	},
	renderVendorForm: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Vendor') {
			return res.redirect(url.format({
				pathname: '/io/Vendor',
				query: req.query
			}));
		}
		res.render('forms/Covid-Vendors/view.ejs');
		return null;
	},
	renderHumanSubjectsForm: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Human-Subjects') {
			return res.redirect(url.format({
				pathname: '/io/Human-Subjects',
				query: req.query
			}));
		}
		res.render('forms/Covid-Human/view.ejs');
		return null;
	},
	renderExternalPartnerForm: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/External-Partner') {
			return res.redirect(url.format({
				pathname: '/io/External-Partner',
				query: req.query
			}));
		}
		res.render('forms/Covid-External/view.ejs');
		return null;
	},
	renderDeptLogForm: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Department-Log') {
			return res.redirect(url.format({
				pathname: '/io/Department-Log',
				query: req.query
			}));
		}
		res.render('forms/deptLog/view.ejs');
		return null;
	},
	renderCampusVisitor: async (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Campus-Visitor') {
			return res.redirect(url.format({
				pathname: '/io/Campus-Visitor',
				query: req.query
			}));
		}
		const departments = await cherwellAPI.getApprovalDept()
		res.render('forms/covid-campus-visitor/view.ejs',{
			departments
		});
		return null;
	},

	renderIntentToGraduate: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Intent-To-Graduate') {
			return res.redirect(url.format({
				pathname: '/io/Intent-To-Graduate',
				query: req.query
			}));
		}
		res.render('forms/intentToGrad/view.ejs');
		return null;
	},
	renderStudentConcern: (req, res, next) => {

		res.render('forms/student-flag/view.ejs',{
			passThrough:{
				studentID: req.params.STUDENTID || "",
				studentName: req.params.STUDENTNAME || "",
				crn: req.params.CRN || "",
				crTitle: req.params.CRTITLE || ""
			}
		});
		return null;
	},
	renderWorkdayRequest: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Workday-Request') {
			return res.redirect(url.format({
				pathname: '/io/Workday-Request',
				query: req.query
			}));
		}
		res.render('forms/workday-request/view.ejs');
		return null;
	},
	renderSoftwareRequest: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Software-Request') {
			return res.redirect(url.format({
				pathname: '/io/Software-Request',
				query: req.query
			}));
		}
		res.render('forms/software-request/view.ejs');
		return null;
	},
	renderBursarTitleIV: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/TitleIV/') {
			return res.redirect(url.format({
				pathname: '/io/TitleIV/',
				query: req.query
			}));
		}
		res.render('forms/bursar/TitleIV/view.ejs');
		return null;
	},
	renderBursarGradHealthFee: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Graduate-Health-Fee/') {
			return res.redirect(url.format({
				pathname: '/io/Graduate-Health-Fee/',
				query: req.query
			}));
		}
		res.render('forms/bursar/Graduate-Health-Fee/view.ejs');
		return null;
	},
	renderBursarMealPlanChange: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Meal-Plan-Change/') {
			return res.redirect(url.format({
				pathname: '/io/Meal-Plan-Change/',
				query: req.query
			}));
		}
		res.render('forms/bursar/Meal-Plan-Change/view.ejs');
		return null;
	},
	renderBursarMoveCredit: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Move-Credit-Funds/') {
			return res.redirect(url.format({
				pathname: '/io/Move-Credit-Funds/',
				query: req.query
			}));
		}
		res.render('forms/bursar/Move-Credit-Funds/view.ejs');
		return null;
	},
	renderBursarParentPlusLoan: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Parent-Plus-Loan-Authorization/') {
			return res.redirect(url.format({
				pathname: '/io/Parent-Plus-Loan-Authorization/',
				query: req.query
			}));
		}
		res.render('forms/bursar/Parent-Plus-Loan-Authorization/view.ejs');
		return null;
	},
	renderBursarRefund: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Request-A-Refund/') {
			return res.redirect(url.format({
				pathname: '/io/Request-A-Refund/',
				query: req.query
			}));
		}
		res.render('forms/bursar/Request-A-Refund/view.ejs');
		return null;
	},
	renderBursarTuitionLetter: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Tuition-And-Fee-Letter/') {
			return res.redirect(url.format({
				pathname: '/io/Tuition-And-Fee-Letter/',
				query: req.query
			}));
		}
		res.render('forms/bursar/Tuition-And-Fee-Letter/view.ejs');
		return null;
	},
	renderBursarGradInsuranceOpt: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Graduate-Insurance-Opt/') {
			return res.redirect(url.format({
				pathname: '/io/Graduate-Insurance-Opt/',
				query: req.query
			}));
		}
		res.render('forms/bursar/Graduate-Insurance-Opt/view.ejs');
		return null;
	},
	renderBursarVoluntaryMealplan: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Voluntary-Meal-Plan/') {
			return res.redirect(url.format({
				pathname: '/io/Voluntary-Meal-Plan/',
				query: req.query
			}));
		}
		res.render('forms/bursar/Voluntary-Meal-Plan/view.ejs');
		return null;
	},
	renderCommencementParticipation: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Commencement-Participation') {
			return res.redirect(url.format({
				pathname: '/io/Commencement-Participation',
				query: req.query
			}));
		}
		res.render('forms/registrar-commencement/view.ejs');
		return null;
	},
	redirectCommencementParticipation: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/io/Commencement-Participation') {
			return res.redirect(url.format({
				pathname: '/io/Commencement-Participation',
				query: req.query
			}));
		}
		return res.redirect(url.format({
			pathname: '/io/Commencement-RSVP',
			query: req.query
		}));
	},
	
	accounts: (req, res, next) => {
		if (req.isAuthenticated()) {
			res.redirect('/Me/My-Account?traffic_source=accounts');
		} else {
			res.redirect('/article/230?traffic_source=accounts');
		}
		return null;
	},
	admin: (req, res, next) => {
		return res.redirect('/article/350?traffic_source=admin');
	},
	byeWPI: (req, res, next) => {
		return res.redirect('/service/1?traffic_source=bye-wpi');
	},
	renderDiscoverCanvas: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/Discover-Canvas') {
			return res.redirect(url.format({
				pathname: '/Discover-Canvas',
				query: req.query,
			}));
		}
		var isModo = !!req.headers['user-agent'].match(/modolabs/);
		if(isModo){
			logger.info("Start headers");
			logger.info(JSON.stringify(req.headers));
			logger.info("End headers");
			return res.redirect("https://wpi.instructure.com/login/oauth2/auth?response_type=code&redirect_uri=https://wpi-test.modolabs.net/kurogo_login/return/login/canvas&client_id=77820000000000156&scope=url:GET|/api/v1/accounts/:account_id/account_notifications+url:GET|/api/v1/accounts/:account_id/help_links+url:GET|/api/v1/courses/:course_id/assignment_groups+url:GET|/api/v1/courses/:course_id/assignments+url:GET|/api/v1/courses/:course_id/assignments/:id+url:GET|/api/v1/calendar_events+url:GET|/api/v1/conversations+url:POST|/api/v1/conversations+url:GET|/api/v1/conversations/:id+url:POST|/api/v1/conversations/:id/add_message+url:GET|/api/v1/courses+url:GET|/api/v1/courses/:id+url:GET|/api/v1/courses/:course_id/activity_stream+url:GET|/api/v1/courses/:course_id/activity_stream/summary+url:GET|/api/v1/courses/:course_id/discussion_topics+url:GET|/api/v1/courses/:course_id/discussion_topics/:topic_id+url:POST|/api/v1/courses/:course_id/discussion_topics+url:POST|/api/v1/courses/:course_id/discussion_topics/:topic_id/entries+url:GET|/api/v1/courses/:course_id/discussion_topics/:topic_id/entries+url:POST|/api/v1/courses/:course_id/discussion_topics/:topic_id/entries/:entry_id/replies+url:GET|/api/v1/courses/:course_id/discussion_topics/:topic_id/entries/:entry_id/replies+url:PUT|/api/v1/courses/:course_id/discussion_topics/:topic_id/read_all+url:GET|/api/v1/courses/:course_id/enrollments+url:GET|/api/v1/users/:user_id/enrollments+url:POST|/api/v1/error_reports+url:GET|/api/v1/users/self/groups+url:GET|/api/v1/courses/:course_id/groups+url:POST|/api/v1/groups/:group_id/memberships+url:DELETE|/api/v1/groups/:group_id/memberships/:membership_id+url:GET|/api/v1/courses/:course_id/modules+url:GET|/api/v1/courses/:course_id/pages+url:GET|/api/v1/courses/:course_id/pages/:url+url:PUT|/api/v1/courses/:course_id/pages/:url+url:GET|/api/v1/quiz_submissions/:quiz_submission_id/questions+url:POST|/api/v1/quiz_submissions/:quiz_submission_id/questions+url:GET|/api/v1/courses/:course_id/quizzes/:quiz_id/submissions+url:POST|/api/v1/courses/:course_id/quizzes/:quiz_id/submissions+url:POST|/api/v1/courses/:course_id/quizzes/:quiz_id/submissions/:id/complete+url:GET|/api/v1/courses/:course_id/quizzes+url:GET|/api/v1/courses/:course_id/quizzes/:id+url:POST|/api/v1/courses/:course_id/quizzes/:id/validate_access_code+url:GET|/api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id+url:POST|/api/v1/courses/:course_id/assignments/:assignment_id/submissions+url:POST|/api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id/files+url:PUT|/api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id+url:GET|/api/v1/users/:id+url:PUT|/api/v1/users/:id+url:POST|/api/v1/users/:user_id/files+url:GET|/api/v1/users/:id/colors+url:GET|/api/v1/users/:user_id/profile+url:POST|/api/v1/users/self/favorites/courses/:id+url:DELETE|/api/v1/users/self/favorites/courses/:id+url:GET|/api/v1/planner/items+url:PUT|/api/v1/planner/overrides/:id+url:POST|/api/v1/planner/overrides");
		}
		res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval' www.google-analytics.com www.googletagmanager.com fonts.googleapis.com fonts.gstatic.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; img-src 'self' *.wpi.edu *.tile.openstreetmap.org *.basemaps.cartocdn.com www.google-analytics.com *.inst-fs-iad-prod.inscloudgate.net inst-fs-iad-prod.inscloudgate.net data:; frame-ancestors https://wpi.instructure.com");
		res.render('pages/discover-canvas.ejs', {
			query: req.query,
			refer: req.get('Referrer'),
			request: req.headers
		});


		return null;
	},
	search: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/Search') {
			return res.redirect(url.format({
				pathname: '/Search',
				query: req.query
			}));
		}
		res.render('pages/search.ejs', {
			algoliaIndex: process.env.ALGOLIA_INDEX
		});
		return null;
	},
	renderServiceCatalog: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/Service-Catalog') {
			return res.redirect(url.format({
				pathname: '/Service-Catalog',
				query: req.query
			}));
		}

		Portfolio.findAll(
			{
				include: [
					{
						model: CatalogPhase,
						where: {
							title: 'publish'
						}
					},
					{
						model: Alias
					},
					{
						model: Tag
					},
					{
						model: Service,
						required: true,
						include: [
							{
								model: CatalogPhase,
								where: {
									title: 'publish'
								}
							},
							{
								model: Alias
							},
							{
								model: Tag
							},
							{
								model: Component,
								include: [
									{
										model: CatalogPhase,
										where: {
											title: 'publish'
										}
									},
									{
										model: Alias
									},
									{
										model: Tag
									},
								]
							}
						]
					},
				]
			}
		).then(portfolios => {
			res.render('pages/service-catalog.ejs', { portfolios });
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	renderNewsAndEvents: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/News-and-Events') {
			return res.redirect(url.format({
				pathname: '/News-and-Events',
				query: req.query
			}));
		}
		res.render('pages/news-and-events.ejs');
		return null;
	},
	renderSoftwareLibrary: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/Software-Library') {
			return res.redirect('/Software-Library');
		}
		SoftwareOS.findAll(
			{
				include: [
					{
						model: Software,
						required: true,
						attributes: [],
						include: [
							{
								model: SoftwarePhase,
								required: true,
								where: {
									title: 'publish'
								},
								attributes: []
							}
						]
					}
				]
			}
		).then(softwareOs => {
			res.render('pages/software-library.ejs',
				{
					softwareOs
				}
			);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	renderLocationsAndServers: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/Locations-and-Servers') {
			return res.redirect(url.format({
				pathname: '/Locations-and-Servers',
				query: req.query
			}));
		}
		Promise.all([LocationType.findAll(), Building.findAll({include: [{model: Location,required: true,attributes: []}]})]).then(values => {
			res.render('pages/locations.ejs', {
				locationTypes: values[0].sort(G.sortByTitle),
				buildings: values[1].sort(G.sortByTitle),
				query: req.query
			});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	renderKnowledgeBase: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/Knowledge-Base') {
			return res.redirect(url.format({
				pathname: '/Knowledge-Base',
				query: req.query
			}));
		}
		res.render('pages/knowledge-base.ejs');
		return null;
	},
	renderSitesSite: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/Sites') {
			return res.redirect(url.format({
				pathname: '/Sites',
				query: req.query
			}));
		}
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
					},
					{
						model: FileUpload,
						as: 'image'
					}
				]
			}
		).then(subsites => {
			const subsites_ = [];
			for (let subsite of subsites) {
				let imageSrc = subsite.image ? subsite.image.getURL() : null;
				subsite = subsite.toJSON();
				if (subsite.image) {
					let site = {
						...subsite
					};
					site.image.src = imageSrc;
					subsites_.push(site);
				} else {
					subsites_.push(subsite);
				}
			}
			res.render('pages/sites.ejs',
				{
					subsites: subsites_
				}
			);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	renderAppMarketplace: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/App-Marketplace') {
			return res.redirect(url.format({
				pathname: '/App-Marketplace',
				query: req.query
			}));
		}
		res.render('pages/app-marketplace.ejs');
		return null;
	},
	robotsTXT: (req, res, next) => {
		res.type('text/plain');
		return res.sendFile('robots.txt', {
			root: path.join(__dirname, '/../')
		});
	},
	nobotsTXT: (req, res, next) => {
		res.type('text/plain');
		return res.sendFile('nobots.txt', {
			root: path.join(__dirname, '/../')
		});
	},
	sitemap: (req, res, next) => {
		// route will still reach if lowercase, but make it title case for them :)
		if (req.path !== '/Site-Map') {
			return res.redirect(url.format({
				pathname: '/Site-Map',
				query: req.query
			}));
		}

		const sitemapBuilderPromises = [];

		// Article

		sitemapBuilderPromises.push(
			new Promise((resolve, reject) => {
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
					resolve(
						articles.map(a => {
							return {
								title: a.title,
								url: a.getURL()
							};
						})
					);
					return null;
				}).catch(err => {
					reject(err);
					return null;
				});
			})
		);

		// Spread

		sitemapBuilderPromises.push(
			new Promise((resolve, reject) => {
				Spread.findAll(
					{
						include: [
							{
								model: SpreadPhase,
								where: {
									title: 'publish'
								}
							}
						]
					}
				).then(spreads => {
					resolve(
						spreads.map(s => {
							return {
								title: s.title,
								url: s.getURL()
							};
						})
					);
					return null;
				}).catch(err => {
					reject(err);
					return null;
				});
			})
		);

		// Software

		sitemapBuilderPromises.push(
			new Promise((resolve, reject) => {
				Software.findAll(
					{
						include: [
							{
								model: SoftwarePhase,
								where: {
									title: 'publish'
								}
							}
						]
					}
				).then(software => {
					resolve(
						software.map(s => {
							return {
								title: s.title,
								url: s.getURL()
							};
						})
					);
					return null;
				}).catch(err => {
					reject(err);
					return null;
				});
			})
		);

		// News

		sitemapBuilderPromises.push(
			new Promise((resolve, reject) => {
				News.findAll(
					{
						include: [
							{
								model: NewsPhase,
								where: {
									title: 'publish'
								}
							}
						]
					}
				).then(news => {
					resolve(
						news.map(n => {
							return {
								title: n.title,
								url: n.getURL()
							};
						})
					);
					return null;
				}).catch(err => {
					reject(err);
					return null;
				});
			})
		);

		// Portfolio

		sitemapBuilderPromises.push(
			new Promise((resolve, reject) => {
				Portfolio.findAll(
					{
						include: [
							{
								model: CatalogPhase,
								where: {
									title: 'publish'
								}
							}
						]
					}
				).then(portfolios => {
					resolve(
						portfolios.map(p => {
							return {
								title: p.title,
								url: p.getURL()
							};
						})
					);
					return null;
				}).catch(err => {
					reject(err);
					return null;
				});
			})
		);

		// Service

		sitemapBuilderPromises.push(
			new Promise((resolve, reject) => {
				Service.findAll(
					{
						include: [
							{
								model: CatalogPhase,
								where: {
									title: 'publish'
								}
							}
						]
					}
				).then(services => {
					resolve(
						services.map(s => {
							return {
								title: s.title,
								url: s.getURL()
							};
						})
					);
					return null;
				}).catch(err => {
					reject(err);
					return null;
				});
			})
		);

		// Component

		sitemapBuilderPromises.push(
			new Promise((resolve, reject) => {
				Component.findAll(
					{
						include: [
							{
								model: CatalogPhase,
								where: {
									title: 'publish'
								}
							}
						]
					}
				).then(components => {
					resolve(
						components.map(c => {
							return {
								title: c.title,
								url: c.getURL()
							};
						})
					);
					return null;
				}).catch(err => {
					reject(err);
					return null;
				});
			})
		);

		// Building

		sitemapBuilderPromises.push(
			new Promise((resolve, reject) => {
				Building.findAll().then(buildings => {
					resolve(
						buildings.map(b => {
							return {
								title: b.title,
								url: b.getURL()
							};
						})
					);
					return null;
				}).catch(err => {
					reject(err);
					return null;
				});
			})
		);

		// Location

		sitemapBuilderPromises.push(
			new Promise((resolve, reject) => {
				Location.findAll().then(locations => {
					resolve(
						locations.map(l => {
							return {
								title: l.title,
								url: l.getURL()
							};
						})
					);
					return null;
				}).catch(err => {
					reject(err);
					return null;
				});
			})
		);

		sitemapBuilderPromises.push(
			new Promise(resolve => {
				resolve(
					[
						{
							title: 'My Dashboard',
							url: '/Me/My-Dashboard'
						},
						{
							title: 'Knowledge Base',
							url: '/Knowledge-Base'
						},
						{
							title: 'Service Catalog',
							url: '/Service-Catalog'
						},
						{
							title: 'Software Library',
							url: '/Software-Library'
						},
						{
							title: 'News and Events',
							url: '/News-and-Events'
						},
						{
							title: 'App Marketplace',
							url: '/App-Marketplace'
						},
						{
							title: 'Utilities',
							url: '/Utilities'
						},
						{
							title: 'Help',
							url: '/Help'
						},
						{
							title: 'Admin',
							url: '/Admin'
						},
						{
							title: 'Accounts',
							url: '/Accounts'
						},
						{
							title: 'Site Map',
							url: '/Site-Map'
						}
					]
				);
				return null;
			})
		);

		return Promise.all(sitemapBuilderPromises).then(values => {
			res.render('pages/site-map.ejs', {
				articles: values[0],
				spreads: values[1],
				software: values[2],
				news: values[3],
				portfolios: values[4],
				services: values[5],
				components: values[6],
				buildings: values[7],
				locations: values[8],
				pages: values[9]
			});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	sitemapXML: async(req, res, next) => {
		try {
			res.header('Content-Type', 'application/xml');
			res.send(await sitemap.xml);
		} catch (err) {
			next(err);
		}
		return null;
	}
};