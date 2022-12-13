const Cherwell = require('./Cherwell.js');
const CherwellAPI = new Cherwell();
const User = require('../../models/User.js');
const AssetImage = require('../../models/AssetImage.js');
const FileUpload = require('../../models/FileUpload.js');
const G = require('../_global_logic.js');
const logger = require('../logger.js');
const moment = require('moment');
const BannerAPI = require('../banner/BannerAPI.js');
const CherwellTokenCache = require('../../models/CherwellTokenCache.js');
const bannerAPI = new BannerAPI();
const url = require('url');

// hide from self service field must be false
const incidentFilter = incident =>  incident.fields.some(f => f.fieldId === 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:945e060e8463792fe8d94d48d3b85ee198501b39b7' && f.value === 'False');
module.exports = {
	createIncident: (req, res, next) => {
		
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				if (req.isAuthenticated()) {
					let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
					customer = JSON.parse(customer).businessObjects[0];
					const customerID = customer.busObRecId;
					const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
					return res.json(JSON.parse(await CherwellAPI.createIncident(customerID, formData, customerFullName)));
				} else {
					return res.json(JSON.parse(await CherwellAPI.createIncident(null, formData, null)));
				}
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	createIncidentiCigna: async(req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length");

		const formData = req.body;
		logger.info(req.body);
		return res.json(JSON.parse(await CherwellAPI.createIncidentiCigna(formData)));
	},
	createOnboardingTask: async(req, res, next) => {

		const formData = req.body;
		if (req.isAuthenticated()) {
			return res.json(JSON.parse(await CherwellAPI.createOnboardingTask(formData)));
		}else{
			return next(400);
		}
	},
	createIncidentCovid19: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				if (req.isAuthenticated()) {
					let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
					customer = JSON.parse(customer).businessObjects[0];
					const customerID = customer.busObRecId;
					const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
					return res.json(JSON.parse(await CherwellAPI.createIncidentCovid19(customerID, formData, customerFullName)));
				} else {
					return res.json(JSON.parse(await CherwellAPI.createIncidentCovid19(null, formData, null)));
				}
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	updateRegApproval: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				const userAttributes = req.session.userAttributes;
				return res.json(JSON.parse(await CherwellAPI.updateRegApproval(userAttributes, formData, moment().toISOString())));
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	updateApproval: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				const userAttributes = req.session.userAttributes;
				return res.json(JSON.parse(await CherwellAPI.updateApproval(userAttributes, formData, moment().toISOString())));
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	updateIntent: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				const userAttributes = req.session.userAttributes;
				return res.json(JSON.parse(await CherwellAPI.updateIntent(userAttributes, formData, moment().toISOString())));
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	updateWaiver: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				const userAttributes = req.session.userAttributes;
				return res.json(JSON.parse(await CherwellAPI.updateWaiver(userAttributes, formData, moment().toISOString())));
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	updateContractDelegate: (req, res, next) => {

		const formData = req.body.formData;
		const userAttributes = req.session.userAttributes;
		return res.json(CherwellAPI.updateContractDelegate(userAttributes, formData));

	},
	updateCoi: (req, res, next) => {

		const formData = req.body.formData;
		const userAttributes = req.session.userAttributes;
		return res.json(CherwellAPI.updateCoi(userAttributes, formData));

	},
	updateCommencementRSVP: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				var busobj = await CherwellAPI.getBusinessObjectByRecID('9481e02f1260cf5b7e9b1e4855b144b5c1795b2a28', formData.RecID);
				busobj = JSON.parse(busobj);
				return res.json(await CherwellAPI.updateCommencementRSVP(req.user.employeeID, formData, busobj));
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	commencementTicketCheckIn: async(req, res, next) => {
		
		const formData = req.body.formData;

		var busobj = await CherwellAPI.getBusinessObjectByRecID('9481e2daa8766b783b868a448089fb5dff45111855', formData.RecID);
		busobj = JSON.parse(busobj);

		let commencementCounter = 0;
		var ticketOut = [];

		ticketOut[commencementCounter] = {};
		busobj.fields.map(function(prop){
			ticketOut[commencementCounter][prop.name] = prop.value;
		})
		commencementCounter++
		ticketOut = ticketOut[0];
		
		const ticketStatus = busobj.fields.find(f => f.name === 'TicketStatus')['value'];

		if(ticketStatus == "Void"){
			return res.json({"status": "Ticket Was Voided", ticketOut});
		}else if(ticketStatus == "Checked-In"){
			return res.json({"status": "Attendee Was Already Checked In", ticketOut});
		}else if(ticketStatus == "Ready"){

			CherwellAPI.commencementTicketCheckIn(req.user.employeeID, formData, moment().toISOString()).then(ticket => {
				return res.json({"status": "Successfully Checked In", ticketOut});

			}).catch(err => {
				return reject(err);
			});
			
		}
		

	},
	createCommencementGuest: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				var busobj = await CherwellAPI.getBusinessObjectByRecID('9481e02f1260cf5b7e9b1e4855b144b5c1795b2a28', formData.RecID);
				busobj = JSON.parse(busobj);

				const search = {
					filters: [
						{ // Customer ID
							fieldId: 'BO:9481e2daa8766b783b868a448089fb5dff45111855,FI:9481e2dc3b9228171a867346c987166875484246d3',
							operator: 'eq',
							value: formData.RecID
						}
					],
					association: 'CommencementRSVP',
					busObId: '9481e2daa8766b783b868a448089fb5dff45111855',
					includeAllFields: true,
					pageNumber: 0,
					pageSize: 0,
					scope: 'Global'
				};
	
				var activeTickets = await CherwellAPI.getSearchResults(search);
				if(activeTickets && JSON.parse(activeTickets).businessObjects.length){
					activeTickets = JSON.parse(activeTickets).businessObjects;
					activeTickets = activeTickets.filter(tickets => tickets.fields.find(f => f.name === 'TicketStatus')['value'] != "Void");
				}else{
					activeTickets = [];
				}
				try{
					return res.json(JSON.parse(await CherwellAPI.createCommencementGuest(req.user.employeeID, formData, busobj,activeTickets)))
				}catch(error){
					res.status(403).send(error.message)
				}
				


			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	getAllCommencementTitckets: (req, res, next) => {
		
		const search = {
			association: 'CommencementTicket',
			busObId: '9481e2daa8766b783b868a448089fb5dff45111855',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 50000,
			scope: 'Global'
		};

		CherwellAPI.getSearchResults(search).then(async results => {

			var ticketOut = [];
			if(results && JSON.parse(results).businessObjects.length){
				const tickets = JSON.parse(results).businessObjects;
				let commencementCounter = 0;

				for(var ticket of tickets){
					ticketOut[commencementCounter] = {};
					ticket.fields.map(function(prop){
						ticketOut[commencementCounter][prop.name] = prop.value;
					})
					commencementCounter++
				}
				res.set('Cache-Control', 'public, max-age=1800, s-maxage=1800');
				return res.json(ticketOut);
			}else{
				next(404);
				return null;
			}
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getCommencementAttendees: (req, res, next) => {
		
		const level =  req.params.level || "Undergraduate";
		const search = {
			filters: [
				{ // Status
					fieldId: 'BO:9481e02f1260cf5b7e9b1e4855b144b5c1795b2a28,FI:9481e0938f6dab5b6f0cd44043b0037cde28aff4e1',
					operator: 'eq',
					value: "Attending"
				},
				{ // Level
					fieldId: 'BO:9481e02f1260cf5b7e9b1e4855b144b5c1795b2a28,FI:9481e092e81cd3383784fd4970aad1bbe6d7b704d5',
					operator: 'eq',
					value: level
				}
			],
			association: 'CommencementRSVP',
			busObId: '9481e02f1260cf5b7e9b1e4855b144b5c1795b2a28',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 50000,
			scope: 'Global'
		};

		CherwellAPI.getSearchResults(search).then(async results => {

			var rsvpOut = [];
			if(results && JSON.parse(results).businessObjects.length){
				const rsvps = JSON.parse(results).businessObjects;
				let commencementCounter = 0;

				for(var rsvp of rsvps){
					rsvpOut[commencementCounter] = {};
					rsvp.fields.map(function(prop){
						rsvpOut[commencementCounter][prop.name] = prop.value;
					})
					commencementCounter++
				}
				const groupBy = (items, key) => items.reduce(
					(result, item) => ({
					  ...result,
					  [item[key]]: [
						...(result[item[key]] || []),
						item,
					  ],
					}), 
					{},
				  );
				  rsvpOut = groupBy(rsvpOut,"LineupRow");
				  
				  for (const [key, value] of Object.entries(rsvpOut)) {
					rsvpOut[key] = groupBy(value, "LineupMarch")

				  }
				
				res.render('meAgain/commencement-line-list.ejs', {
					rsvpOut,
					level
				});
				return null;
			}else{
				next(404);
				return null;
			}
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getTestDistribution: (req, res, next) => {
		if(req.params.id){
			const searchUser =  req.params.id;
			const currentUser = req.user.employeeID;

			const IntentSearch = {
				filters: [
					{ // Customer ID
						fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466566ca0de020a3e321a4e5aa940068abdc51ded',
						operator: 'eq',
						value: searchUser
					},
					{ // Term
						fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466567a186db597f329254cc9870bfe0e3e386a50',
						operator: 'eq',
						value: '202201'
					},
					{ // PTERM
						fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466567ac570751d1bd8644b2f90ec49ad378b5720',
						operator: 'eq',
						value: 'A'
					}
				],
				association: 'IntentSurvey',
				busObId: '946656451978e6e6dca4e34c149e5817f3e8c308fb',
				includeAllFields: true,
				pageNumber: 0,
				pageSize: 0,
				scope: 'Global'
			};
			
			CherwellAPI.getSearchResults(IntentSearch).then(async results => {
			
				if(results && JSON.parse(results).businessObjects.length){
					const intent = JSON.parse(results).businessObjects[0];
					const Results = {
						"ID": intent.fields.find(f => f.name === 'WPIID')['value'],
						"FullName": intent.fields.find(f => f.name === 'FullName')['value'],
						"TestingConsent": intent.fields.find(f => f.name === 'TestingConsent2022')['value'],
						"TestingConsentDate": intent.fields.find(f => f.name === 'TestingConsentDate2022')['value'],
						"TestingConsentExpirationDate": intent.fields.find(f => f.name === 'TestingConsentExpirationDate2022')['value'],
						"RecordType": intent.fields.find(f => f.name === 'RecordType')['value']
					}
					const TestAllocationSearch = {
						filters: [
							{ // Status
								fieldId: 'BO:94891eae54d2d97ba909044a8da89747c089ea3d01,FI:94891ecfe5bcc6208d0fd74a4e8d0623683e993f5b',
								operator: 'eq',
								value: searchUser
							}
							
						],
						association: 'CovidTestAllocation',
						busObId: '94891eae54d2d97ba909044a8da89747c089ea3d01',
						includeAllFields: true,
						pageNumber: 0,
						pageSize: 50000,
						scope: 'Global'
					};
					const testsResults = await CherwellAPI.getSearchResults(TestAllocationSearch);
			
					var testOut = [];
					if(testsResults && JSON.parse(testsResults).businessObjects.length){
						const tests = JSON.parse(testsResults).businessObjects;
						let testCounter = 0;
			
						for(var test of tests){
							testOut[testCounter] = {};
							test.fields.map(function(prop){
								testOut[testCounter][prop.name] = prop.value;
							})
							testCounter++
						}
			
					}
					Results.Tests = testOut;
					Results.Distributed = testOut.map(item => parseInt(item.Quantity)).reduce((prev, curr) => prev + curr, 0)
					if(Results.RecordType == 'Student'){
						Results.Allocated = 4;
					}else if(Results.RecordType == 'Employee'){
						Results.Allocated = 2;
					}else{
						Results.Allocated = 0;
					}
					
					Results.Remaining = Results.Allocated - Results.Distributed;
					
			
					return res.json(Results)
				}else{
					return res.status(404).json(
						{
							status: 404,
							reason: 'No record found for provided WPI ID'
						}
					);
				}
			}).catch(err => {
				next(err);
				return null;
			});
			}
	},
	voidCommencementGuest: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				return res.json(JSON.parse(await CherwellAPI.voidCommencementGuest(req.user.employeeID, formData)))
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	updateCommencementAcknowledgement: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				const userAttributes = req.session.userAttributes;
				return res.json(JSON.parse(await CherwellAPI.updateCommencementAcknowledgement(userAttributes, formData, moment().toISOString())));
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	updateCommencementVirtual: async(req, res, next) => {
			const formData = req.body.fields;
			const file = req.files[0];
			const userAttributes = req.session.userAttributes;
			return res.json(await CherwellAPI.updateCommencementVirtual(userAttributes, formData, file));

	},
	updateREU: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				const userAttributes = req.session.userAttributes;
				return res.json(JSON.parse(await CherwellAPI.updateREU(userAttributes, formData, moment().toISOString())));
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},

	createIncidentCovid19Add: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				if (req.isAuthenticated()) {
					let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
					customer = JSON.parse(customer).businessObjects[0];
					const customerID = customer.busObRecId;
					const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
					return res.json(JSON.parse(await CherwellAPI.createIncidentCovid19Add(customerID, formData, customerFullName)));
				} else {
					return res.json(JSON.parse(await CherwellAPI.createIncidentCovid19Add(null, formData, null)));
				}
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	createIncidentCovid19ExternalAdd: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				if (req.isAuthenticated()) {
					let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
					customer = JSON.parse(customer).businessObjects[0];
					const customerID = customer.busObRecId;
					const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
					return res.json(JSON.parse(await CherwellAPI.createIncidentCovid19ExternalAdd(customerID, formData, customerFullName)));
				} else {
					return res.json(JSON.parse(await CherwellAPI.createIncidentCovid19ExternalAdd(null, formData, null)));
				}
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	createIncidentCovid19HumansAdd: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				if (req.isAuthenticated()) {
					let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
					customer = JSON.parse(customer).businessObjects[0];
					const customerID = customer.busObRecId;
					const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
					return res.json(JSON.parse(await CherwellAPI.createIncidentCovid19HumansAdd(customerID, formData, customerFullName)));
				} else {
					return res.json(JSON.parse(await CherwellAPI.createIncidentCovid19HumansAdd(null, formData, null)));
				}
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	createIncidentCovid19ResearchCont: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				if (req.isAuthenticated()) {
					let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
					customer = JSON.parse(customer).businessObjects[0];
					const customerID = customer.busObRecId;
					const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
					return res.json(JSON.parse(await CherwellAPI.createIncidentCovid19ResearchCont(customerID, formData, customerFullName)));
				} else {
					return res.json(JSON.parse(await CherwellAPI.createIncidentCovid19ResearchCont(null, formData, null)));
				}
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	createIncidentCovid19Department: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				if (req.isAuthenticated()) {
					let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
					customer = JSON.parse(customer).businessObjects[0];
					const customerID = customer.busObRecId;
					const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
					return res.json(JSON.parse(await CherwellAPI.createIncidentCovid19Department(customerID, formData, customerFullName)));
				} else {
					return res.json(JSON.parse(await CherwellAPI.createIncidentCovid19Department(null, formData, null)));
				}
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	createIncidentNSO: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				if (req.isAuthenticated()) {
					let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
					customer = JSON.parse(customer).businessObjects[0];
					const customerID = customer.busObRecId;
					const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
					return res.json(JSON.parse(await CherwellAPI.createIncidentNSO(customerID, formData, customerFullName)));
				} else {
					return res.json(JSON.parse(await CherwellAPI.createIncidentNSO(null, formData, null)));
				}
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	changeTest: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				if (req.isAuthenticated()) {
					let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
					customer = JSON.parse(customer).businessObjects[0];
					const customerID = customer.busObRecId;
					const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
					return res.json(JSON.parse(await CherwellAPI.createIncidentChangeTest(customerID, formData, customerFullName)));
				} else {
					return res.json(JSON.parse(await CherwellAPI.createIncidentChangeTest(null, formData, null)));
				}
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	changeArrival: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				if (req.isAuthenticated()) {
					let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
					customer = JSON.parse(customer).businessObjects[0];
					const customerID = customer.busObRecId;
					const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
					return res.json(JSON.parse(await CherwellAPI.createIncidentChangeArrival(customerID, formData, customerFullName)));
				} else {
					return res.json(JSON.parse(await CherwellAPI.createIncidentChangeArrival(null, formData, null)));
				}
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	changeOnboarding: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				if (req.isAuthenticated()) {
					let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
					customer = JSON.parse(customer).businessObjects[0];
					const customerID = customer.busObRecId;
					const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
					return res.json(JSON.parse(await CherwellAPI.createIncidentChangeOnboarding(customerID, formData, customerFullName)));
				} else {
					return res.json(JSON.parse(await CherwellAPI.createIncidentChangeOnboarding(null, formData, null)));
				}
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	createIncidentGradeFormat: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				if (req.isAuthenticated()) {
					let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
					customer = JSON.parse(customer).businessObjects[0];
					const customerID = customer.busObRecId;
					const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
					return res.json(JSON.parse(await CherwellAPI.createIncidentGradeFormat(customerID, formData, customerFullName, req.user.employeeID)));
				} else {
					return res.json(JSON.parse(await CherwellAPI.createIncidentGradeFormat(null, formData, null, null)));
				}
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	createIncidentIntentToGrad: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				if (req.isAuthenticated()) {
					let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
					customer = JSON.parse(customer).businessObjects[0];
					const customerID = customer.busObRecId;
					const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
					return res.json(JSON.parse(await CherwellAPI.createIncidentIntentToGrad(customerID, formData, customerFullName, req.user.employeeID)));
				} else {
					return res.json(JSON.parse(await CherwellAPI.createIncidentIntentToGrad(null, formData, null, null)));
				}
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	createIncidentStudentFlag: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				if (req.isAuthenticated()) {
					let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
					customer = JSON.parse(customer).businessObjects[0];
					const customerID = customer.busObRecId;
					const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
					return res.json(JSON.parse(await CherwellAPI.createIncidentStudentFlag(customerID, formData, customerFullName, req.user.employeeID)));
				} else {
					return res.json(JSON.parse(await CherwellAPI.createIncidentStudentFlag(null, formData, null, null)));
				}
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	createIncidentWorkdayRequest: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				if (req.isAuthenticated()) {
					let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
					customer = JSON.parse(customer).businessObjects[0];
					const customerID = customer.busObRecId;
					const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
					return res.json(JSON.parse(await CherwellAPI.createIncidentWorkdayRequest(customerID, formData, customerFullName, req.user.employeeID)));
				} else {
					return res.json(JSON.parse(await CherwellAPI.createIncidentWorkdayRequest(null, formData, null, null)));
				}
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	createIncidentSoftwareRequest: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				if (req.isAuthenticated()) {
					let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
					customer = JSON.parse(customer).businessObjects[0];
					const customerID = customer.busObRecId;
					const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
					return res.json(JSON.parse(await CherwellAPI.createIncidentSoftwareRequest(customerID, formData, customerFullName, req.user.employeeID)));
				} else {
					return res.json(JSON.parse(await CherwellAPI.createIncidentSoftwareRequest(null, formData, null, null)));
				}
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	createIncidentCommencement: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				if (req.isAuthenticated()) {
					let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
					customer = JSON.parse(customer).businessObjects[0];
					const customerID = customer.busObRecId;
					const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
					return res.json(JSON.parse(await CherwellAPI.createIncidentCommencement(customerID, formData, customerFullName, req.user.employeeID)));
				} else {
					return res.json(JSON.parse(await CherwellAPI.createIncidentCommencement(null, formData, null, null)));
				}
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	createIncidentAddDrop: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				if (req.isAuthenticated()) {
					let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
					customer = JSON.parse(customer).businessObjects[0];
					const customerID = customer.busObRecId;
					const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
					return res.json(JSON.parse(await CherwellAPI.createIncidentAddDrop(customerID, formData, customerFullName)));
				} else {
					return res.json(JSON.parse(await CherwellAPI.createIncidentAddDrop(null, formData, null)));
				}
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	createIncidentStudentIntent: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				if (req.isAuthenticated()) {
					let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
					customer = JSON.parse(customer).businessObjects[0];
					const customerID = customer.busObRecId;
					const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
					return res.json(JSON.parse(await CherwellAPI.createIncidentStudentIntent(customerID, formData, customerFullName, req.user.employeeID)));
				} else {
					return res.json(JSON.parse(await CherwellAPI.createIncidentStudentIntent(null, formData, null, null)));
				}
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	createCovidLog: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
					return res.json(JSON.parse(await CherwellAPI.createCovidLog(formData)));
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	createCovidCase: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
					return res.json(JSON.parse(await CherwellAPI.createCovidCase(formData,req.user.employeeID)));
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	createCovidClear: (req, res, next) => {
		const formData = req.body.formData;
		CherwellAPI.createCovidClear(formData,req.user.employeeID).then(resp =>{
			return res.json(JSON.parse(resp));
		}).catch(err => {
			next(err);
		});
		return
			
	},
	createSwipeRecord: (req, res, next) => {

		const formData = req.body;

		CherwellAPI.createSwipeRecord(formData).then(ticket => {
			return res.json(JSON.parse(ticket));
		}).catch(err => {
			next(err);
		});
		return
	},
	createAllocationRecord: (req, res, next) => {
		const formData = req.body;
		CherwellAPI.createAllocationRecord(formData).then(allocation => {
			return res.json(JSON.parse(allocation));
		}).catch(err => {
			next(err);
		});
		return
	},
	createCovidDeptLog: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
					return res.json(JSON.parse(await CherwellAPI.createCovidDeptLog(formData)));
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	createCovidVisitor: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
					return res.json(JSON.parse(await CherwellAPI.createCovidVisitor(formData)));
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	createIncidentWithAsset: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
				customer = JSON.parse(customer).businessObjects[0];
				const customerID = customer.busObRecId;
				const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
				const assetBusObRecId = JSON.parse(await CherwellAPI.getBusinessObject(CherwellAPI.configurationItemObjectIds.ConfigurationItem, req.body.assetTag)).busObRecId;
				return res.json(JSON.parse(await CherwellAPI.createIncidentWithAsset(customerID, formData, customerFullName, assetBusObRecId)));
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	getUserAttributes: (req, res, next) => {
		CherwellAPI.getCustomerByID(req.user.employeeID).then(result => {
			return res.json(JSON.parse(result));
		}).catch(err => {
			return next(err);
		});
	},
	getWaiverStatusOne: async(req, res, next) => {
		if(req.params.publicID){
			const search = {
				filters: [
					{ // Customer ID
						fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466566ca0de020a3e321a4e5aa940068abdc51ded',
						operator: 'eq',
						value: req.params.publicID
					},
					{ // Term
						fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466567a186db597f329254cc9870bfe0e3e386a50',
						operator: 'eq',
						value: '202201'
					},
					{ // PTERM
						fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466567ac570751d1bd8644b2f90ec49ad378b5720',
						operator: 'eq',
						value: 'A'
					}
				],
				association: 'IntentSurvey',
				busObId: '946656451978e6e6dca4e34c149e5817f3e8c308fb',
				includeAllFields: true,
				pageNumber: 0,
				pageSize: 0,
				scope: 'Global'
			};

			CherwellAPI.getSearchResults(search).then(async results => {

				if(results && JSON.parse(results).businessObjects.length){
					const intent = JSON.parse(results).businessObjects[0];
					const Results = {
						"ID": intent.fields.find(f => f.name === 'WPIID')['value'],
						"TestingConsent": intent.fields.find(f => f.name === 'TestingConsent2022')['value'],
						"TestingConsentDate": intent.fields.find(f => f.name === 'TestingConsentDate2022')['value'],
						"TestingConsentExpirationDate": intent.fields.find(f => f.name === 'TestingConsentExpirationDate2022')['value'],
					}
					return res.json(Results);
				}else{
					return res.status(404).json(
						{
							status: 404,
							reason: 'No record found for provided WPI ID'
						}
					);
				}
			}).catch(err => {
				next(err);
				return null;
			});
		}else{
			return res.status(400).json(
				{
					status: 400,
					reason: 'Missing ID Parameter'
				}
			);
		}
	},
	
	getWaiverStatusAll: async(req, res, next) => {
		const search = {
			filters: [
				{ // Term
					fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466567a186db597f329254cc9870bfe0e3e386a50',
					operator: 'eq',
					value: '202201'
				},
				{ // PTERM
					fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466567ac570751d1bd8644b2f90ec49ad378b5720',
					operator: 'eq',
					value: 'A'
				}
			],
			association: 'IntentSurvey',
			busObId: '946656451978e6e6dca4e34c149e5817f3e8c308fb',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 50000,
			scope: 'Global'
		};

		CherwellAPI.getSearchResults(search).then(async results => {

			if(results && JSON.parse(results).businessObjects.length){
				const intents = JSON.parse(results).businessObjects;
				let Results = [];
				for(intent of intents){
					Result = {
						"ID": intent.fields.find(f => f.name === 'WPIID')['value'],
						"TestingConsent": intent.fields.find(f => f.name === 'TestingConsent')['value'],
						"TestingConsentDate": intent.fields.find(f => f.name === 'TestingConsentDate')['value'],
						"TestingConsentExpirationDate": intent.fields.find(f => f.name === 'TestingConsentExpirationDate')['value'],
					}
					Results.push(Result);
				}

				return res.json(Results);
			}else{
				next(404);
				return null;
			}
		}).catch(err => {
			next(err);
			return null;
		});
	},
	renderIncidentById: async(req, res, next) => {
		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		return CherwellAPI.getBusinessObject('6dd53665c0c24cab86870a21cf6434ae', req.params.publicID).then(async ticket => {
			ticket = JSON.parse(ticket);

			const allowed = incidentFilter(ticket);
			if (!allowed) {
				next(404);
				return null;
			}
			allApprovers = await CherwellAPI.getRelatedBusinessObjects(ticket.busObId, ticket.busObRecId, '94644c99820219f13ccfe24f6ebcab36bfd74e4250');
			allApprovers = JSON.parse(allApprovers).relatedBusinessObjects;
			let approverIDs = [];
			for(const Approvers of allApprovers){
				approverIDs.push(Approvers.fields.find(f => f.name === 'ApproverRecID')['value'])
			}

			let canViewTicket = false;
			if (ticket.fields.filter(field => field.fieldId === 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f')[0].value === customer.busObRecId) {
				canViewTicket = true;
			} else if (JSON.parse(await CherwellAPI.getRelatedBusinessObjects(ticket.busObId, ticket.busObRecId, '944e4761878a81223d36c24340bf57e2b93a78effb')).relatedBusinessObjects.findIndex(subscriber => subscriber.busObRecId === customer.busObRecId) !== -1) {
				canViewTicket = true;
			} else if (approverIDs.includes(customer.busObRecId)) {
				canViewTicket = true;
			} else{
				try{
					canViewTicket = await G.checkPermissions({req, entity: 'ticket', level: 'read'})
				}catch(err){
					canViewTicket = false;
				}
			}
			if (canViewTicket) {
				const portalJournals = JSON.parse(await CherwellAPI.getRelatedBusinessObjectsWithGrid(ticket.busObId, ticket.busObRecId, '945418ae91b95e806c95404c33a225be2d9b4f402c', '9453426bcf43c89b2a74b4403581034c55ca2b5f93')).relatedBusinessObjects;
				const subscribers = JSON.parse(await CherwellAPI.getRelatedBusinessObjects(ticket.busObId, ticket.busObRecId, '944e4761878a81223d36c24340bf57e2b93a78effb')).relatedBusinessObjects;
				const requester = JSON.parse(await CherwellAPI.getRelatedBusinessObjects(ticket.busObId, ticket.busObRecId, '933bd532351a43642c990a4b38933ffc579741fc02')).relatedBusinessObjects[0];
				const regApprovals = JSON.parse(await CherwellAPI.getRelatedBusinessObjects(ticket.busObId, ticket.busObRecId, '94644c99820219f13ccfe24f6ebcab36bfd74e4250')).relatedBusinessObjects;
				const employeeID = requester.fields.find(f => f.name === 'EmployeeID')['value'];
				User.findOne(
					{
						where: {
							employeeID
						}
					}
				).then(requesterUser => {
					res.render('cherwell/ticket/view.ejs', {
						ticket,
						portalJournals,
						subscribers,
						requester,
						regApprovals,
						requesterUser
					});
					return null;
				}).catch(err => {
					next(err);
					return null;
				});
			} else {
				return next(403);
			}
		}).catch(err => {
			errorMessage = JSON.parse(err.response.body);
			if(errorMessage.hasError && errorMessage.errorCode == "RECORDNOTFOUND"){
				return next(404);
			}
			next(err);
			return null;
		});
	},
	renderApprovalById: async(req, res, next) => {
		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		return CherwellAPI.getBusinessObjectByRecID('9465996db3ca51cce7e8aa47d8baa52b3ad8672f00', req.params.recID).then(async approval => {
			approval = JSON.parse(approval);

			let canViewTicket = false;

			if (approval.fields.filter(field => field.fieldId === 'BO:9465996db3ca51cce7e8aa47d8baa52b3ad8672f00,FI:94659975d46f9c6da160594068858e4cb769cbff4d')[0].value === customer.busObRecId) {
				canViewTicket = true;
			} else if (await G.checkPermissions({req, entity: 'ticket', level: 'read'})) {
				canViewTicket = true;
			}
			if (canViewTicket) {
					res.render('cherwell/approval/view.ejs', {
						approval,
					});
					return null;

			} else {
				return next(403);
			}
		}).catch(err => {
			next(err);
			return null;
		});
	},
	renderIntentById: async(req, res, next) => {
		if(req.session.userAttributes["user.employeeNumber"].length){

			let customer = await CherwellAPI.getCustomerByID(req.user.employeeID).catch(err =>{
				logger.err(err);
				return next(400)
			});


			customer = JSON.parse(customer).businessObjects[0];

			return CherwellAPI.getBusinessObjectByRecID('946656451978e6e6dca4e34c149e5817f3e8c308fb', req.params.recID).then(async intent => {
				intent = JSON.parse(intent);

				let canViewTicket = false;

				if (intent.fields.filter(field => field.fieldId === 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466567347caca43937b04405d8d876b850c0c97a6')[0].value === customer.busObRecId) {
					canViewTicket = true;
				}else if (await G.checkPermissions({req, entity: 'ticket', level: 'read'})) {
					canViewTicket = true;
				}
				if (canViewTicket) {
						res.render('cherwell/intent/view.ejs', {
							intent,
							query : req.query
						});
						return null;

				} else {
					return next(403);
				}
			}).catch(err => {
				next(err);
				return null;
			});
		}else{
			return next(400)
		}
	},
	renderWaiverById: async(req, res, next) => {
		if(req.user.employeeID){
			
			let customer = await CherwellAPI.getCustomerByID(req.user.employeeID).catch(err =>{
				logger.err(err);
				return next(400)
			});

			customer = JSON.parse(customer).businessObjects[0];

			return CherwellAPI.getBusinessObjectByRecID('946656451978e6e6dca4e34c149e5817f3e8c308fb', req.params.recID).then(async intent => {
				intent = JSON.parse(intent);

				let canViewTicket = false;

				if (intent.fields.filter(field => field.fieldId === 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466567347caca43937b04405d8d876b850c0c97a6')[0].value === customer.busObRecId) {
					canViewTicket = true;
				}else if (intent.fields.filter(field => field.fieldId === 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9474ba4b028e607c526a8c468f8a928db1e8f052a6')[0].value === "True") {
					canViewTicket = true;
				}else if (await G.checkPermissions({req, entity: 'ticket', level: 'read'})) {
					canViewTicket = true;
				}
				if (canViewTicket) {
						res.render('cherwell/waiver/view.ejs', {
							intent,
							query : req.query
						});
						return null;

				} else {
					return next(403);
				}
			}).catch(err => {
				next(err);
				return null;
			});
		}else{
			return next(400)
		}
	},
	renderContractDelegateById: async(req, res, next) => {
		if(req.user.employeeID){
			
			let customer = await CherwellAPI.getCustomerByID(req.user.employeeID).catch(err =>{
				logger.err(err);
				return next(400)
			});

			customer = JSON.parse(customer).businessObjects[0];
			// Check if rec id is provided
			if(!req.params.recID){
				res.render('cherwell/contractDelegate/view.ejs', {
					existing:false,
					customer,
					contractOut: null,
					title:'New Contract Delegation'
				});
				return null;
			}else{
				return CherwellAPI.getBusinessObjectByRecID('948c105be76790c672e88449c3bfc3ba90da8e30b6', req.params.recID).then(async contract => {
					var contractOut = [];
					if(contract){
						contract = JSON.parse(contract);

						contract.fields.map(function(prop){
							contractOut[prop.name] = prop.value;
						})
						
			
					}

					let canViewTicket = false;
					//delegator
					if (contractOut.DelegatorRecID === customer.busObRecId) {
						canViewTicket = true;
					}else if (contractOut.DelegateeRecID === customer.busObRecId) { //delegatee
						canViewTicket = true;
					}
					if (canViewTicket) {
							res.render('cherwell/contractDelegate/view.ejs', {
								contractOut,
								existing:true,
								customer,
								query : req.query
							});
							return null;

					} else {
						return next(403);
					}
				}).catch(err => {
					next(err);
					return null;
				});
			}
		}else{
			return next(400)
		}
	},
	renderCoiById: async(req, res, next) => {
		if(req.user.employeeID){
			
			let customer = await CherwellAPI.getCustomerByID(req.user.employeeID).catch(err =>{
				logger.err(err);
				return next(400)
			});

			customer = JSON.parse(customer).businessObjects[0];
			// Check if rec id is provided
			if(!req.params.recID){
				res.render('cherwell/contractDelegate/view.ejs', {
					existing:false,
					customer,
					coiOut: null,
					title:'New Conflict of Interest'
				});
				return null;
			}else{
				return CherwellAPI.getBusinessObjectByRecID('948c105be76790c672e88449c3bfc3ba90da8e30b6', req.params.recID).then(async coi => {
					var coiOut = [];
					if(coi){
						coi = JSON.parse(coi);

						coi.fields.map(function(prop){
							coiOut[prop.name] = prop.value;
						})	
			
					}

					let canViewTicket = false;

					if (canViewTicket) {
							res.render('cherwell/coi/view.ejs', {
								coiOut,
								existing:true,
								customer,
								query : req.query
							});
							return null;

					} else {
						return next(403);
					}
				}).catch(err => {
					next(err);
					return null;
				});
			}
		}else{
			return next(400)
		}
	},

	renderCommencementById: async(req, res, next) => {
		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID).catch(err =>{
			logger.err(err);
			return next(400)
		});
		customer = JSON.parse(customer).businessObjects[0];

		if(!req.params.recID){
			const search = {
				filters: [
					{ // Customer
						fieldId: 'BO:946f2d8bcefc7371a40f794ec08278d036c7348cb0,FI:946f2d9714af2aad0658984db2a379bff917f2046e',
						operator: 'eq',
						value: customer.busObRecId
					}
				],
				association: 'CommencementForm',
				busObId: '946f2d8bcefc7371a40f794ec08278d036c7348cb0',
				includeAllFields: true,
				pageNumber: 0,
				pageSize: 0,
				scope: 'Global'
			};

			CherwellAPI.getSearchResults(search).then(async results => {
				if(results && JSON.parse(results).businessObjects.length){
				const commenceRecID = JSON.parse(results).businessObjects[0].busObRecId;

					return res.redirect(url.format({
						pathname: `/io/Commencement-RSVP/${commenceRecID}`,
						query: req.query
					}));
				}else{
					res.render('cherwell/commencement/view.ejs', {
						commencement: false
					});
					return null;
				}
			}).catch(err => {
				next(err);
				return null;
			});
		}else{
			return CherwellAPI.getBusinessObjectByRecID('946f2d8bcefc7371a40f794ec08278d036c7348cb0', req.params.recID).then(async commencement => {
				commencement = JSON.parse(commencement);

				let canViewTicket = false;

				if (commencement.fields.filter(field => field.fieldId === 'BO:946f2d8bcefc7371a40f794ec08278d036c7348cb0,FI:946f2d9714af2aad0658984db2a379bff917f2046e')[0].value === customer.busObRecId) {
					canViewTicket = true;
				}else if (await G.checkPermissions({req, entity: 'ticket', level: 'read'})) {
					canViewTicket = true;
				}
				if (canViewTicket) {
						res.render('cherwell/commencement/view.ejs', {
							commencement
						});
						return null;

				} else {
					return next(403);
				}
			}).catch(err => {
				next(err);
				return null;
			});
		}

	},
	renderOnboardingById: async(req, res, next) => {
		let customer = await CherwellAPI.getWorkdayCustomerByID(req.user.employeeID).catch(err =>{
			logger.err(err);
			return next(400)
		});
		customer = JSON.parse(customer).businessObjects[0];
		

		if(!req.params.recID){

		}else{
			const serviceSearch = {
				filters: [
					{ // Customer
						fieldId: 'BO:947bc21722b93982456bcf4af69108a73a5ae50db3,FI:947bc279dcce4279f692384fb992efc4ea39bf1d7f',
						operator: 'eq',
						value: 'Active'
					}
				],
				association: 'ServiceRequest',
				busObId: '947bc21722b93982456bcf4af69108a73a5ae50db3',
				includeAllFields: true,
				pageNumber: 0,
				pageSize: 0,
				scope: 'Global'
			};
			let serviceRequests = await CherwellAPI.getSearchResults(serviceSearch);
			let serviceRequestsOut = [];
			serviceRequests = JSON.parse(serviceRequests).businessObjects;

			if(serviceRequests !== undefined && serviceRequests !== null && serviceRequests.length){
				let serviceCounter = 0;
				for(serviceItem of serviceRequests){
					serviceRequestsOut[serviceCounter] = {};
					serviceItem.fields.map(function(prop){
						serviceRequestsOut[serviceCounter][prop.name] = prop.value;
					})
					serviceCounter++
				}
			}else{
				serviceRequestsOut = null;
			}

			const serviceFieldSearch = {
				association: 'ServiceRequestField',
				busObId: '947bc221f7a60c3a4883de49a8a29574df7f49fe5b',
				includeAllFields: true,
				pageNumber: 0,
				pageSize: 0,
				scope: 'Global'
			};
			let serviceRequestFields = await CherwellAPI.getSearchResults(serviceFieldSearch);
			let serviceRequestFieldsOut = [];
			serviceRequestFields = JSON.parse(serviceRequestFields).businessObjects;

			if(serviceRequestFields !== undefined && serviceRequestFields !== null && serviceRequestFields.length){
				let serviceFieldCounter = 0;
				for(serviceFieldItem of serviceRequestFields){
					serviceRequestFieldsOut[serviceFieldCounter] = {};
					serviceFieldItem.fields.map(function(prop){
						serviceRequestFieldsOut[serviceFieldCounter][prop.name] = prop.value;
					})
					serviceFieldCounter++
				}
			}else{
				serviceRequestFieldsOut = null;
			}
			let onboardingTicket = await CherwellAPI.getBusinessObjectByRecID('947bc18b54a3156f4ab02f452ba1c6eb1bed930a4b', req.params.recID)
			let onboardingTicketOut = [];
			onboardingTicket = [JSON.parse(onboardingTicket)];

			if(onboardingTicket !== undefined && onboardingTicket !== null && onboardingTicket.length){
				let onboardCounter = 0;
				for(onboardingItem of onboardingTicket){
					onboardingTicketOut[onboardCounter] = {};
					onboardingItem.fields.map(function(prop){
						onboardingTicketOut[onboardCounter][prop.name] = prop.value;
					})
					onboardCounter++
				}
				onboardingTicketOut = onboardingTicketOut[0]
			}else{
				onboardingTicketOut = null;
			}

			let onboardingTasks = await CherwellAPI.getRelatedBusinessObjects('947bc18b54a3156f4ab02f452ba1c6eb1bed930a4b', req.params.recID, '947bc24c3bd0998c10a3cf4673bd639e53c1714a4e');
			let onboardingTasksOut = [];
			onboardingTasks = JSON.parse(onboardingTasks).relatedBusinessObjects;

			if(onboardingTasks !== undefined && onboardingTasks !== null && onboardingTasks.length){
				let taskCounter = 0;
				for(onboardingTask of onboardingTasks){
					onboardingTasksOut[taskCounter] = {};
					onboardingTask.fields.map(function(prop){
						onboardingTasksOut[taskCounter][prop.name] = prop.value;
					})
					taskCounter++
				}
			}else{
				onboardingTasksOut = null;
			}
			res.render('cherwell/onboarding/onboarding.ejs', {
				commencement: false,
				serviceRequestsOut,
				onboardingTicketOut,
				onboardingTasksOut,
				serviceRequestFieldsOut
			});
			return null;
		}

	},
	renderCommencementVirtual: async(req, res, next) => {
		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID).catch(err =>{
			logger.err(err);
			return next(400)
		});
		customer = JSON.parse(customer).businessObjects[0];

		if(!req.params.recID){
			const search = {
				filters: [
					{ // Customer
						fieldId: 'BO:946f2d8bcefc7371a40f794ec08278d036c7348cb0,FI:946f2d9714af2aad0658984db2a379bff917f2046e',
						operator: 'eq',
						value: customer.busObRecId
					}
				],
				association: 'CommencementForm',
				busObId: '946f2d8bcefc7371a40f794ec08278d036c7348cb0',
				includeAllFields: true,
				pageNumber: 0,
				pageSize: 0,
				scope: 'Global'
			};

			CherwellAPI.getSearchResults(search).then(async results => {
				if(results && JSON.parse(results).businessObjects.length){
				const commenceRecID = JSON.parse(results).businessObjects[0].busObRecId;

					return res.redirect(url.format({
						pathname: `/io/Commencement-Virtual/${commenceRecID}`,
						query: req.query
					}));
				}else{
					res.render('cherwell/commencement/virtual.ejs', {
						commencement: false
					});
					return null;
				}
			}).catch(err => {
				next(err);
				return null;
			});
		}else{
			return CherwellAPI.getBusinessObjectByRecID('946f2d8bcefc7371a40f794ec08278d036c7348cb0', req.params.recID).then(async commencement => {
				commencement = JSON.parse(commencement);

				let canViewTicket = false;

				if (commencement.fields.filter(field => field.fieldId === 'BO:946f2d8bcefc7371a40f794ec08278d036c7348cb0,FI:946f2d9714af2aad0658984db2a379bff917f2046e')[0].value === customer.busObRecId) {
					canViewTicket = true;
				}else if (await G.checkPermissions({req, entity: 'ticket', level: 'read'})) {
					canViewTicket = true;
				}
				if (canViewTicket) {
						res.render('cherwell/commencement/virtual.ejs', {
							commencement
						});
						return null;

				} else {
					return next(403);
				}
			}).catch(err => {
				next(err);
				return null;
			});
		}

	},
	renderCommencementAcknowledgement: async(req, res, next) => {
		
		let formType = '';
		if(!req.params.recID){
			formType = "Router";

			res.render('cherwell/commencement/attestation.ejs', {
				formType,
				CAForm:false
			});
			return null;

		}else{
			if(req.params.recID == 'Grad'){

				formType = "Graduate";
				//GradForm
				if (req.isAuthenticated()) {
					res.render('cherwell/commencement/attestation.ejs', {
						formType,
						CAForm:false
					});
					return null;
				} else {
					req.session['saml-referrer'] = req.baseUrl + req.path;
					return res.redirect('/login');
				}
				
			}else if(req.params.recID == 'New'){
				formType = "Unknown";
				//New Form
				res.render('cherwell/commencement/attestation.ejs', {
					formType,
					CAForm:false
				});
				return null;
			}else{
				formType = "Guest";
				//Guid Lookup
				return CherwellAPI.getBusinessObjectByRecID('9471b2f910d1a1cc5991e94d4b916c59096f6b946f', req.params.recID).then(async CAForm => {
				CAForm = JSON.parse(CAForm);

						res.render('cherwell/commencement/attestation.ejs', {
							formType,
							CAForm
						});
						return null;

				}).catch(err => {
					next(err);
					return null;
				});
			}

		}

	},
	getCommencementAcknowledgement: async(req, res, next) => {
		
		let caFilter = []; 
		if(!req.params.recordLocator){
			return next(400)
		}else{
			caFilter.push(
				{ // recordLc
					fieldId: 'BO:9471b2f910d1a1cc5991e94d4b916c59096f6b946f,FI:9471b2fee6f97cd8c538f94bf6b7fd9c0a5077879c',
					operator: 'eq',
					value: req.params.recordLocator
				}
			);
			const CASearch = {
				filters:caFilter,
				busObId: '9471b2f910d1a1cc5991e94d4b916c59096f6b946f',
				includeAllFields: true,
				pageNumber: 0,
				pageSize: 0,
				scope: 'Global'
			};

			return CherwellAPI.getSearchResults(CASearch).then(async CARecord => {

				CARecord = JSON.parse(CARecord).businessObjects[0];

				let CAReturn = {
					RecID: CARecord.fields.find(f => f.name === 'RecID')['value'],
					Status: CARecord.fields.find(f => f.name === 'Status')['value']
				}
				return res.json(CAReturn)
			})

			
		}

	},
	renderREUById: async(req, res, next) => {

		if(!req.params.recID){
			res.render('forms/research-reu/view.ejs', {
				isEditor: false,
				reuID: false
			});
			return null;
		}else{
			const editors = ["791405460","687703172","843453664","700406148","752261007","501145476","590839509","858978580","500587552","212278174","240980608","412663119","392439620","872164925","197168882","770717098","501559463","718836593","349768965","894748957"];
			if(req.user.employeeID){
				// check if they can edit here.
			}
			return CherwellAPI.getBusinessObjectByRecID('947051628214740ec43be6439cb5c437f11ea10ed9', req.params.recID).then(async reuForm => {
				reuForm = JSON.parse(reuForm);

				let canViewTicket = false;
				let isEditor = false;
				// If WPI on form matches current user
				if (reuForm.fields.filter(field => field.fieldId === 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:9470521baf5f6110b335894a3ca62e6045b663e4f1')[0].value === req.user.employeeID) {
					canViewTicket = true;
				}
				if(editors.includes(req.user.employeeID)){ 
					canViewTicket = true;
					isEditor = true;
				}
				if (canViewTicket) {
						res.render('forms/research-reu/view.ejs', {
							reuForm,
							isEditor,
							reuID: req.params.recID
						});
						return null;

				} else {
					return next(403);
				}
			}).catch(err => {
				next(err);
				return null;
			});
		}

	},
	renderREUDash: async(req, res, next) => {
		const currentUser = req.user.employeeID;
		const editors = ["791405460","687703172","843453664","700406148","752261007","501145476","590839509","858978580","500587552","212278174","240980608","412663119","392439620","872164925","197168882","770717098","501559463","718836593","349768965","894748957"];

		let deptQuery = "";
		let multiDept = false;
		let reuFilter = []; 

		if(editors.includes(currentUser)){
			if(currentUser == "791405460" || currentUser == "501145476" || currentUser == "240980608"){
				deptQuery = "Chemistry & Biochemistry";
				reuFilter.push(
					{ // Department
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947052491686b157a42fa44ba79c0ec9c124bbfff6',
						operator: 'eq',
						value: deptQuery
					}
				);
			}
			if(currentUser == "687703172" || currentUser == "590839509" || currentUser == "412663119" || currentUser == "392439620" || currentUser == "872164925"){
				deptQuery = "Developing a Clean Energy Future";
				reuFilter.push(
					{ // Department
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947052491686b157a42fa44ba79c0ec9c124bbfff6',
						operator: 'eq',
						value: deptQuery
					}
				);
			}
			if(currentUser == "843453664" || currentUser == "858978580" || currentUser == "197168882" || currentUser == "500587552"){
				deptQuery = "Industrial Math & Stats";
				reuFilter.push(
					{ // Department
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947052491686b157a42fa44ba79c0ec9c124bbfff6',
						operator: 'eq',
						value: deptQuery
					}
				);
			}
			if(currentUser == "700406148" || currentUser == "212278174" || currentUser == "770717098" || currentUser == "501559463"){
				deptQuery = "Data Science REU Site";
				reuFilter.push(
					{ // Department
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947052491686b157a42fa44ba79c0ec9c124bbfff6',
						operator: 'eq',
						value: deptQuery
					}
				);
			}
			if(currentUser == "752261007"){
				deptQuery = "MassDigi";
				reuFilter.push(
					{ // Department
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947052491686b157a42fa44ba79c0ec9c124bbfff6',
						operator: 'eq',
						value: deptQuery
					}
				);
			}
			if(currentUser == "791405460" || currentUser == "240980608"){
				deptQuery = "Sister2Sister";
				reuFilter.push(
					{ // Department
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947052491686b157a42fa44ba79c0ec9c124bbfff6',
						operator: 'eq',
						value: deptQuery
					}
				);
			}
			if(currentUser == "718836593"){
				deptQuery = "Robotics Research Experience & Mentoring (REM)";
				reuFilter.push(
					{ // Department
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947052491686b157a42fa44ba79c0ec9c124bbfff6',
						operator: 'eq',
						value: deptQuery
					}
				);
			}
			if(currentUser == "718836593"){
				deptQuery = "Robotics REU";
				reuFilter.push(
					{ // Department
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947052491686b157a42fa44ba79c0ec9c124bbfff6',
						operator: 'eq',
						value: deptQuery
					}
				);
			}
			if(currentUser == "349768965" || currentUser == "894748957"){
				reuFilter = []
			}
			
			

			const reuSearch = {
				filters:reuFilter,
				busObId: '947051628214740ec43be6439cb5c437f11ea10ed9',
				includeAllFields: true,
				pageNumber: 0,
				pageSize: 0,
				scope: 'Global'
			};

			let reuStudents = await CherwellAPI.getSearchResults(reuSearch);

			reuStudents = JSON.parse(reuStudents).businessObjects;

			res.render('me/my-reu.ejs', {
				deptQuery,
				reuStudents
			});
			return null;

		} else {
			return next(403);
		}

	},

	renderMoveIn: async(req, res, next) => {

		let customer =  await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		let intents = await CherwellAPI.getRelatedBusinessObjects('93405caa107c376a2bd15c4c8885a900be316f3a72', customer.busObRecId, '9466569ae4c5f4a00d39ec4273aab1d5fd8ab1ff23');
		intents = JSON.parse(intents).relatedBusinessObjects;
		let intent = '';
		for(intentItem of intents){
			if(intentItem.fields.find(f => f.name === 'Term')['value'] == '202201' && intentItem.fields.find(f => f.name === 'PTerm')['value'] == 'A'){
				intent = intentItem;
			}
		}
		let UserMoveIn = intent.fields.find(f => f.name === 'MoveInDateStart')['value']
		let UserLocation = intent.fields.find(f => f.name === 'RoomLocation')['value']
		

		

		let hoursFilters = [];
		hoursFilters.push(
			{ // Term
				fieldId: 'BO:946b8fd207254b11bf19a2492f97950343beb0df78,FI:946b8fd6723fddd086ff4c42168422fcde8679925d',
				operator: 'eq',
				value: '202201'
			},
			{ // PTERM
				fieldId: 'BO:946b8fd207254b11bf19a2492f97950343beb0df78,FI:946b8fd68ec79a2daf098e47ddae58bbd140cbcb2c',
				operator: 'eq',
				value: 'A'
			},
			{ // Date
				fieldId: 'BO:946b8fd207254b11bf19a2492f97950343beb0df78,FI:946b8fd51502a1971a67fb4c4fab34d77d6e07fcc5',
				operator: 'eq',
				value: UserMoveIn
			},
			{ // Location
				fieldId: 'BO:946b8fd207254b11bf19a2492f97950343beb0df78,FI:9475166139516199505f4e4ba7b0a89237f4ec79b4',
				operator: 'eq',
				value: UserLocation
			}
		);

		const hoursSearch = {
			filters:hoursFilters,
			association: 'MoveIn Time Slot',
			busObId: '946b8fd207254b11bf19a2492f97950343beb0df78',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 0,
			scope: 'Global'
		};

		let Hours = await CherwellAPI.getSearchResults(hoursSearch);

		Hours = JSON.parse(Hours).businessObjects;
		let hourSlots =[];
		if(Hours.length >= 1){
			for(slot of Hours){
				hourSlots.push(
					{
						id: slot.fields.find(f => f.name === 'MoveInTimeSlotID')['value'],
						date: moment(new Date(slot.fields.find(f => f.name === 'Date')['value'])).utc().format('YYYY-MM-DD'),
						time:moment(new Date(slot.fields.find(f => f.name === 'Time')['value'])).utc().utcOffset(-5).format('h:mm A'),
						limit:slot.fields.find(f => f.name === 'Limit')['value'],
					}
				);
			}
		}

		hourSlots = hourSlots.sort((a, b) => {
			return moment(new Date('1970/01/01 ' + a.time)).diff(new Date('1970/01/01 ' + b.time));
		  });

		let regFilters = [];
		regFilters.push(
			{ // Term
				fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fed467d07a1170ddd4ccaa94f7b188f88e125',
				operator: 'eq',
				value: '202201'
			},
			{ // PTERM
				fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fed68117bee91cace4226b12c66671796508e',
				operator: 'eq',
				value: 'A'
			},
			{ // Date
				fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8feddd30244918d9fe42088cc4329c63087b9e',
				operator: 'eq',
				value: UserMoveIn
			},
			{ // Status
				fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fe95135c556cae5c743008d03800c78e98b45',
				operator: 'eq',
				value: "Active"
			},
			{ // Date
				fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fefe3b32920f136b74b009d8661887086a140',
				operator: 'eq',
				value: UserLocation
			},
		);

		const regSearch = {
			filters: regFilters,
			association: 'MoveIn Time Registration',
			busObId: '946b8fe4d90d1f85369cf6492c9235feab50cc00a8',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 2000,
			scope: 'Global'
		};

		let registrations = await CherwellAPI.getSearchResults(regSearch);
		registrations = JSON.parse(registrations).businessObjects;
		let regCounts =[];
		if(registrations.length >= 1){
			for(reg of registrations){
				regCounts.push(
					reg.fields.find(f => f.name === 'TimeSlotID')['value']
				);
			}
		}
		function count(arr) {
			return arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {})
		}
		regCounts = count(regCounts);

		let userRegFilters = [];
		userRegFilters.push(
			{ // Term
				fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fed467d07a1170ddd4ccaa94f7b188f88e125',
				operator: 'eq',
				value: '202201'
			},
			{ // PTERM
				fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fed68117bee91cace4226b12c66671796508e',
				operator: 'eq',
				value: 'A'
			},
			{ // Date
				fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8feddd30244918d9fe42088cc4329c63087b9e',
				operator: 'eq',
				value: UserMoveIn
			},
			{ // Date
				fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fefe3b32920f136b74b009d8661887086a140',
				operator: 'eq',
				value: UserLocation
			},
			{ // Status
				fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fe95135c556cae5c743008d03800c78e98b45',
				operator: 'eq',
				value: "Active"
			},
			{ // WPI ID
				fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fe7033497a1f9b5064f389b3736168bd2140d',
				operator: 'eq',
				value: req.user.employeeID
			},
		);

		const userRegSearch = {
			filters: userRegFilters,
			association: 'MoveIn Time Registration',
			busObId: '946b8fe4d90d1f85369cf6492c9235feab50cc00a8',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 0,
			scope: 'Global'
		};

		let userReg = await CherwellAPI.getSearchResults(userRegSearch);
		userReg = JSON.parse(userReg).businessObjects;

		res.render('cherwell/move-in/view.ejs', {
			intent,
			hourSlots,
			regCounts,
			userReg,
			query : req.query
		});
		
	},
	removeMoveIn: (req, res, next) => {
		const formData = req.body.formData;
		const userAttributes = req.session.userAttributes;
		return res.json(CherwellAPI.removeMoveIn(userAttributes, formData));
	},
	addMoveIn: async (req, res, next) => {
		const formData = req.body.formData;
		const userAttributes = req.session.userAttributes;

		// Check for hours
		
		let hoursFilters = [];
		hoursFilters.push(
			{ // Term
				fieldId: 'BO:946b8fd207254b11bf19a2492f97950343beb0df78,FI:946b8fd6723fddd086ff4c42168422fcde8679925d',
				operator: 'eq',
				value: '202201'
			},
			{ // PTERM
				fieldId: 'BO:946b8fd207254b11bf19a2492f97950343beb0df78,FI:946b8fd68ec79a2daf098e47ddae58bbd140cbcb2c',
				operator: 'eq',
				value: 'A'
			},
			{ // timeID
				fieldId: 'BO:946b8fd207254b11bf19a2492f97950343beb0df78,FI:946b8fd472a90b622ad87b4ff0aa03bf1b3c82c213',
				operator: 'eq',
				value: formData.timeID
			}
		);

		

		const hoursSearch = {
			filters:hoursFilters,
			association: 'MoveIn Time Slot',
			busObId: '946b8fd207254b11bf19a2492f97950343beb0df78',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 0,
			scope: 'Global'
		};

		let Hours = await CherwellAPI.getSearchResults(hoursSearch);
		Hours = JSON.parse(Hours).businessObjects;

		const UpperLimit = Hours[0].fields.find(f => f.name === 'Limit')['value'];

		let regFilters = [];
		regFilters.push(
			{ // Term
				fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fed467d07a1170ddd4ccaa94f7b188f88e125',
				operator: 'eq',
				value: '202201'
			},
			{ // PTERM
				fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fed68117bee91cace4226b12c66671796508e',
				operator: 'eq',
				value: 'A'
			},
			{ // Status
				fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fe95135c556cae5c743008d03800c78e98b45',
				operator: 'eq',
				value: "Active"
			},
			{ // timeID
				fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8feb102ed57a95a43348a1b0166eea1825f80c',
				operator: 'eq',
				value: formData.timeID
			}
		);

		const regSearch = {
			filters: regFilters,
			association: 'MoveIn Time Registration',
			busObId: '946b8fe4d90d1f85369cf6492c9235feab50cc00a8',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 0,
			scope: 'Global'
		};

		let registrations = await CherwellAPI.getSearchResults(regSearch);
		registrations = JSON.parse(registrations).businessObjects;
		const currentCount = registrations.length;

		if(currentCount >= UpperLimit){
			return next(403);
		}else{
			// Check for Reg
			let userRegFilters = [];
			userRegFilters.push(
				{ // Term
					fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fed467d07a1170ddd4ccaa94f7b188f88e125',
					operator: 'eq',
					value: '202201'
				},
				{ // PTERM
					fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fed68117bee91cace4226b12c66671796508e',
					operator: 'eq',
					value: 'A'
				},
				{ // Status
					fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fe95135c556cae5c743008d03800c78e98b45',
					operator: 'eq',
					value: "Active"
				},
				{ // WPI ID
					fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fe7033497a1f9b5064f389b3736168bd2140d',
					operator: 'eq',
					value: req.user.employeeID
				}
			);

			const userRegSearch = {
				filters: userRegFilters,
				association: 'MoveIn Time Registration',
				busObId: '946b8fe4d90d1f85369cf6492c9235feab50cc00a8',
				includeAllFields: true,
				pageNumber: 0,
				pageSize: 0,
				scope: 'Global'
			};

			let userReg = await CherwellAPI.getSearchResults(userRegSearch);
			userReg = JSON.parse(userReg).businessObjects;

			if(userReg.length > 1){
				return next(403);
			}else{
				return res.json(JSON.parse(await CherwellAPI.addMoveIn(req.user.employeeID, formData)));
			}
		}
	},
	getMoveInCounts: async(req, res, next) => {

		let customer =  await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		let intents = await CherwellAPI.getRelatedBusinessObjects('93405caa107c376a2bd15c4c8885a900be316f3a72', customer.busObRecId, '9466569ae4c5f4a00d39ec4273aab1d5fd8ab1ff23');
		intents = JSON.parse(intents).relatedBusinessObjects;
		let intent = '';
		for(intentItem of intents){
			if(intentItem.fields.find(f => f.name === 'Term')['value'] == '202201' && intentItem.fields.find(f => f.name === 'PTerm')['value'] == 'A'){
				intent = intentItem;
			}
		}
		let UserMoveIn = intent.fields.find(f => f.name === 'MoveInDateStart')['value'];

		let regFilters = [];
		regFilters.push(
			{ // Term
				fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fed467d07a1170ddd4ccaa94f7b188f88e125',
				operator: 'eq',
				value: '202201'
			},
			{ // PTERM
				fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fed68117bee91cace4226b12c66671796508e',
				operator: 'eq',
				value: 'A'
			},
			{ // Date
				fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8feddd30244918d9fe42088cc4329c63087b9e',
				operator: 'eq',
				value: UserMoveIn
			},
			{ // Status
				fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fe95135c556cae5c743008d03800c78e98b45',
				operator: 'eq',
				value: "Active"
			}
		);

		const regSearch = {
			filters: regFilters,
			association: 'MoveIn Time Registration',
			busObId: '946b8fe4d90d1f85369cf6492c9235feab50cc00a8',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 2000,
			scope: 'Global'
		};

		let registrations = await CherwellAPI.getSearchResults(regSearch);
		registrations = JSON.parse(registrations).businessObjects;
		let regCounts =[];
		if(registrations.length >= 1){
			for(reg of registrations){
				regCounts.push(
					reg.fields.find(f => f.name === 'TimeSlotID')['value']
				);
			}
		}
		function count(arr) {
			return arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {})
		}
		regCounts = count(regCounts);

		return res.json(regCounts);

	},
	renderAssetById: async(req, res, next) => {
		const CILinksCustomersRelationshipID = '944987a5b6ed11dab9df9f4c84ab8ecb4d8c6b5305';
		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		return CherwellAPI.getBusinessObject(CherwellAPI.configurationItemObjectIds.ConfigurationItem, req.params.assetTag).then(async asset => {
			asset = JSON.parse(asset);
			let canViewAsset = false;
			if (asset.fields.find(field => field.name === 'PrimaryUserRecID').value === customer.busObRecId) {
				canViewAsset = true;
			} else if (JSON.parse(await CherwellAPI.getRelatedBusinessObjects(asset.busObId, asset.busObRecId, CILinksCustomersRelationshipID)).relatedBusinessObjects.findIndex(person => person.busObRecId === customer.busObRecId) !== -1) {
				canViewAsset = true;
			} else if (await G.checkPermissions({req, entity: 'asset', level: 'read'})) {
				canViewAsset = true;
			}
			if (canViewAsset) {
				const assetDetailed = JSON.parse(await CherwellAPI.getBusinessObject(asset.fields.find(f => f.name === 'ConfigurationItemTypeID').value, req.params.assetTag));
				const CITypeFallback = await AssetImage.findOne(
					{
						where: {
							CIType: assetDetailed.fields.find(f => f.name === 'ConfigurationItemTypeName').value
						},
						include: [
							{
								model: FileUpload,
								as: 'image'
							}
						]
					}
				);
				const CITypeMfg = await AssetImage.findOne(
					{
						where: {
							CIType: assetDetailed.fields.find(f => f.name === 'ConfigurationItemTypeName').value,
							manufacturer: assetDetailed.fields.find(f => f.name === 'Manufacturer').value
						},
						include: [
							{
								model: FileUpload,
								as: 'image'
							}
						]
					}
				);
				const CITypeMfgModel = await AssetImage.findOne(
					{
						where: {
							CIType: assetDetailed.fields.find(f => f.name === 'ConfigurationItemTypeName').value,
							manufacturer: assetDetailed.fields.find(f => f.name === 'Manufacturer').value,
							model: assetDetailed.fields.find(f => f.name === 'Model').value
						},
						include: [
							{
								model: FileUpload,
								as: 'image'
							}
						]
					}
				);
				if (CITypeMfgModel) {
					assetDetailed._icon = CITypeMfgModel.icon;
					assetDetailed._image = CITypeMfgModel.image ? CITypeMfgModel.image.getURL() : null;
				} else if (CITypeMfg) {
					assetDetailed._icon = CITypeMfg.icon;
					assetDetailed._image = CITypeMfg.image ? CITypeMfg.image.getURL() : null;
				} else if (CITypeFallback) {
					assetDetailed._icon = CITypeFallback.icon;
					assetDetailed._image = CITypeFallback.image ? CITypeFallback.image.getURL() : null;
				} else {
					assetDetailed._icon = 'fa-laptop';
					assetDetailed._image = null;
				}
				res.render('cherwell/asset/view.ejs', {
					asset: assetDetailed
				});
				return null;
			} else {
				return next(403);
			}
		}).catch(err => {
			return next(err);
		});
	},
	getOneIncident: async(req, res, next) => {
		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		return CherwellAPI.getBusinessObject('6dd53665c0c24cab86870a21cf6434ae', req.params.publicID).then(async ticket => {
			ticket = JSON.parse(ticket);
			const allowed = incidentFilter(ticket);
			if (!allowed) {
				next(404);
				return null;
			}
			allApprovers = await CherwellAPI.getRelatedBusinessObjects(ticket.busObId, ticket.busObRecId, '94644c99820219f13ccfe24f6ebcab36bfd74e4250');
			allApprovers = JSON.parse(allApprovers).relatedBusinessObjects;
			let approverIDs = [];
			for(const Approvers of allApprovers){
				approverIDs.push(Approvers.fields.find(f => f.name === 'ApproverRecID')['value'])
			}
			let canViewTicket = false;
			if (ticket.fields.filter(field => field.fieldId === 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f')[0].value === customer.busObRecId) {
				canViewTicket = true;
			} else if (JSON.parse(await CherwellAPI.getRelatedBusinessObjects(ticket.busObId, ticket.busObRecId, '944e4761878a81223d36c24340bf57e2b93a78effb')).relatedBusinessObjects.findIndex(subscriber => subscriber.busObRecId === customer.busObRecId) !== -1) {
				canViewTicket = true;
			} else if (approverIDs.includes(customer.busObRecId)) {
				canViewTicket = true;
			} else if (await G.checkPermissions({req, entity: 'ticket', level: 'read'})) {
				canViewTicket = true;
			}
			if (canViewTicket) {
				const portalJournals = JSON.parse(await CherwellAPI.getRelatedBusinessObjectsWithGrid(ticket.busObId, ticket.busObRecId, '945418ae91b95e806c95404c33a225be2d9b4f402c', '9453426bcf43c89b2a74b4403581034c55ca2b5f93')).relatedBusinessObjects;
				const subscribers = JSON.parse(await CherwellAPI.getRelatedBusinessObjects(ticket.busObId, ticket.busObRecId, '944e4761878a81223d36c24340bf57e2b93a78effb')).relatedBusinessObjects;
				const requester = JSON.parse(await CherwellAPI.getRelatedBusinessObjects(ticket.busObId, ticket.busObRecId, '933bd532351a43642c990a4b38933ffc579741fc02')).relatedBusinessObjects[0];
				return res.json({
					ticket,
					portalJournals,
					subscribers,
					requester
				});
			} else {
				return next(403);
			}
		}).catch(err => {
			return next(err);
		});
	},
	createJournalForIncident: async(req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.formData;
				let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
				customer = JSON.parse(customer).businessObjects[0];
				const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
				return CherwellAPI.getBusinessObject('6dd53665c0c24cab86870a21cf6434ae', req.body.ticketID).then(async ticket => {
					ticket = JSON.parse(ticket);
					allApprovers = await CherwellAPI.getRelatedBusinessObjects(ticket.busObId, ticket.busObRecId, '94644c99820219f13ccfe24f6ebcab36bfd74e4250');
					allApprovers = JSON.parse(allApprovers).relatedBusinessObjects;
					let approverIDs = [];
					for(const Approvers of allApprovers){
						approverIDs.push(Approvers.fields.find(f => f.name === 'ApproverRecID')['value'])
					}
					let canUpdateTicket = false;
					if (ticket.fields.filter(field => field.fieldId === 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f')[0].value === customer.busObRecId) {
						canUpdateTicket = true;
					} else if (JSON.parse(await CherwellAPI.getRelatedBusinessObjects(ticket.busObId, ticket.busObRecId, '944e4761878a81223d36c24340bf57e2b93a78effb')).relatedBusinessObjects.findIndex(subscriber => subscriber.busObRecId === customer.busObRecId) !== -1) {
						canUpdateTicket = true;
					} else if (approverIDs.includes(customer.busObRecId)) {
						canUpdateTicket = true;
					} else if (await G.checkPermissions({req, entity: 'ticket', level: 'publish'})) {
						canUpdateTicket = true;
					}
					if (canUpdateTicket) {
						CherwellAPI.createJournalForIncident(ticket, customer.busObRecId, formData, customerFullName).then(journal => {
							journal = JSON.parse(journal);
							return res.json({ticket, journal});
						}).catch(err => {
							return next(err);
						});
					} else {
						return next(403);
					}
				}).catch(err => {
					return next(err);
				});
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	getPortalJournalsForIncident: async(req, res, next) => {
		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		return CherwellAPI.getBusinessObject('6dd53665c0c24cab86870a21cf6434ae', req.params.publicID).then(async ticket => {
			ticket = JSON.parse(ticket);
			allApprovers = await CherwellAPI.getRelatedBusinessObjects(ticket.busObId, ticket.busObRecId, '94644c99820219f13ccfe24f6ebcab36bfd74e4250');
			allApprovers = JSON.parse(allApprovers).relatedBusinessObjects;
			let approverIDs = [];
			for(const Approvers of allApprovers){
				approverIDs.push(Approvers.fields.find(f => f.name === 'ApproverRecID')['value'])
			}
			let canViewTicket = false;
			if (ticket.fields.filter(field => field.fieldId === 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f')[0].value === customer.busObRecId) {
				canViewTicket = true;
			} else if (JSON.parse(await CherwellAPI.getRelatedBusinessObjects(ticket.busObId, ticket.busObRecId, '944e4761878a81223d36c24340bf57e2b93a78effb')).relatedBusinessObjects.findIndex(subscriber => subscriber.busObRecId === customer.busObRecId) !== -1) {
				canViewTicket = true;
			} else if (approverIDs.includes(customer.busObRecId)) {
				canViewTicket = true;
			} else if (await G.checkPermissions({req, entity: 'ticket', level: 'read'})) {
				canViewTicket = true;
			}
			if (canViewTicket) {
				const portalJournals = JSON.parse(await CherwellAPI.getRelatedBusinessObjectsWithGrid(ticket.busObId, ticket.busObRecId, '945418ae91b95e806c95404c33a225be2d9b4f402c', '9453426bcf43c89b2a74b4403581034c55ca2b5f93')).relatedBusinessObjects;
				portalJournals.sort((a, b) => {
					const momentA = moment(a.fields.find(f => f.name === 'LastModifiedDateTime')['value'], 'M/DD/YYYY h:mm A');
					const momentB = moment(b.fields.find(f => f.name === 'LastModifiedDateTime')['value'], 'M/DD/YYYY h:mm A');
					return momentA.isAfter(momentB) ? -1 : 1;
				});
				return res.json({
					ticket,
					portalJournals
				});
			} else {
				return next(403);
			}
		}).catch(err => {
			return next(err);
		});
	},
	getSubscribedIncidentsForUser: async(req, res, next) => {
		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		CherwellAPI.getRelatedBusinessObjectsWithGrid('93405caa107c376a2bd15c4c8885a900be316f3a72', customer.busObRecId, '94531b84e74d21766626ad48c29903007d0a0b225c', '94531b980a9bca6fcfef3245569f4e31d1f2f99bd5').then(result => {
			result = JSON.parse(result).relatedBusinessObjects.filter(obj => {
				const isOpen = CherwellAPI.openStatuses.includes(obj.fields.filter(field => field.fieldId === 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d')[0].value);
				const allowed = incidentFilter(obj);
				return isOpen && allowed;
			});
			res.json(result);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getOpenIncidentsForUser: async(req, res, next) => {
		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		CherwellAPI.getRelatedBusinessObjectsWithGrid('93405caa107c376a2bd15c4c8885a900be316f3a72', customer.busObRecId, '9345ec383ba24201db4ee3415e8f9732f0479b7f7a', '94531b980a9bca6fcfef3245569f4e31d1f2f99bd5').then(result => {
			result = JSON.parse(result).relatedBusinessObjects.filter(obj => {
				const isOpen = CherwellAPI.openStatuses.includes(obj.fields.filter(field => field.fieldId === 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d')[0].value);
				const allowed = incidentFilter(obj);
				return isOpen && allowed;
			});
			req.session.userOpenTicketCount = `${result.length}`;
			req.session.save(err => {
				if (err) {
					next(err);
					return null;
				}
			});
			res.json(result);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	
	getClosedIncidentsForUser: async(req, res, next) => {
		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		CherwellAPI.getRelatedBusinessObjectsWithGrid('93405caa107c376a2bd15c4c8885a900be316f3a72', customer.busObRecId, '9345ec383ba24201db4ee3415e8f9732f0479b7f7a', '94531b980a9bca6fcfef3245569f4e31d1f2f99bd5').then(result => {
			result = JSON.parse(result).relatedBusinessObjects.filter(obj => {
				const isClosed = !CherwellAPI.openStatuses.includes(obj.fields.filter(field => field.fieldId === 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d')[0].value);
				const allowed = incidentFilter(obj);
				return isClosed && allowed;
			});
			return res.json(result);
		}).catch(err => {
			return next(err);
		});
	},
	getAllIncidentsForUser: async(req, res, next) => {
		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		CherwellAPI.getRelatedBusinessObjectsWithGrid('93405caa107c376a2bd15c4c8885a900be316f3a72', customer.busObRecId, '9345ec383ba24201db4ee3415e8f9732f0479b7f7a', '94531b980a9bca6fcfef3245569f4e31d1f2f99bd5').then(result => {
			result = JSON.parse(result).relatedBusinessObjects;
			result.filter(obj => incidentFilter(obj));
			return res.json(result);
		}).catch(err => {
			return next(err);
		});
	},
	getAllIntentsForUser: async(req, res, next) => {
		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		CherwellAPI.getRelatedBusinessObjects('93405caa107c376a2bd15c4c8885a900be316f3a72', customer.busObRecId, '9466569ae4c5f4a00d39ec4273aab1d5fd8ab1ff23').then(result => {
			result = JSON.parse(result).relatedBusinessObjects;
			return res.json(result);
		}).catch(err => {
			return next(err);
		});
	},
	getWaitingRegApprovalsForUser: async(req, res, next) => {
		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		CherwellAPI.getRelatedBusinessObjects('93405caa107c376a2bd15c4c8885a900be316f3a72', customer.busObRecId, '9464557c91670a43b4094f4dacbf7dd03fcafc828c').then(result => {
			result = JSON.parse(result).relatedBusinessObjects;
			result = result.filter(approval =>  approval.fields.some(f => f.fieldId === 'BO:94644c61359570d6f38f634caaa62c422d5d940a12,FI:94644c690b88f4689430c94470be433b8218114dba' && f.value === 'Waiting'));
			return res.json(result);
		}).catch(err => {
			return next(err);
		});
	},
	getClosedRegApprovalsForUser: async(req, res, next) => {
		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		CherwellAPI.getRelatedBusinessObjects('93405caa107c376a2bd15c4c8885a900be316f3a72', customer.busObRecId, '9464557c91670a43b4094f4dacbf7dd03fcafc828c').then(result => {
			result = JSON.parse(result).relatedBusinessObjects;
			result = result.filter(approval =>  approval.fields.some(f => f.fieldId === 'BO:94644c61359570d6f38f634caaa62c422d5d940a12,FI:94644c690b88f4689430c94470be433b8218114dba' && f.value !== 'Waiting'));
			return res.json(result);
		}).catch(err => {
			return next(err);
		});
	},

	getAllCIsForUser: async(req, res, next) => {
		const customerBusinessObjID = '93405caa107c376a2bd15c4c8885a900be316f3a72';
		const customerUsesCIRelationshipID = '9384e774be366bb83f8f3f4eecb538a6b0aeb441a3';
		const gridID = '94564d989268b2fb0bf06241d8a9bde827623e4562';
		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		CherwellAPI.getRelatedBusinessObjectsWithGrid(customerBusinessObjID, customer.busObRecId, customerUsesCIRelationshipID, gridID).then(async result => {
			result = JSON.parse(result).relatedBusinessObjects;
			let myResultsCount = result.filter(r => r.fields.some(f => f.name === 'PrimaryUserRecID' && f.value && f.value === customer.busObRecId)).length;
			req.session.userAssetCount = `${myResultsCount}`;
			req.session.save(err => {
				if (err) {
					next(err);
					return null;
				}
			});
			for (const item of result) {
				const CITypeFallback = await AssetImage.findOne(
					{
						where: {
							CIType: item.fields.find(f => f.name === 'ConfigurationItemTypeName').value
						},
						include: [
							{
								model: FileUpload,
								as: 'image'
							}
						]
					}
				);
				const CITypeMfg = await AssetImage.findOne(
					{
						where: {
							CIType: item.fields.find(f => f.name === 'ConfigurationItemTypeName').value,
							manufacturer: item.fields.find(f => f.name === 'Manufacturer').value
						},
						include: [
							{
								model: FileUpload,
								as: 'image'
							}
						]
					}
				);
				const CITypeMfgModel = await AssetImage.findOne(
					{
						where: {
							CIType: item.fields.find(f => f.name === 'ConfigurationItemTypeName').value,
							manufacturer: item.fields.find(f => f.name === 'Manufacturer').value,
							model: item.fields.find(f => f.name === 'Model').value
						},
						include: [
							{
								model: FileUpload,
								as: 'image'
							}
						]
					}
				);
				if (CITypeMfgModel) {
					item._icon = CITypeMfgModel.icon;
					item._image = CITypeMfgModel.image ? CITypeMfgModel.image.getURL() : null;
				} else if (CITypeMfg) {
					item._icon = CITypeMfg.icon;
					item._image = CITypeMfg.image ? CITypeMfg.image.getURL() : null;
				} else if (CITypeFallback) {
					item._icon = CITypeFallback.icon;
					item._image = CITypeFallback.image ? CITypeFallback.image.getURL() : null;
				} else {
					item._icon = 'fa-laptop';
					item._image = null;
				}
			}
			res.json(result);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getCIsForPrimaryUser: async(req, res, next) => {
		const customerBusinessObjID = '93405caa107c376a2bd15c4c8885a900be316f3a72';
		const customerUsesCIRelationshipID = '9384e774be366bb83f8f3f4eecb538a6b0aeb441a3';
		const gridID = '94564d989268b2fb0bf06241d8a9bde827623e4562';
		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		CherwellAPI.getRelatedBusinessObjectsWithGrid(customerBusinessObjID, customer.busObRecId, customerUsesCIRelationshipID, gridID).then(async result => {
			result = JSON.parse(result).relatedBusinessObjects;
			result = result.filter(r => r.fields.some(f => f.name === 'PrimaryUserRecID' && f.value && f.value === customer.busObRecId));
			req.session.userAssetCount = `${result.length}`;
			req.session.save(err => {
				if (err) {
					next(err);
					return null;
				}
			});
			for (const item of result) {
				const CITypeFallback = await AssetImage.findOne(
					{
						where: {
							CIType: item.fields.find(f => f.name === 'ConfigurationItemTypeName').value
						},
						include: [
							{
								model: FileUpload,
								as: 'image'
							}
						]
					}
				);
				const CITypeMfg = await AssetImage.findOne(
					{
						where: {
							CIType: item.fields.find(f => f.name === 'ConfigurationItemTypeName').value,
							manufacturer: item.fields.find(f => f.name === 'Manufacturer').value
						},
						include: [
							{
								model: FileUpload,
								as: 'image'
							}
						]
					}
				);
				const CITypeMfgModel = await AssetImage.findOne(
					{
						where: {
							CIType: item.fields.find(f => f.name === 'ConfigurationItemTypeName').value,
							manufacturer: item.fields.find(f => f.name === 'Manufacturer').value,
							model: item.fields.find(f => f.name === 'Model').value
						},
						include: [
							{
								model: FileUpload,
								as: 'image'
							}
						]
					}
				);
				if (CITypeMfgModel) {
					item._icon = CITypeMfgModel.icon;
					item._image = CITypeMfgModel.image ? CITypeMfgModel.image.getURL() : null;
				} else if (CITypeMfg) {
					item._icon = CITypeMfg.icon;
					item._image = CITypeMfg.image ? CITypeMfg.image.getURL() : null;
				} else if (CITypeFallback) {
					item._icon = CITypeFallback.icon;
					item._image = CITypeFallback.image ? CITypeFallback.image.getURL() : null;
				} else {
					item._icon = 'fa-laptop';
					item._image = null;
				}
			}
			res.json(result);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	getOneCI: async(req, res, next) => {
		const configItemTypeFieldID = 'BO:9343f8800bd7ce14f0bf0a402d9d38be1a25069644,FI:9343f8800b0dfd4f1fa34b423d993e8640edcfad73';
		const configItemTypeNameField = 'ConfigurationItemTypeName';
		const primaryUserField = 'PrimaryUserRecID';

		const assetTag = req.params.assetTag;

		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];

		CherwellAPI.getBusinessObject(CherwellAPI.configurationItemObjectIds.ConfigurationItem, assetTag).then(groupObject => {
			if (!groupObject) {
				next(404);
				return null;
			}
			groupObject = JSON.parse(groupObject);
			const businessObjectId = groupObject.fields.find(f => f.fieldId === configItemTypeFieldID).value;
			CherwellAPI.getBusinessObject(businessObjectId, assetTag).then(asset => {
				if (asset) {
					asset = JSON.parse(asset);
					if (asset.fields.find(f => f.name === primaryUserField).value === customer.busObRecId || G.isAdminUser(req)) {
						res.json({
							type: asset.fields.find(f => f.name === configItemTypeNameField).value,
							asset
						});
					} else {
						next(403);
					}
				} else {
					next(404);
				}
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
	getRelationshipID: (req, res, next) => {
		CherwellAPI.getRelationshipID(req.params.busObjID, req.params.relationshipDisplayName).then(result => {
			return res.json(JSON.parse(result));
		}).catch(err => {
			return next(err);
		});
	},
	getRelatedBusinessObjects: (req, res, next) => {
		CherwellAPI.getRelatedBusinessObjects(req.params.busObjID, req.params.busObjRecID, req.params.relationshipId).then(result => {
			return res.json(JSON.parse(result));
		}).catch(err => {
			return next(err);
		});
	},
	getRelatedBusinessObjectsWithGrid: (req, res, next) => {
		CherwellAPI.getRelatedBusinessObjectsWithGrid(req.params.busObjID, req.params.busObjRecID, req.params.relationshipId, req.params.gridId).then(result => {
			return res.json(JSON.parse(result));
		}).catch(err => {
			return next(err);
		});
	},
	getBusinessObject: (req, res, next) => {
		CherwellAPI.getBusinessObject(req.params.busObjID, req.params.publicID).then(result => {
			return res.json(JSON.parse(result));
		}).catch(err => {
			return next(err);
		});
	},
	getBusinessObjectByRecID: (req, res, next) => {
		CherwellAPI.getBusinessObjectByRecID(req.params.busObjID, req.params.recID).then(result => {
			return res.json(JSON.parse(result));
		}).catch(err => {
			return next(err);
		});
	},
	getBusinessObjectSchemaByName: (req, res, next) => {
		CherwellAPI.getBusinessObjectSchemaByName(req.params.name, req.query.includeRelationships === 'true').then(result => {
			return res.json(JSON.parse(result));
		}).catch(err => {
			return next(err);
		});
	},
	getBusinessObjectSchemaByBusObjID: (req, res, next) => {
		CherwellAPI.getBusinessObjectSchemaByBusObjID(req.params.busObjID, req.query.includeRelationships === 'true').then(result => {
			return res.json(JSON.parse(result));
		}).catch(err => {
			return next(err);
		});
	},
	getBusinessObjectSummaryByName: (req, res, next) => {
		CherwellAPI.getBusinessObjectSummaryByName(req.params.name).then(result => {
			return res.json(JSON.parse(result));
		}).catch(err => {
			return next(err);
		});
	},
	getBusinessObjectSummariesByType: (req, res, next) => {
		CherwellAPI.getBusinessObjectSummariesByType(req.params.type).then(result => {
			return res.json(JSON.parse(result));
		}).catch(err => {
			return next(err);
		});
	},
	getBusinessObjectTemplate: (req, res, next) => {
		CherwellAPI.getBusinessObjectTemplate(req.body).then(result => {
			return res.json(JSON.parse(result));
		}).catch(err => {
			return next(err);
		});
	},
	
	getNetOpsTickets: (req, res, next) => {
		const filters = [];

		switch (req.query.team) {
			case 'Network Operations': {
				filters.push(
					{ // OwnedByTeam
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						operator: 'eq',
						value: 'Network Operations'
					}
				);
				break;
			}
			case 'Network Operations Staff': {
				filters.push(
					{ // OwnedByTeam
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						operator: 'eq',
						value: 'Network Operations Staff'
					}
				);
				break;
			}
			case 'Telecommunications': {
				filters.push(
					{ // OwnedByTeam
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						operator: 'eq',
						value: 'Telecommunications'
					}
				);
				break;
			}
			case 'Facilities and Safety': {
				filters.push(
					{ // OwnedByTeam
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						operator: 'eq',
						value: 'Facilities and Safety'
					}
				);
				break;
			}
			case 'all': {
				filters.push(
					{ // OwnedByTeam
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						operator: 'eq',
						value: 'Network Operations'
					},
					{ // OwnedByTeam
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						operator: 'eq',
						value: 'Network Operations Staff'
					},
					{ // OwnedByTeam
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						operator: 'eq',
						value: 'Telecommunications'
					},
					{ // OwnedByTeam
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						operator: 'eq',
						value: 'Facilities and Safety'
					}
				);
				break;
			}
			default: {
				next(400);
				return null;
			}
		}

		for (const status of ['New', 'Open', 'Assigned', 'In Progress', 'Pending', 'Reopened']) {
			filters.push(
				{ // Status
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
					operator: 'eq',
					value: status
				}
			);
		}

		const search = {
			filters,
			association: 'Incident',
			busObId: '6dd53665c0c24cab86870a21cf6434ae',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 0,
			scope: 'Global'
		};

		CherwellAPI.getSearchResults(search).then(async results => {
			const ticketsRaw = JSON.parse(results).businessObjects;
			const tickets = [];
			for (const ticket of ticketsRaw) {
				const ticketRaw = {
					id: ticket.busObPublicId,
					priority: ticket.fields.find(f => f.name === 'Priority')['value'],
					status: ticket.fields.find(f => f.name === 'Status')['value'],
					service: ticket.fields.find(f => f.name === 'Service')['value'],
					category: ticket.fields.find(f => f.name === 'Category')['value'],
					subCategory: ticket.fields.find(f => f.name === 'Subcategory')['value'],
					ownedByTeam: ticket.fields.find(f => f.name === 'OwnedByTeam')['value'],
					ownedByPerson: ticket.fields.find(f => f.name === 'OwnedBy')['value'],
					createdDateTime: ticket.fields.find(f => f.name === 'CreatedDateTime')['value'],
					summary: ticket.fields.find(f => f.name === 'Summary')['value'],
					customerDisplayName: ticket.fields.find(f => f.name === 'CustomerDisplayName')['value'],
					hasProblem: ticket.fields.find(f => f.name === 'LinkedProblem')['value'].length > 0
				};
				
				tickets.push(ticketRaw);
			}
			return res.json(
				{
					count: tickets.length,
					tickets
				}
			);
		}).catch(err => {
			logger.err(err);
			return res.status(400).json(
				{
					status: 400,
					reason: 'bad request'
				}
			);
		});
	},
	getApprovalDept: async (req, res, next) => {
		const depts =  await CherwellAPI.getApprovalDept();
		return res.json(
			{
				depts
			}
		);
	},
	getSIEDept: async (req, res, next) => {
		const depts =  await CherwellAPI.getSIEDept();
		return res.json(
			{
				depts
			}
		);
	},
	getSIEGoals: async (req, res, next) => {
		const goals =  await CherwellAPI.getSIEGoals();
		return res.json(
			{
				goals
			}
		);
	},
	getASIEGoal: async (req, res, next) => {
		goalID = req.params.id
		const goal =  await CherwellAPI.getASIEGoal(goalID);
		return res.json(
			{
				goal
			}
		);
	},
	getMyInstructedIntent: async (req, res, next) => {

		let instructed = {};
		let PIDM = req.session.userAttributes["user.employeeNumber"];
		instructed = await bannerAPI.getMyInstructedAll(PIDM, 202102).catch(err =>{
			logger.err(err);
			return null;
		});
		instructed = instructed.rows;

		

		let filters = [];
		filters.push(
			{ // Term
				fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466567a186db597f329254cc9870bfe0e3e386a50',
				operator: 'eq',
				value: '202001'
			},
			{ // PTERM
				fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466567ac570751d1bd8644b2f90ec49ad378b5720',
				operator: 'eq',
				value: 'B'
			}
		);
		for(registration of instructed){
			filters.push(
				{ // Student
					fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466566ca0de020a3e321a4e5aa940068abdc51ded',
					operator: 'eq',
					value: registration["STU_ID"]
				},
			);

			registration.text = "queried"
		}
		const search = {
			filters,
			fields: [
				'Title',
				'Status',
				'OwnedByTeam',
				'CreatedDateTime'
			],
			association: 'Work_Item',
			busObId: '946656451978e6e6dca4e34c149e5817f3e8c308fb',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 0,
			scope: 'Global'
		};
		CherwellAPI.getSearchResults(search).then(results => {
			const intentsRaw = JSON.parse(results).businessObjects;
			const intents = [];
			for (const intent of intentsRaw) {
				intents.push(
					{
						STU_ID: intent.fields.find(f => f.name === 'WPIID')['value'],
						wpiemail: intent.fields.find(f => f.name === 'WPIEmail')['value'],
						designation: intent.fields.find(f => f.name === 'Designation')['value'],
						status: intent.fields.find(f => f.name === 'CombinedStatus')['value'],
					}
				);
			}
			const mergedArray = []

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
			return res.json(
				{	meta:{
					students: mergedArray.length,
					courses: grouped.length,
					},
					user: req.user,
					mergedArray,
					grouped
				}
			);
		}).catch(err => {
			logger.err(err);
			return res.status(400).json(
				{
					status: 400,
					reason: 'bad request'
				}
			);
		})

		
	},
		getInstructedIntentOne: async (req, res, next) => {
		var PIDM = req.params.PIDM || req.session.userAttributes["user.employeeNumber"]; 
		var TERM = req.params.TERM || "";
		var PTERM = JSON.parse(req.query.PTERM) || "";
		let instructed = {};

		instructed = await bannerAPI.getMyInstructedAll(PIDM, TERM,PTERM).catch(err =>{
			logger.err(err);
			return null;
		});
		instructed = instructed.rows;

		

		let filters = [];
		filters.push(
			{ // Term
				fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466567a186db597f329254cc9870bfe0e3e386a50',
				operator: 'eq',
				value: '202001'
			},
			{ // PTERM
				fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466567ac570751d1bd8644b2f90ec49ad378b5720',
				operator: 'eq',
				value: 'B'
			}
		);
		for(registration of instructed){
			filters.push(
				{ // Student
					fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466566ca0de020a3e321a4e5aa940068abdc51ded',
					operator: 'eq',
					value: registration["STU_ID"]
				},
			);

			registration.text = "queried"
		}
		const search = {
			filters,
			fields: [
				'Title',
				'Status',
				'OwnedByTeam',
				'CreatedDateTime'
			],
			association: 'Work_Item',
			busObId: '946656451978e6e6dca4e34c149e5817f3e8c308fb',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 0,
			scope: 'Global'
		};
		CherwellAPI.getSearchResults(search).then(results => {
			const intentsRaw = JSON.parse(results).businessObjects;
			const intents = [];
			for (const intent of intentsRaw) {
				intents.push(
					{
						STU_ID: intent.fields.find(f => f.name === 'WPIID')['value'],
						wpiemail: intent.fields.find(f => f.name === 'WPIEmail')['value'],
						designation: intent.fields.find(f => f.name === 'Designation')['value'],
						status: intent.fields.find(f => f.name === 'CombinedStatus')['value'],
					}
				);
			}
			const mergedArray = []

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
			return res.json(
				{	meta:{
					students: mergedArray.length,
					courses: grouped.length,
					},
					mergedArray,
					grouped
				}
			);
		}).catch(err => {
			logger.err(err);
			return res.status(400).json(
				{
					status: 400,
					reason: 'bad request'
				}
			);
		})

		
	},
	refreshToken: async (req, res, next) => {
		CherwellTokenCache.refreshToken().then(results => {
			return res.json(
				{results}
			);
		}).catch(err => {
			logger.err(err);
			return res.status(400).json(
				{
					status: 400,
					reason: 'bad request'
				}
			);
		})

		
	},
	getTokens: async (req, res, next) => {
		CherwellTokenCache.getTokens(10).then(results => {
			return res.json(results);
		}).catch(err => {
			logger.err(err);
			return res.status(400).json(
				{
					status: 400,
					reason: 'bad request'
				}
			);
		})

		
	},
	getEmployees: (req, res, next) => {
		//set headers to cache large file
		res.set('Cache-Control', 'public, max-age=1800, s-maxage=1800');
		//Initialize Empty Filter Array
		const filters = [];
		//Push filters to the array
		filters.push(
			{ // Field: Employee Status is equal to 1, checks for only 'active' employees
				fieldId: 'BO:93405caa107c376a2bd15c4c8885a900be316f3a72,FI:9365b48c7a02c4654be9624288863ae02663042578',
				operator: 'eq',
				value: '1'
			},
			{ // Field: isContingent is NOT equal to 0, ensures employee is not a contingent
				fieldId: 'BO:93405caa107c376a2bd15c4c8885a900be316f3a72,FI:947f1a3d455740d16c06c64756957000b3726db403',
				operator: 'eq',
				value: '0'
			}

			);
		//creates the searh object and options
		const search = {
			filters,
			association: 'CustomerInternal',
			busObId: '93405caa107c376a2bd15c4c8885a900be316f3a72',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 10000,
			scope: 'Global'
		};

		CherwellAPI.getSearchResults(search).then(results => {
			const employeesRaw = JSON.parse(results).businessObjects;
			const employees = [];
			for (const employee of employeesRaw) {
				employees.push(
					{
						RecID: employee.fields.find(f => f.name === 'RecID')['value'],
						EmployeeID: employee.fields.find(f => f.name === 'EmployeeID')['value'],
						FullName: employee.fields.find(f => f.name === 'FullName')['value'],
						Email: employee.fields.find(f => f.name === 'Email')['value']
					}
				);
			}
			return res.json(
				{
					count: employees.length,
					employees
				}
			);
		}).catch(err => {
			logger.err(err);
			return res.status(400).json(
				{
					status: 400,
					reason: 'bad request'
				}
			);
		});
	},
	getContracts: (req, res, next) => {
		//Initialize Empty Filter Array
		const filters = [];
		//Push filters to the array 
		filters.push(
			{ // Field: Delegator WPI ID = current user WPI ID
				fieldId: 'BO:948c105be76790c672e88449c3bfc3ba90da8e30b6,FI:948c1066dd802b0604f8d64cc0ab11e15b32ba4c32',
				operator: 'eq',
				value: req.user.employeeID
			}
			);
		//creates the searh object and options
		const search = {
			filters,
			association: 'ContractDelegate',
			busObId: '948c105be76790c672e88449c3bfc3ba90da8e30b6',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 200,
			scope: 'Global'
		};

		CherwellAPI.getSearchResults(search).then(results => {
			const contractsRaw = JSON.parse(results).businessObjects;
			const contracts = [];
			for (const contract of contractsRaw) {
				contracts.push(
					{
						DelegatorName: contract.fields.find(f => f.name === 'DelegatorName')['value'],
						DelegateeName: contract.fields.find(f => f.name === 'DelegateeName')['value'],
						Status:contract.fields.find(f => f.name === 'Status')['value'],
						PeriodStart:contract.fields.find(f => f.name === 'PeriodStart')['value'],
						PeriodEnd:contract.fields.find(f => f.name === 'PeriodEnd')['value'],
						Amount:contract.fields.find(f => f.name === 'Amount')['value'],
				//		delegateeLegalName: contract.fields.find(f => f.name === 'delegateeLegalName')['value'],
				//		delegatorLegalName: contract.fields.find(f => f.name === 'delegatorLegalName')['value'],
						RecID:contract.fields.find(f => f.name === 'RecID')['value']
					}
				);
			}
			return res.json(
				{
					count: contracts.length,
					contracts
				}
			);
		}).catch(err => {
			logger.err(err);
			return res.status(400).json(
				{
					status: 400,
					reason: 'bad request'
				}
			);
		});
	},
	getNetOpsTasks: (req, res, next) => {
		const filters = [];

		switch (req.query.team) {
			case 'Network Operations': {
				filters.push(
					{ // OwnedByTeam
						fieldId: 'BO:9355d5ed41e384ff345b014b6cb1c6e748594aea5b,FI:93cfd5a4e10af4933a573444d08cbc412da491b42e',
						operator: 'eq',
						value: 'Network Operations'
					}
				);
				break;
			}
			case 'Network Operations Staff': {
				filters.push(
					{ // OwnedByTeam
						fieldId: 'BO:9355d5ed41e384ff345b014b6cb1c6e748594aea5b,FI:93cfd5a4e10af4933a573444d08cbc412da491b42e',
						operator: 'eq',
						value: 'Network Operations Staff'
					}
				);
				break;
			}
			case 'Telecommunications': {
				filters.push(
					{ // OwnedByTeam
						fieldId: 'BO:9355d5ed41e384ff345b014b6cb1c6e748594aea5b,FI:93cfd5a4e10af4933a573444d08cbc412da491b42e',
						operator: 'eq',
						value: 'Telecommunications'
					}
				);
				break;
			}
			case 'Facilities and Safety': {
				filters.push(
					{ // OwnedByTeam
						fieldId: 'BO:9355d5ed41e384ff345b014b6cb1c6e748594aea5b,FI:93cfd5a4e10af4933a573444d08cbc412da491b42e',
						operator: 'eq',
						value: 'Facilities and Safety'
					}
				);
				break;
			}
			case 'all': {
				filters.push(
					{ // OwnedByTeam
						fieldId: 'BO:9355d5ed41e384ff345b014b6cb1c6e748594aea5b,FI:93cfd5a4e10af4933a573444d08cbc412da491b42e',
						operator: 'eq',
						value: 'Network Operations'
					},
					{ // OwnedByTeam
						fieldId: 'BO:9355d5ed41e384ff345b014b6cb1c6e748594aea5b,FI:93cfd5a4e10af4933a573444d08cbc412da491b42e',
						operator: 'eq',
						value: 'Network Operations Staff'
					},
					{ // OwnedByTeam
						fieldId: 'BO:9355d5ed41e384ff345b014b6cb1c6e748594aea5b,FI:93cfd5a4e10af4933a573444d08cbc412da491b42e',
						operator: 'eq',
						value: 'Telecommunications'
					},
					{ // OwnedByTeam
						fieldId: 'BO:9355d5ed41e384ff345b014b6cb1c6e748594aea5b,FI:93cfd5a4e10af4933a573444d08cbc412da491b42e',
						operator: 'eq',
						value: 'Facilities and Safety'
					}
				);
				break;
			}
			default: {
				next(400);
				return null;
			}
		}

		for (const status of ['New', 'Acknowledged', 'In Progress', 'On Hold']) {
			filters.push(
				{ // Status
					fieldId: 'BO:9355d5ed41e384ff345b014b6cb1c6e748594aea5b,FI:9368f0fb7b744108a666984c21afc932562eb7dc16',
					operator: 'eq',
					value: status
				}
			);
		}

		const search = {
			filters,
			fields: [
				'Title',
				'Status',
				'OwnedByTeam',
				'CreatedDateTime'
			],
			association: 'Work_Item',
			busObId: '9355d5ed41e384ff345b014b6cb1c6e748594aea5b',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 0,
			scope: 'Global'
		};

		CherwellAPI.getSearchResults(search).then(results => {
			const tasksRaw = JSON.parse(results).businessObjects;
			const tasks = [];
			for (const task of tasksRaw) {
				tasks.push(
					{
						id: task.busObPublicId,
						title: task.fields.find(f => f.name === 'Title')['value'],
						status: task.fields.find(f => f.name === 'Status')['value'],
						ownedByTeam: task.fields.find(f => f.name === 'OwnedByTeam')['value'],
						ownedByPerson: task.fields.find(f => f.name === 'OwnedBy')['value'],
						createdDateTime: task.fields.find(f => f.name === 'CreatedDateTime')['value']
					}
				);
			}
			return res.json(
				{
					count: tasks.length,
					tasks
				}
			);
		}).catch(err => {
			logger.err(err);
			return res.status(400).json(
				{
					status: 400,
					reason: 'bad request'
				}
			);
		});
	},
	getOneStepActions: (req, res, next) => {
		CherwellAPI.getOneStepActions().then(result => {
			return res.json(JSON.parse(result));
		}).catch(err => {
			return next(err);
		});
	},

	getSurveyCheck: async(req, res, next) => {
		const filters = [];

		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		const customerID = customer.busObRecId;

			filters.push(
				{ // OwnedByTeam
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					operator: 'eq',
					value: customerID
				},
				{ // Subcategory
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
					value: 'Student Intent - Fall 2020'
				}
				
			);
		const search = {
			filters,
			association: 'Incident',
			busObId: '6dd53665c0c24cab86870a21cf6434ae',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 0,
			scope: 'Global'
		};

		CherwellAPI.getSearchResults(search).then(async results => {
			const ticketsRaw = JSON.parse(results).businessObjects;
			const tickets = [];
			for (const ticket of ticketsRaw) {
				const ticketRaw = {
					id: ticket.busObPublicId,
					subCategory: ticket.fields.find(f => f.name === 'Subcategory')['value'],
					createdDateTime: ticket.fields.find(f => f.name === 'CreatedDateTime')['value'],
					summary: ticket.fields.find(f => f.name === 'Summary')['value'],
					customerDisplayName: ticket.fields.find(f => f.name === 'CustomerDisplayName')['value'],
				};
				tickets.push(ticketRaw);
			}
			return res.json(
				{
					count: tickets.length,
					tickets
				}
			);
		}).catch(err => {
			logger.err(err);
			return res.status(400).json(
				{
					status: 400,
					reason: 'bad request'
				}
			);
		});
	},
	getGradIntentCheck: async(req, res, next) => {
		const filters = [];

		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		const customerID = customer.busObRecId;

			filters.push(
				{ // OwnedByTeam
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					operator: 'eq',
					value: customerID
				},
				{ // Subcategory
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
					value: 'Application to Graduate'
				}
				
			);
		const search = {
			filters,
			association: 'Incident',
			busObId: '6dd53665c0c24cab86870a21cf6434ae',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 0,
			scope: 'Global'
		};

		CherwellAPI.getSearchResults(search).then(async results => {
			const ticketsRaw = JSON.parse(results).businessObjects;
			const tickets = [];
			for (const ticket of ticketsRaw) {
				const ticketRaw = {
					id: ticket.busObPublicId,
					subCategory: ticket.fields.find(f => f.name === 'Subcategory')['value'],
					createdDateTime: ticket.fields.find(f => f.name === 'CreatedDateTime')['value'],
					summary: ticket.fields.find(f => f.name === 'Summary')['value'],
					customerDisplayName: ticket.fields.find(f => f.name === 'CustomerDisplayName')['value'],
				};
				tickets.push(ticketRaw);
			}
			return res.json(
				{
					count: tickets.length,
					tickets
				}
			);
		}).catch(err => {
			logger.err(err);
			return res.status(400).json(
				{
					status: 400,
					reason: 'bad request'
				}
			);
		});
	},
	getcommencementCheck: async(req, res, next) => {
		const filters = [];

		let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
		customer = JSON.parse(customer).businessObjects[0];
		const customerID = customer.busObRecId;

			filters.push(
				{ // OwnedByTeam
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					operator: 'eq',
					value: customerID
				},
				{ // Subcategory
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
					value: 'Commencement Participation Response'
				},
				{ // Subcategory
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
					value: 'Updated Commencement Participation Response'
				}
				
			);
		const search = {
			filters,
			association: 'Incident',
			busObId: '6dd53665c0c24cab86870a21cf6434ae',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 0,
			sorting: [
				{
				  fieldId: "BO:6dd53665c0c24cab86870a21cf6434ae,FI:c1e86f31eb2c4c5f8e8615a5189e9b19",
				  sortDirection: 0
				}
			  ],
			scope: 'Global'
		};

		CherwellAPI.getSearchResults(search).then(async results => {
			const ticketsRaw = JSON.parse(results).businessObjects;
			const tickets = [];
			for (const ticket of ticketsRaw) {
				let specifics = await CherwellAPI.getRelatedBusinessObjects(ticket.busObId, ticket.busObRecId, '933a679f9955f58f203e6d459592f5f19a87a9b622');
				specifics = JSON.parse(specifics).relatedBusinessObjects[0];
				const ticketRaw = {
					id: ticket.busObPublicId,
					subCategory: ticket.fields.find(f => f.name === 'Subcategory')['value'],
					createdDateTime: ticket.fields.find(f => f.name === 'CreatedDateTime')['value'],
					summary: ticket.fields.find(f => f.name === 'Summary')['value'],
					customerDisplayName: ticket.fields.find(f => f.name === 'CustomerDisplayName')['value'],
					oldResponse: specifics.fields.find(f => f.name === 'CommencementChoice')['value'],
					oldResponseDesc: specifics.fields.find(f => f.name === 'CommencementChoiceDesc')['value'],
				};
				tickets.push(ticketRaw);
			}
			

			return res.json(
				{
					count: tickets.length,
					tickets
				}
			);
		}).catch(err => {
			logger.err(err);
			return res.status(400).json(
				{
					status: 400,
					reason: 'bad request'
				}
			);
		});
	},
	reopenIncident: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				const formData = req.body.journal && req.body.journal.formData ? req.body.journal.formData : null;
				let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
				customer = JSON.parse(customer).businessObjects[0];
				const customerFullName = customer.fields.find(f => f.name === 'PreferredName')['value'];
				return CherwellAPI.getBusinessObject('6dd53665c0c24cab86870a21cf6434ae', req.body.ticketID).then(async ticket => {
					ticket = JSON.parse(ticket);
					let canUpdateTicket = false;
					if (ticket.fields.filter(field => field.fieldId === 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f')[0].value === customer.busObRecId) {
						canUpdateTicket = true;
					} else if (await G.checkPermissions({req, entity: 'ticket', level: 'publish'})) {
						canUpdateTicket = true;
					}
					if (canUpdateTicket) {
						CherwellAPI.createJournalForIncident(ticket, customer.busObRecId, formData, customerFullName, 'Reopened').then(journal => {
							journal = JSON.parse(journal);
							CherwellAPI.reopenIncident(ticket).then(() => {
								return res.json({ticket, journal});
							}).catch(err => {
								return next(err);
							});
						}).catch(err => {
							return next(err);
						});
					} else {
						return next(403);
					}
				}).catch(err => {
					return next(err);
				});
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	},
	closeIncident: (req, res, next) => {
		G.verifyGrecaptchaToken(req.body.token, req.ip).then(async data => {
			if (data && data.success && data.score > 0.5) {
				let customer = await CherwellAPI.getCustomerByID(req.user.employeeID);
				customer = JSON.parse(customer).businessObjects[0];
				return CherwellAPI.getBusinessObject('6dd53665c0c24cab86870a21cf6434ae', req.body.ticketID).then(async ticket => {
					ticket = JSON.parse(ticket);
					let canUpdateTicket = false;
					if (ticket.fields.filter(field => field.fieldId === 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f')[0].value === customer.busObRecId) {
						canUpdateTicket = true;
					} else if (await G.checkPermissions({req, entity: 'ticket', level: 'publish'})) {
						canUpdateTicket = true;
					}
					if (canUpdateTicket) {
						CherwellAPI.closeIncident(ticket).then(result => {
							result = JSON.parse(result);
							return res.json({ticket, result});
						}).catch(err => {
							return next(err);
						});
					} else {
						return next(403);
					}
				}).catch(err => {
					return next(err);
				});
			} else {
				return next(400);
			}
		}).catch(err => next(err));
	}
};