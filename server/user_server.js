const sanitizeHTML = require('sanitize-html');
const config = require('../config.js');
const User = require('../models/User.js');
const Widget = require('../models/Widget.js');
const UserPermissionLevel = require('../models/UserPermissionLevel.js');
const Permission = require('../models/Permission.js');
const PermissionLevel = require('../models/PermissionLevel.js');
const UserViewHistory = require('../models/UserViewHistory.js');
const UserHasWidget = require('../models/UserHasWidget.js');
const UserOauth = require('../models/UserOauth.js');
const G = require('./_global_logic.js');
const { Op } = require('sequelize');
const CherwellAPI = require('./cherwell/Cherwell.js');
const cherwellAPI = new CherwellAPI();
const BannerAPI = require('./banner/BannerAPI.js');
const bannerAPI = new BannerAPI();
const GetInclusiveAPI = require('./getInclusive/getInclusive.js');
const getInclusive = new GetInclusiveAPI();
const logger = require('./logger.js');

module.exports = {
	/**
	 * MIDDLEWARE
	 */
	/**
	 * @description for setting active tab based on route
	 */
	buildMeTabs: (req, res, next) => {
		const requestPath = req.originalUrl.split('/').length > 2 ? req.originalUrl.split('/')[2] : req.originalUrl.split('/')[1];
		const keys = {
			'My-Dashboard': 'myDashboard',
			'My-Account': 'myAccount',
			'My-Tickets': 'myTickets',
			'My-TechFlex': 'myTechFlex',
			'My-Commencement': 'myCommencement',
			'My-NSO': 'myNSO',
			'My-Approvals': 'myApprovals',
			'My-Apps': 'myApps',
			'My-Assets': 'myAssets',
			'My-Canvas': 'myCanvas',
			'Achievements': 'achievements',
			'History': 'history',
			'Profile': 'profile',
			'Widgets': 'widgets',
			'Settings': 'settings'
		};
		const tabs = {
			'myDashboard': '',
			'myAccount': '',
			'myTickets': '',
			'myTechFlex': '',
			'myCommencement': '',
			'myNSO': '',
			'myApps': '',
			'myAssets': '',
			'myCanvas': '',
			'achievements': '',
			'history': '',
			'profile': '',
			'widgets': '',
			'settings': ''
		};
		tabs[keys[requestPath]] = 'active';
		res.locals.meTabs = tabs;
		return next();
	},
	/**
	 * API
	 */
	updateSettings: (req, res, next) => {
		new Promise((resolve, reject) => {
			req.session.preferences = req.session.preferences || {};
			req.session.preferences.themePreference = typeof req.body.themePreference !== 'undefined' ? sanitizeHTML(req.body.themePreference, config.sanitizeHTML.allowNone) : req.session.preferences.themePreference;
			req.session.preferences.navbarCompact = typeof req.body.navbarCompact !== 'undefined' ? req.body.navbarCompact : req.session.preferences.navbarCompact;
			req.session.preferences.navbarOpen = typeof req.body.navbarOpen !== 'undefined' ? req.body.navbarOpen : req.session.preferences.navbarOpen;
			req.session.preferences.textDisplay = typeof req.body.textDisplay !== 'undefined' ? req.body.textDisplay : req.session.preferences.textDisplay;
			req.session.preferences.seasonalTheme = typeof req.body.seasonalTheme !== 'undefined' ? req.body.seasonalTheme : req.session.preferences.seasonalTheme;
			req.session.preferences.meLabels = typeof req.body.meLabels !== 'undefined' ? req.body.meLabels : req.session.preferences.meLabels;

			req.session.save(err => {
				if (err) {
					next(err);
					return null;
				} else {
					if (req.isAuthenticated()) {
						User.findById(req.user.id).then(user => {
							let userPreferenceHue = req.body.userPreferenceHue || user.userPreference.hue;
							if (req.body.userPreferenceHue === 'default') {
								userPreferenceHue = null;
							}
							user.userPreference.themePreference = req.session.preferences.themePreference;
							user.userPreference.navbarCompact = req.session.preferences.navbarCompact;
							user.userPreference.navbarOpen = req.session.preferences.navbarOpen;
							user.userPreference.textDisplay = req.session.preferences.textDisplay;
							user.userPreference.seasonalTheme = req.session.preferences.seasonalTheme;
							user.userPreference.hue = userPreferenceHue;
							user.userPreference.meLabels = req.session.preferences.meLabels;
							return user.userPreference.save().then(user_s => {
								resolve(user_s);
								return null;
							}).catch(err => {
								reject(err);
								return null;
							});
						}).catch(err => {
							reject(err);
							return null;
						});
					} else {
						resolve(true);
						return null;
					}
				}
			});
		}).then(result => {
			return res.json({success: result});
		}).catch(err => {
			next(err);
			return null;
		});
	},
	/**
	 * VIEWS
	 */
	myDashboard: (req, res, next) => {
		if (req.url === '/Me/My-ITS') {
			return res.redirect(301, '/Me/My-Dashboard');
		}
		if (req.url !== '/Me/My-Dashboard') {
			return res.redirect('/Me/My-Dashboard');
		}
		UserViewHistory.findByUserId(req.user.id).then(userViewHistory => {
			res.render('meAgain/my-dashboard.ejs', {
				userViewHistoryArticles: userViewHistory.filter(u => u.entity === 'article').slice(0,4)
			});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	widgets: (req, res, next) => {
		if (req.url !== '/Me/Widgets') {
			return res.redirect('/Me/Widgets');
		}
		Widget.findAll(
			{
				include: [
					{
						model: User,
						required: false,
						where: {
							id: req.user.id
						}
					}
				]
			}
		).then(widgets => {
			// check validity on tokens
			return UserOauth.findAll(
				{
					where: {
						idUser: req.user.id
					}
				}
			).then(userOauths => {
				const getTokenPromises = [];
				for (const userOauth of userOauths) {
					getTokenPromises.push(UserOauth.getToken(req.user.id, userOauth.type));
				}
				return Promise.all(getTokenPromises).then(async() => {
					res.render('meAgain/widgets.ejs',
						{
							userSidebarWidgets: false,
							widgets,
							userOauths: await UserOauth.findAll(
								{
									where: {
										idUser: req.user.id
									}
								}
							)
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
		}).catch(err => {
			next(err);
			return null;
		});
	},
	settings: (req, res, next) => {
		if (req.url !== '/Me/Settings') {
			return res.redirect('/Me/Settings');
		}
		res.render('meAgain/settings.ejs');
		return null;
	},
	registrar: (req, res, next) => {
		if (req.url !== '/Me/Registrar-Utilities') {
			return res.redirect('/Me/Registrar-Utilities');
		}
		res.render('meAgain/registrar-utilities.ejs');
		return null;
	},
	accounts: (req, res, next) => {
		if (req.url !== '/Me/My-Account') {
			return res.redirect('/Me/My-Account');
		}
		res.render('meAgain/my-account.ejs');
		return null;
	},
	myInstructedJSON: async (req, res, next) => { 

			let instructed = {};

			let PIDM = req.session.userAttributes["user.employeeNumber"];
			let term = 202102
			let pterm = ['1','1C','D'];
			let mergedArray =[];
			let grouped =[];
			let intents = [];
			let observedID = [];
			let intentResults = "";
			
			instructed = await bannerAPI.getMyInstructedAll(PIDM, term,pterm).catch(err =>{
				logger.err(err);
				return null;
			});
			instructed = instructed.rows;
			if(instructed && instructed.length){
				let insfilters = [];
				
				for(registration of instructed){
					if(!observedID.includes(registration["STU_ID"])){

					observedID.push(registration["STU_ID"]);
					insfilters.push(
						{ // Student
							fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466566ca0de020a3e321a4e5aa940068abdc51ded',
							operator: 'eq',
							value: registration["STU_ID"]
						},
					);
				}
					registration.text = "queried"
				}

				
				let batch = []
				
				while(insfilters.length > 0){
					batch.push(insfilters.splice(0,150))
				}
				let intentsRaw = [];

				for (runQuery of batch){
					runQuery.push(
						{ // Term
							fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466567a186db597f329254cc9870bfe0e3e386a50',
							operator: 'eq',
							value: '202102'
						},
						{ // PTERM
							fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466567ac570751d1bd8644b2f90ec49ad378b5720',
							operator: 'eq',
							value: 'D'
						}
					);
					const instsearch = {
						filters: runQuery,
						association: 'IntentSurvey',
						busObId: '946656451978e6e6dca4e34c149e5817f3e8c308fb',
						includeAllFields: false,
						fields:[
							"9466566ca0de020a3e321a4e5aa940068abdc51ded",
							"9466566d0da00e4f6a34854e35a6f424ba1700db46",
							"9466567f4e5e75bf20ca7040b697294e9a36a71fd8",
							"9466566c25a5f2f406ac5d4d17939de722bf952167",
							"946a2996349553fc95dbf245bcb5b71eecb8f18571"
						],
						pageNumber: 0,
						pageSize: 0,
						scope: 'Global'
					};
	
					let tempIntentResults = await cherwellAPI.getSearchResults(instsearch);
					let tempIntentsRaw = JSON.parse(tempIntentResults).businessObjects;
					intentsRaw = [...intentsRaw, ...tempIntentsRaw]
				}

				for (const intent of intentsRaw) {
					intents.push(
						{
							STU_ID: intent.fields.find(f => f.name === 'WPIID')['value'],
							wpiemail: intent.fields.find(f => f.name === 'WPIEmail')['value'],
							designation: intent.fields.find(f => f.name === 'Designation')['value'],
						}
					);
					
				}
				for(let i=0; i<instructed.length; i++) {
					mergedArray.push({
						...instructed[i], 
						...(intents.find((itmInner) => itmInner.STU_ID === instructed[i].STU_ID))}
					);
				}
				function groupBy(arr, prop) {
					const map = new Map(Array.from(arr, obj => [obj[prop], []]));
					arr.forEach(obj => map.get(obj[prop]).push(obj));
					return Array.from(map.values());
				}
				grouped = groupBy(mergedArray, "CRSE_CRN")

			
		
		
		res.json({
			"observed":observedID.length,
			"size":intents.length,
			"raw":intentsRaw.length,
			intents,
		});

		return null;
	}
	},
	// myTechFlex: async (req, res, next) => { 
	// 	if (req.url !== '/Me/My-TechFlex') {
	// 	  return res.redirect('/Me/My-TechFlex');
	// 	}

	// 	let customer =  await cherwellAPI.getCustomerByID(req.user.employeeID);
	// 	customer = JSON.parse(customer).businessObjects[0];
	// 	let intent = await cherwellAPI.getRelatedBusinessObjects('93405caa107c376a2bd15c4c8885a900be316f3a72', customer.busObRecId, '9466569ae4c5f4a00d39ec4273aab1d5fd8ab1ff23') || null
	// 	intent = JSON.parse(intent).relatedBusinessObjects;
		
	// 	res.render('me/my-techflex.ejs', {
	// 		intent
	// 	});
	// 	return null;
	// },
	new_myTechFlex: async (req, res, next) => { 
		if (req.url !== '/Me/My-TechFlex') {
		  return res.redirect('/Me/My-TechFlex');
		}

		let customer =  await cherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		const intentOut = []
		const caseOut = []
		var intent = await cherwellAPI.getRelatedBusinessObjects('93405caa107c376a2bd15c4c8885a900be316f3a72', customer.busObRecId, '9466569ae4c5f4a00d39ec4273aab1d5fd8ab1ff23') || null;
		var cases = await cherwellAPI.getRelatedBusinessObjects('93405caa107c376a2bd15c4c8885a900be316f3a72', customer.busObRecId, '947e27d73d1d8efa2d561d4e76b61e639cb51d0979') || null;

		
		if(cases !== undefined && cases !== null && cases.length){
			cases = JSON.parse(cases).relatedBusinessObjects;

			let caseCounter = 0;
			for(caseItem of cases){
				caseOut[caseCounter] = {};
				caseItem.fields.map(function(prop){
					caseOut[caseCounter][prop.name] = prop.value;
				})
				caseCounter++
			}
		}else{
			cases = null;
		}

		if(intent !== undefined && intent !== null && intent.length){
			intent = JSON.parse(intent).relatedBusinessObjects;
			let intentCounter = 0;
			for(intentItem of intent){
				intentOut[intentCounter] = {};
				intentItem.fields.map(function(prop){
					intentOut[intentCounter][prop.name] = prop.value;
				})
			intentCounter++
			}
		}else{
			intent = null;
		}

		res.render('meAgain/my-techflex.ejs', {
			intentOut,
			caseOut
		});
		return null;
	},
	myNSO: async (req, res, next) => { 
		let customer = null;
		let inclusiveCourses = null;
		// customer =  await cherwellAPI.getCustomerByID(req.user.employeeID);
		// customer = JSON.parse(customer).businessObjects[0];

		if(req.isAuthenticated() && req.user && req.user.employeeID){
			inclusiveCourses = await getInclusive.getUserStatus(req.user.employeeID);
			inclusiveCourses = JSON.parse(inclusiveCourses);
		}

		res.render('meAgain/my-nso.ejs', {
			title: "My NSO",
			customer,
			inclusiveCourses
		});
		return null;
	},
	myGSO: async (req, res, next) => { 
		let customer = null;
		let inclusiveCourses = null;
		// customer =  await cherwellAPI.getCustomerByID(req.user.employeeID);
		// customer = JSON.parse(customer).businessObjects[0];

		if(req.isAuthenticated() && req.user && req.user.employeeID){
			inclusiveCourses = await getInclusive.getUserStatus(req.user.employeeID);
			inclusiveCourses = JSON.parse(inclusiveCourses);
		}

		res.render('meAgain/my-gso.ejs', {
			title: "My GSO",
			customer,
			inclusiveCourses
		});
		return null;
	},
	myTrainings: async (req, res, next) => { 
		let customer = null;
		let inclusiveCourses = null;
		// customer =  await cherwellAPI.getCustomerByID(req.user.employeeID);
		// customer = JSON.parse(customer).businessObjects[0];

		if(req.isAuthenticated() && req.user && req.user.employeeID){
			inclusiveCourses = await getInclusive.getUserStatus(req.user.employeeID);
			inclusiveCourses = JSON.parse(inclusiveCourses);
		}

		res.render('meAgain/my-trainings.ejs', {
			title: "My Trainings",
			customer,
			inclusiveCourses
		});
		return null;
	},
	myCommencement: async (req, res, next) => { 
		if (req.url !== '/Me/My-Commencement') {
		  return res.redirect('/Me/My-Commencement');
		}

		let customer =  await cherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];

		var commencementOut = []
		var commencementRSVPOut = []
		var commencementRSVP = null;
		var commencementEnroll = null;
		var commencementEnrollOut = []
		var commencement = await cherwellAPI.getRelatedBusinessObjects('93405caa107c376a2bd15c4c8885a900be316f3a72', customer.busObRecId, '9481e03b8df4a9f250f0054349afa8c77b4f2dc38a');
		commencement = JSON.parse(commencement).relatedBusinessObjects;

		if(commencement && commencement.length && commencement[0] && commencement[0].busObRecId != null){
			commencementRSVP = await cherwellAPI.getRelatedBusinessObjects('9481accb6d8873b694c93c4f7fa5a07a428e18c2c0', commencement[0].busObRecId, '9481e0d446171d361727524749a04c6187823b6b39');
			commencementRSVP = JSON.parse(commencementRSVP).relatedBusinessObjects;

			commencementEnroll = await cherwellAPI.getRelatedBusinessObjects('9481accb6d8873b694c93c4f7fa5a07a428e18c2c0', commencement[0].busObRecId, '9481e06e7fa64f766f352040b08183538e2fe50e3c');
			commencementEnroll = JSON.parse(commencementEnroll).relatedBusinessObjects;
		}
		if(commencement !== undefined && commencement !== null && commencement.length){
			let commencementCounter = 0;
			for(commencementItem of commencement){
				commencementOut[commencementCounter] = {};
				commencementItem.fields.map(function(prop){
					commencementOut[commencementCounter][prop.name] = prop.value;
				})
				commencementCounter++
			}
		}else{
			commencementOut = null;
		}

		if(commencementRSVP !== undefined && commencementRSVP !== null && commencementRSVP.length){
			let commencementCounter = 0;
			for(commencementRSVPItem of commencementRSVP){
				commencementRSVPOut[commencementCounter] = {};
				commencementRSVPItem.fields.map(function(prop){
					commencementRSVPOut[commencementCounter][prop.name] = prop.value;
				})
				commencementCounter++
			}
		}else{
			commencementRSVPOut = null;
		}
		if(commencementEnroll !== undefined && commencementEnroll !== null && commencementEnroll.length){
			let commencementCounter = 0;
			for(commencementEnrollItem of commencementEnroll){
				commencementEnrollOut[commencementCounter] = {};
				commencementEnrollItem.fields.map(function(prop){
					commencementEnrollOut[commencementCounter][prop.name] = prop.value;
				})
				commencementCounter++
			}
		}else{
			commencementEnrollOut = null;
		}



		res.render('meAgain/my-commencement.ejs', {
			title: "My Commencement",
			commencementOut,
			commencementRSVPOut,
			commencementEnrollOut
		});
		return null;
	},
	myCommencementTickets: async (req, res, next) => { 
		const commencementRSVPID = req.params.id;
		
		let customer =  await cherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];

		var commencementOut = []
		var commencementRSVPOut = []
		var commencementTicketsOut = []
		var commencementRSVP = null;
		var commencementTickets = null;

		var commencement = await cherwellAPI.getRelatedBusinessObjects('93405caa107c376a2bd15c4c8885a900be316f3a72', customer.busObRecId, '9481e03b8df4a9f250f0054349afa8c77b4f2dc38a');
		commencement = JSON.parse(commencement).relatedBusinessObjects;

		if(commencement && commencement.length && commencement[0] && commencement[0].busObRecId != null){
			commencementRSVP = await cherwellAPI.getRelatedBusinessObjects('9481accb6d8873b694c93c4f7fa5a07a428e18c2c0', commencement[0].busObRecId, '9481e0d446171d361727524749a04c6187823b6b39');
			commencementRSVP = JSON.parse(commencementRSVP).relatedBusinessObjects;

			commencementTickets = await cherwellAPI.getRelatedBusinessObjects('9481accb6d8873b694c93c4f7fa5a07a428e18c2c0', commencement[0].busObRecId, '9481e2ffb28de58e2b941f46a29eef9cf982abd5b3');
			commencementTickets = JSON.parse(commencementTickets).relatedBusinessObjects;
		}
		if(commencement !== undefined && commencement !== null && commencement.length){
			let commencementCounter = 0;
			for(commencementItem of commencement){
				commencementOut[commencementCounter] = {};
				commencementItem.fields.map(function(prop){
					commencementOut[commencementCounter][prop.name] = prop.value;
				})
				commencementCounter++
			}
		}else{
			commencementOut = null;
		}

		if(commencementRSVP !== undefined && commencementRSVP !== null && commencementRSVP.length){
			let commencementCounter = 0;
			for(commencementRSVPItem of commencementRSVP){
				commencementRSVPOut[commencementCounter] = {};
				commencementRSVPItem.fields.map(function(prop){
					commencementRSVPOut[commencementCounter][prop.name] = prop.value;
				})
				commencementCounter++
			}
			commencementRSVPOut = commencementRSVPOut.filter(RSVP => RSVP.RecID == commencementRSVPID)
		}else{
			commencementRSVPOut = null;
		}

		if(commencementTickets !== undefined && commencementTickets !== null && commencementTickets.length){
			let commencementCounter = 0;
			for(commencementTicketsItem of commencementTickets){
				commencementTicketsOut[commencementCounter] = {};
				commencementTicketsItem.fields.map(function(prop){
					commencementTicketsOut[commencementCounter][prop.name] = prop.value;
				})
				commencementCounter++
			}
			commencementTicketsOut = commencementTicketsOut.filter(tickets => tickets.CommencementRSVPRecID == commencementRSVPID)
			commencementTicketsOut = commencementTicketsOut.filter(tickets => tickets.TicketStatus != "Void")
		}else{
			commencementTicketsOut = null;
		}

		
		


		res.render('meAgain/my-commencement-tickets.ejs', {
			title: "My Commencement Tickets",
			commencementOut,
			commencementRSVPOut,
			commencementTicketsOut
		});
		return null;
	},
	
	GetCommencementTicketByID: async (req, res, next) => { 
		const ticketID = req.params.id;

		var ticketOut = [];
		var relatedTicketOut = []
		var ticket = await cherwellAPI.getBusinessObjectByRecID('9481e2daa8766b783b868a448089fb5dff45111855', ticketID);
		ticket = [JSON.parse(ticket)]


		if(ticket !== undefined && ticket !== null && ticket.length){
			let ticketCounter = 0;
			for(ticketItem of ticket){
				ticketOut[ticketCounter] = {};
				ticketItem.fields.map(function(prop){
					ticketOut[ticketCounter][prop.name] = prop.value;
				})
				ticketCounter++
			}
		}else{
			ticket = null;
		}
		
		let runQuery=[];
		runQuery.push(
			{ // WPI ID
				fieldId: 'BO:9481e2daa8766b783b868a448089fb5dff45111855,FI:9481e2ddb5847fbf4a72ac44bd8cb7154cbace0594',
				operator: 'eq',
				value: ticketOut[0].StudentWPIID
			},
			{ // Attendee Email
				fieldId: 'BO:9481e2daa8766b783b868a448089fb5dff45111855,FI:9481e2e72c1249b539a4ea40bbb709ab645c702980',
				operator: 'eq',
				value: ticketOut[0].AttendeeEmail
			},
			{ // ceremony
				fieldId: 'BO:9481e2daa8766b783b868a448089fb5dff45111855,FI:9481e2e72c1249b539a4ea40bbb709ab645c702980',
				operator: 'eq',
				value: ticketOut[0].CeremonyRecID
			}

			
		);
		const instsearch = {
			filters: runQuery,
			association: 'CommencementTicket',
			busObId: '9481e2daa8766b783b868a448089fb5dff45111855',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 0,
			scope: 'Global'
		};

		let relatedTicket = await cherwellAPI.getSearchResults(instsearch);
		relatedTicket = JSON.parse(relatedTicket).businessObjects;

		if(relatedTicket !== undefined && relatedTicket !== null && relatedTicket.length){
			let ticketCounter = 0;
			for(relatedTicketItem of relatedTicket){
				relatedTicketOut[ticketCounter] = {};
				relatedTicketItem.fields.map(function(prop){
					relatedTicketOut[ticketCounter][prop.name] = prop.value;
				})
				ticketCounter++
			}
			relatedTicketOut = relatedTicketOut.filter(tickets => tickets.TicketStatus != "Void")
			relatedTicketOut = relatedTicketOut.filter(tickets => tickets.RecID != ticketOut[0].RecID)
		}else{
			relatedTicketOut = null;
		}

		res.render('meAgain/commencement-tickets.ejs', {
			title: "Commencement Ticket",
			ticketOut,
			relatedTicketOut
		});
		return null;
	},

	GetCommencementManager: async (req, res, next) => { 

		res.render('meAgain/commencement-manager.ejs', {
			title: "Commencement Manager",
		});
		return null;
	},

	GetCovidTestManager: async (req, res, next) => { 
		const allowedUsers = ['894748957','568721178','774482483','108654595','312364706','170167441','528782752','613999222','129419007','746305649']
		if(allowedUsers.includes(req.user.employeeID)){
			res.render('meAgain/covid-manager.ejs', {
				title: "Covid Test Distribution",
			});
			return null;
		}else{
			return next(403);
		}
	},
	myTechFlexCase: async (req, res, next) => { 
		if (req.url !== '/Me/My-Case') {
		  return res.redirect('/Me/My-Case');
		}

		let customer =  await cherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		const intentOut = []
		const caseOut = []
		var intent = await cherwellAPI.getRelatedBusinessObjects('93405caa107c376a2bd15c4c8885a900be316f3a72', customer.busObRecId, '9466569ae4c5f4a00d39ec4273aab1d5fd8ab1ff23');
		var cases = await cherwellAPI.getRelatedBusinessObjects('93405caa107c376a2bd15c4c8885a900be316f3a72', customer.busObRecId, '947e27d73d1d8efa2d561d4e76b61e639cb51d0979');
		intent = JSON.parse(intent).relatedBusinessObjects;
		
		if(cases !== undefined && cases !== null && cases.length){
			cases = JSON.parse(cases).relatedBusinessObjects;

			let caseCounter = 0;
			for(caseItem of cases){
				caseOut[caseCounter] = {};
				caseItem.fields.map(function(prop){
					caseOut[caseCounter][prop.name] = prop.value;
				})
				caseCounter++
			}
		}else{
			cases = null;
		}


		let intentCounter = 0;
		for(intentItem of intent){
			intentOut[intentCounter] = {};
			intentItem.fields.map(function(prop){
				intentOut[intentCounter][prop.name] = prop.value;
			})
		intentCounter++
		}

		res.render('meAgain/my-techflex-case.ejs', {
			intentOut,
			caseOut
		});

		
		return null;
	},

	myTickets: (req, res, next) => {
		if (req.url !== '/Me/My-Tickets') {
			return res.redirect('/Me/My-Tickets');
		}
		res.render('meAgain/my-tickets.ejs');
		return null;
	},
	myDelegations: async (req, res, next) => {
		if (req.url !== '/Me/My-Delegations') {
			return res.redirect('/Me/My-Delegations');
		}
		res.render('meAgain/my-contracts.ejs');
		return null;

	},
	myApprovals: (req, res, next) => {
		if (req.url !== '/Me/My-Approvals') {
			return res.redirect('/Me/My-Approvals');
		}
		res.render('meAgain/my-approvals.ejs');
		return null;
	},
	myAssets: (req, res, next) => {
		if (req.url !== '/Me/My-Assets') {
			return res.redirect('/Me/My-Assets');
		}
		res.render('meAgain/my-assets.ejs');
		return null;
	},
	myApps: (req, res, next) => {
		if (req.url !== '/Me/My-Apps') {
			return res.redirect('/Me/My-Apps');
		}
		res.render('meAgain/my-apps.ejs');
		return null;
	},
	myCanvas: (req, res, next) => {
		if (req.url !== '/Me/My-Canvas') {
			return res.redirect('/Me/My-Canvas');
		}
		res.render('meAgain/my-canvas.ejs');
		return null;
	},
	history: (req, res, next) => {
		if (req.url !== '/Me/History') {
			return res.redirect('/Me/History');
		}
		UserViewHistory.findByUserId(req.user.id).then(userViewHistory => {
			res.render('meAgain/history.ejs', {
				userViewHistory
			});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getAllHistory: (req, res, next) => {
		UserViewHistory.findByUserId(req.user.id).then(userViewHistory => {
			res.json(userViewHistory);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	clearHistory: (req, res, next) => {
		UserViewHistory.destroy(
			{
				where: {
					idUser: req.user.id
				}
			}
		).then(() => {
			res.status(204).send();
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	renderByGuidPublic: (req, res, next) => {
		User.findOne(
			{
				where: {
					guidPublic: req.params.guidPublic
				},
				include: [
					{
						model: UserPermissionLevel,
						include: [
							{
								model: Permission
							},
							{
								model: PermissionLevel
							}
						]
					},
				]
			}
		).then(async user_ => {
			return res.render('user/view.ejs',
				{
					user_,
					edit: false,
					canViewPermissions: await G.checkPermissions(req, 'permission', 'read'),
					canEditPermissions: await G.checkPermissions(req, 'permission', 'publish')
				}
			);
		}).catch(err => {
			next(err);
			return null;
		});
	},
	edit: (req, res, next) => {
		User.findOne(
			{
				where: {
					guidPublic: req.params.guidPublic
				},
				include: [
					{
						model: UserPermissionLevel,
						include: [
							{
								model: Permission
							},
							{
								model: PermissionLevel
							}
						]
					},
				]
			}
		).then(async user_ => {
			return res.render('user/view.ejs',
				{
					user_,
					edit: true,
					canViewPermissions: true,
					canEditPermissions: true,
					permissions: await Permission.findAll(),
					permissionLevels: await PermissionLevel.findAll()
				}
			);
		}).catch(err => {
			next(err);
			return null;
		});
	},
	updatePermissions: (req, res, next) => {
		const updatePermissionsPromises = [];
		const userID = req.params.id;
		for (const permission of req.body.permissions) {
			const permissionID = permission.permissionID;
			const permissionLevelID = permission.permissionLevelID;
			updatePermissionsPromises.push(
				new Promise((resolve, reject) => {
					return Permission.findByPk(permissionID).then(permission => {
						if (permission) {
							return PermissionLevel.findByPk(permissionLevelID).then(permissionLevel => {
								if (permissionLevel) {
									return UserPermissionLevel.findOne(
										{
											where: {
												idUser: userID,
												idPermission: permission.id
											}
										}
									).then(async userPermissionLevel => {
										if (userPermissionLevel) {
											userPermissionLevel.idPermissionLevel = permissionLevel.id;
											await userPermissionLevel.save();
											resolve(true);
											return null;
										} else {
											await UserPermissionLevel.create(
												{
													idUser: userID,
													idPermission: permission.id,
													idPermissionLevel: permissionLevel.id
												}
											);
											resolve(true);
											return null;
										}
									}).catch(err => {
										reject(err);
										return null;
									});
								} else {
									return UserPermissionLevel.findOne(
										{
											where: {
												idUser: userID,
												idPermission: permission.id
											}
										}
									).then(async userPermissionLevel => {
										if (userPermissionLevel) {
											await userPermissionLevel.destroy();
										}
										resolve(true);
										return null;
									}).catch(err => {
										reject(err);
										return null;
									});
								}
							}).catch(err => {
								reject(err);
								return null;
							});
						} else { // no permission with that id
							reject(400);
							return null;
						}
					}).catch(err => {
						reject(err);
						return null;
					});
				})
			);
		}
		Promise.all(updatePermissionsPromises).then(() => {
			if (G.isSuperUser(req)) {
				User.findByPk(userID).then(async user => {
					user.isAdmin = req.body.admin === 'true';
					await user.save();
					res.json({success: true});
					return null;
				}).catch(err => {
					next(err);
					return null;
				});
			} else {
				res.json({success: true});
				return null;
			}
		}).catch(err => {
			next(err);
			return null;
		});
	},
	updateWidgets: (req, res, next) => {
		// TODO dont let people install widgets that they havent oauthd before
		const { widgets } = req.body;
		UserHasWidget.destroy(
			{
				where: {
					idUser: req.user.id
				}
			}
		).then(() => {
			if (!(widgets && Array.isArray(widgets))) {
				res.json({success: true, createdWidgets: []});
				return null;
			}
			const items = widgets.map(w => {
				return {
					idWidget: w.idWidget,
					idUser: req.user.id,
					isDashboard: w.isDashboard === 'true',
					isSidebar: w.isSidebar === 'true',
					orderDashboard: w.orderDashboard || null,
					orderSidebar: w.orderSidebar || null
				};
			});
			return UserHasWidget.bulkCreate(items).then(createdWidgets => {
				res.json({createdWidgets});
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
	updateSidebarWidgets: (req, res, next) => {
		// TODO dont let people install widgets that they havent oauthd before
		const { widgets } = req.body;
		UserHasWidget.findAll(
			{
				where: {
					idUser: req.user.id,
					isSidebar: true
				}
			}
		).then(async userWidgets => {
			if (!(widgets && Array.isArray(widgets))) {
				res.json({success: true, createdWidgets: []});
				return null;
			}
			const items = widgets.map(w => {
				return {
					idWidget: w.idWidget,
					idUser: req.user.id,
					isDashboard: typeof userWidgets.find(u => u.idWidget == w.idWidget) !== 'undefined' ? userWidgets.find(u => u.idWidget == w.idWidget).isDashboard : false,
					isSidebar: w.isSidebar === 'true',
					orderDashboard: typeof userWidgets.find(u => u.idWidget == w.idWidget) !== 'undefined' ? userWidgets.find(u => u.idWidget == w.idWidget).orderDashboard : null,
					orderSidebar: w.orderSidebar || null
				};
			});
			for (const widget of userWidgets) {
				await widget.destroy();
			}
			return UserHasWidget.bulkCreate(items).then(createdWidgets => {
				res.json({createdWidgets});
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
	getAll: (req, res, next) => {
		User.findAll(
			{
				where: {
					id: {
						[Op.ne]: 1
					}
				},
				attributes: ['id', 'givenname', 'surname', 'username']
			}
		).then(users => {
			res.json(users);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	}
};