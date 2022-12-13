const CherwellTokenCache = require('../../models/CherwellTokenCache.js');
const request = require('request');
const requestPromise = require('request-promise-native');
const jar = request.jar();
const logger = require('../logger.js');
const moment = require('moment');
const { time } = require('cron');

module.exports = class Cherwell {
	constructor() {
		this.baseURL = 'https://wpi.cherwellondemand.com/CherwellAPI/api/v1';
		this.businessObjectTypes = ['Major', 'Supporting', 'Lookup', 'Groups', 'All'];
		this.openStatuses = ['New', 'Open', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Reopened'];
		this.businessObjectIds = {};
		this.methods = {
			GET: 'GET',
			POST: 'POST'
		};
		this.configurationItemObjectIds = {
			ConfigurationItem: '9343f8800bd7ce14f0bf0a402d9d38be1a25069644',
			ConfigComputer: '9343f882f2b2ae64b1990c41c9bb68410bdbc23528',
			ConfigMobileDevice: '93ba37416cd565e13a2d2c4f2d8dcb287a17f7091f',
			ConfigNetworkDevice: '9343f947d5000ac81406e746f0975ddeb11c184480',
			ConfigNotInventoried: '94336f21e11946efaaa61e4423bac4f85d13800afd',
			ConfigOtherCI: '937af9c16498e715862e3c4b8eb9d4752e42f77958',
			ConfigPrinter: '935883280b5c9ceba231ae4fda9645206bee0e851e',
			ConfigServer: '93dada9f640056ce1dc67b4d4bb801f69104894dc8',
			ConfigSoftwareLicense: '9344e32d133f965792802043f4978ca3b1c18edddb',
			ConfigSystem: '938a03db7c7ed3c89b7d7a4cb5b27ff77593c2d5bb',
			ConfigTelephonyEquipment: '9343f9371e829021867e8a44e59b5045bdaccdd491'
		};
	}

	// API

	createIncident(customerID, formData, customerFullName) {
		return new Promise((resolve, reject) => {
			let assignTeam = "";
			if(formData.type == "feedback"){
				assignTeam = "ITSM";
			}else{
				assignTeam = "Service Desk";
			}
			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: 'New Ticket From Portal'
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Incident'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: assignTeam || 'Service Desk'
					}
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: `<p><strong>Full Name:</strong> ${formData.fullName}</p>
							<p><strong>WPI Email Address:</strong> ${formData.wpiEmail}</p>
							<p><strong>WPI ID #:</strong> ${formData.wpiID}</p>
							<p><strong>Preferred Email Address:</strong> ${formData.preferredEmail}</p>
							<p><strong>Preferred Phone Number:</strong> ${formData.preferredPhone}</p>
							${formData.impact ? `<p><strong>This ticket impacts:</strong> ${formData.impact}</p>` : ''}
							${formData.experience ? `<p><strong>This experience was:</strong> ${formData.experience}</p>` : ''}
							<p><strong>Details:</strong> ${formData.details}</p>
							<p><strong>Source:</strong> ${formData.source}</p>
							<p><strong>Ticket Type:</strong> ${formData.type}</p>`
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}
				this.saveRelatedBusinessObject(journalPayload).then(() => {
					return resolve(JSON.stringify(ticket));
				}).catch(err => {
					return reject(err);
				});
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createIncidentiCigna(formData) {
		return new Promise((resolve, reject) => {
			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Event'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: formData.summary || "Network Device Event"
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Incident'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'Network Operations Staff'
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138',
						value: formData.details || "No Details Provided"
					},
					{ // Service
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4',
						value: 'Network Management'
					},
					{ // Category
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa',
						value: 'Network Hardware'
					},
					{ // Subcategory
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
						value: 'Automated Network Event'
					}
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: '93db6da57bde4b909d98d340d59e22c974abd9c903' // Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				return resolve(JSON.stringify(ticket));

			}).catch(err => {
				return reject(err);
			});
		});
	}
	createOnboardingTask(formData) {
		return new Promise((resolve, reject) => {
			var destination = ''
			if (process.env.NODE_ENV === 'development') {
				destination = 'ITSM'
			}else{
				destination = formData.destination
			}
			const payload = {
				busObId: '9355d5ed41e384ff345b014b6cb1c6e748594aea5b', // WorkItem
				fields: [
					{ // ParentRecID
						dirty: true,
						fieldId: 'BO:9355d5ed41e384ff345b014b6cb1c6e748594aea5b,FI:9355d6d6f3d7531087eab4456482100476d46ac59b',
						value: formData.recid
					},
					{ // Parent Type Name
						dirty: true,
						fieldId: 'BO:9355d5ed41e384ff345b014b6cb1c6e748594aea5b,FI:9355d6d84625cc7c1a7a48435ea878328f1646c7af',
						value: "Onboarding"
					},
					{ // Parent Public ID
						dirty: true,
						fieldId: 'BO:9355d5ed41e384ff345b014b6cb1c6e748594aea5b,FI:9387d7efd191c18d9f954747a08ed7765b883e0925',
						value: formData.publicid
					},
					{ // Title
						dirty: true,
						fieldId: 'BO:9355d5ed41e384ff345b014b6cb1c6e748594aea5b,FI:93ad98a2d68a61778eda3d4d9cbb30acbfd458aea4',
						value: "[Onboarding] "+ formData.title
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:9355d5ed41e384ff345b014b6cb1c6e748594aea5b,FI:9355d5ef648edf7a8ed5604d56af11170cce5dc25e',
						value: formData.description
					},
					{ // Assigned Team
						dirty: true,
						fieldId: 'BO:9355d5ed41e384ff345b014b6cb1c6e748594aea5b,FI:93cfd5a4e10af4933a573444d08cbc412da491b42e',
						value: destination
					}
					

				],
				persist: true
			};
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				return resolve(JSON.stringify(ticket));

			}).catch(err => {
				return reject(err);
			});
		});
	}
	updateRegApproval(userAttributes, formData, moment){
		return new Promise((resolve, reject) => {
			const payload = {
				busObId: '94644c61359570d6f38f634caaa62c422d5d940a12', // Registration Approval
				busObPublicId: formData.busObPublicId,
				busObRecId: formData.busObRecId,
				fields: [
					{ // Status
						dirty: true,
						fieldId: 'BO:94644c61359570d6f38f634caaa62c422d5d940a12,FI:94644c690b88f4689430c94470be433b8218114dba',
						value: formData.status || "Waiting"
					},
					{ // Approved By name
						dirty: true,
						fieldId: 'BO:94644c61359570d6f38f634caaa62c422d5d940a12,FI:94644d4a5182aa17210ce54e98b6e4b310664ab738',
						value: userAttributes.displayname || ""
					},
					{ // Approved By ID
						dirty: true,
						fieldId: 'BO:94644c61359570d6f38f634caaa62c422d5d940a12,FI:94644d4a7a1674ff5d79bd44fa86aae2bd7ccebe99',
						value: userAttributes.employeeID || ""
					},
					{ // Approval time
						dirty: true,
						fieldId: 'BO:94644c61359570d6f38f634caaa62c422d5d940a12,FI:94644d4b7bc17bc7915f47448891e67cca6e017cad',
						value: moment || ""
					},
				],
				persist: true
			};
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				logger.info(ticket);
				return resolve(JSON.stringify(ticket));

			}).catch(err => {
				return reject(err);
			});
		});
	}
	removeMoveIn(userAttributes, formData){
		return new Promise((resolve, reject) => {
			const payload2 = {
				busObId: '946b8fe4d90d1f85369cf6492c9235feab50cc00a8', //Movein Registration
				busObPublicId: formData.busObPublicId,
				busObRecId: formData.busObRecId,
				fields: [
					{ // Status
						dirty: true,
						fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fe95135c556cae5c743008d03800c78e98b45',
						value: "Void"
					},

				],
				persist: true
			};


			const payload = {
				busObId: '946656451978e6e6dca4e34c149e5817f3e8c308fb', //Intent
				busObPublicId: formData.intentBusObPublicId,
				busObRecId: formData.intentBusObRecId,
				fields: [
					{ // Move-InTime
						dirty: true,
						fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:946baa7057fa554ff4615c4b229e73e858fa2ec9cc',
						value: "1/1/1900 12:00:00 AM"
					},

				],
				persist: true
			};

			Promise.all([this.saveBusinessObject(payload), this.saveBusinessObject(payload2)]).then(() => {
				return resolve("success");
			}).catch(err => {
				return reject(err);
			});
			
		})
	}

	addMoveIn(employeeID, formData){
		
		return new Promise((resolve, reject) => {
			const payload = {
				busObId: '946b8fe4d90d1f85369cf6492c9235feab50cc00a8', // Registration Approval
				fields: [
					{ // WPI ID
						dirty: true,
						fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fe7033497a1f9b5064f389b3736168bd2140d',
						value: employeeID
					},
					{ // Time ID
						dirty: true,
						fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8feb102ed57a95a43348a1b0166eea1825f80c',
						value: formData.timeID
					},
					{ // Helper Name
						dirty: true,
						fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946ba94b6f95850ddd0f9e4505b014c4a8d85762a1',
						value:  formData.helperName || ""
					},
					{ // Helper Phone
						dirty: true,
						fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946ba94bc421bca49e224d4518ad74524f856b0b3d',
						value: formData.helperPhone || ""
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:946b8fe4d90d1f85369cf6492c9235feab50cc00a8,FI:946b8fe95135c556cae5c743008d03800c78e98b45',
						value: "Active"
					},
				],
				persist: true
			};
			this.saveBusinessObject(payload).then(ticket => {
				return resolve(JSON.stringify(ticket));

			}).catch(err => {
				return reject(err);
			});
		});
	}
	updateIntent(userAttributes, formData, moment){
		return new Promise((resolve, reject) => {
			let statusUp = formData.status == "Waiting" ? "Completed" : formData.status;
			var  payload = {};

		if(formData.term == "202201" && formData.pterm == "A" ){
			const dateOut = formData.date != '' ? new Date(formData.date) : '';
			payload = {
				busObId: '946656451978e6e6dca4e34c149e5817f3e8c308fb', //  intent
				busObPublicId: formData.busObPublicId,
				busObRecId: formData.busObRecId,
				fields: [
					{ // Status
						dirty: true,
						fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:94665697bb9467c280b2c34ec6b2d235d00dfe9286',
						value: "Completed"
					},
					{ // Date Completed
						dirty: true,
						fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:94665672ad7cc7b37e27ab4d0ba0e9f194121467ce',
						value: moment
					},
					{ // Onboarding Test 1
						dirty: true,
						fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9469e8bc464814435a10474973b683bc632ac82dd3',
						value: dateOut
					},
					{ // Come to Campus
						dirty: true,
						fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9466564a2b3809dd622cd247f08b0d2cd714d37424',
						value: formData.comeToCampus
					},
					{ // bterm2021Onboarder
						dirty: true,
						fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:94799e008ed9ac89aa51af4100b574d61bc4d2c95a',
						value: true
					},
					{ // bterm2021Complete
						dirty: true,
						fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:94799e00f895dcf9c2c5004c7695e942d7bf3e55f2',
						value: true
					},
					
				],
				persist: true
			};

		}
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				return resolve(JSON.stringify(ticket));

			}).catch(err => {
				return reject(err);
			});
		});
	}

	updateWaiver(userAttributes, formData, moment){
		return new Promise((resolve, reject) => {
			var  payload = {};

			if(formData.term == "202201" && formData.pterm == "A" ){
				payload = {
					busObId: '946656451978e6e6dca4e34c149e5817f3e8c308fb', //  intent
					busObPublicId: formData.busObPublicId,
					busObRecId: formData.busObRecId,
					fields: [
						
						{ //Testing Consent 2022
							dirty: true,
							fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9488c5712cdd5d119fd7c14919809f88834d7d36fb',
							value: true
						},
						{ //Testing Consent Date 2022
							dirty: true,
							fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9488c571ddf925f73655234110b989748ed4da054a',
							value: moment
						},
						{ //Testing Consent Text1 2022
							dirty: true,
							fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9488c574f7cf60cd2de51e4915a321155de9029614',
							value: formData.text1
						},
						{ //Testing Consent Text2 2022
							dirty: true,
							fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9488c5758d30ba92a339ca44169a681279248361ed',
							value: formData.text2
						},


					],
					persist: true
				};
				if(formData.isMinor == "true"){
					payload.fields.push(
						{ //Testing Consent Minor
							dirty: true,
							fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9488c574960a0d842687db47e6b827b944ff65678d',
							value: true
						},
						{ //Testing Consent Guardian Name
							dirty: true,
							fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9488c5763faea7d6c7d492400f947f04118b627724',
							value: formData.guardName
						},
						{ //Testing Consent Guardian Relationship
							dirty: true,
							fieldId: 'BO:946656451978e6e6dca4e34c149e5817f3e8c308fb,FI:9488c57744a3de005629fd464bb1ff627cb3d7714d',
							value: formData.guardRel
						},
					)
				}

			}
				this.saveBusinessObject(payload).then(ticket => {
					ticket = JSON.parse(ticket);
					return resolve(JSON.stringify(ticket));

				}).catch(err => {
					return reject(err);
				});
		});
	}
	updateContractDelegate(userAttributes, formData){
		return new Promise((resolve, reject) => {
			var  payload = {};
			if (formData.requestType == "updated"){
				payload = {
					busObId: '948c105be76790c672e88449c3bfc3ba90da8e30b6', //  Contract Delegate
					busObPublicId: formData.busObPublicId,
					busObRecId: formData.busObRecId,
					//TODO Add req WPI id to journal; and or add valdiation that REQ WPI ID == Lookup REQ ID
					fields: [
						
						{ //Delegatee Legal Name
							dirty: true,
							fieldId: 'BO:948c105be76790c672e88449c3bfc3ba90da8e30b6,FI:948d4d250feb6ff448491d4d19969446a17e1d84dd',
							value: formData.delegateeLegalName
						},	
						{ //Delegatee Sign Date
							dirty: true,
							fieldId: 'BO:948c105be76790c672e88449c3bfc3ba90da8e30b6,FI:948c106f409354ad79acec4d62ae2e6a9a6ac5ee60',
							value: Date.now()
						},		
						{ // Delegator Legal Name 
							dirty: true,
							fieldId: 'BO:948c105be76790c672e88449c3bfc3ba90da8e30b6,FI:948d320625e205240a14a64eefafa05f0a14932e4a',
							value: formData.delegatorLegalName
						},
						
					],
					persist: true
				} 

			}
			else {

			payload = {
				busObId: '948c105be76790c672e88449c3bfc3ba90da8e30b6', //  Contract Delegator
				// busObPublicId: formData.busObPublicId,
				// busObRecId: formData.busObRecId,
				//TODO Add req WPI id to journal; and or add valdiation that REQ WPI ID == Lookup REQ ID
				fields: [
					
					{ //Purpose
						dirty: true,
						fieldId: 'BO:948c105be76790c672e88449c3bfc3ba90da8e30b6,FI:948c106a62b16318b415674d89af531e977ab07748',
						value: formData.delegationPurpose
					},
					{ //Amount
						dirty: true,
						fieldId: 'BO:948c105be76790c672e88449c3bfc3ba90da8e30b6,FI:948c106aa0815bab099d4f430eaefb9c5a34d5414e',
						value: formData.delegationAmount
					},
					{ //Type
						dirty: true,
						fieldId: 'BO:948c105be76790c672e88449c3bfc3ba90da8e30b6,FI:948c1064eb8b396533642542d6bde29c0fe964039f',
						value: formData.delegationType
					},
					{ // Period Start
						dirty: true,
						fieldId: 'BO:948c105be76790c672e88449c3bfc3ba90da8e30b6,FI:948c106c013ff4bd44e4e14a88aa9cd81c111ae9a3',
						value: formData.delegationTypeDateStart
					},
					{ // Period End
						dirty: true,
						fieldId: 'BO:948c105be76790c672e88449c3bfc3ba90da8e30b6,FI:948c106c75f15f3bc14274458ca8314ca60c077e6a',
						value: formData.delegationTypeDateEnd
					},
					{ // Delegator Legal Name 
						dirty: true,
						fieldId: 'BO:948c105be76790c672e88449c3bfc3ba90da8e30b6,FI:948d320625e205240a14a64eefafa05f0a14932e4a',
						value: formData.delegatorLegalName
					},
					{ // Delegator Sign Date
						dirty: true,
						fieldId: 'BO:948c105be76790c672e88449c3bfc3ba90da8e30b6,FI:948c106ea4ba337606af174933a02bd66aee4f0078',
						value: Date.now()
					},
					{ // Delegator ID
						dirty: true,
						fieldId: 'BO:948c105be76790c672e88449c3bfc3ba90da8e30b6,FI:948c10635f0a2d07d8ae9a408996bf23f291825dc5',
						value: formData.delegatorID
					},
					{ // Delegatee ID
						dirty: true,
						fieldId: 'BO:948c105be76790c672e88449c3bfc3ba90da8e30b6,FI:948c10642d9b0c28709fab47ea8f43416cb0fc8eb1',
						value: formData.delegateeID
					}
					
				],
				persist: true
			} }

			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				return resolve(JSON.stringify(ticket));

			}).catch(err => {
				return reject(err);
			});
		});
	}

	commencementTicketCheckIn(employeeID, formData, date){

		return new Promise((resolve, reject) => {

			var  payload = {};

			payload = {
				busObId: '9481e2daa8766b783b868a448089fb5dff45111855', //  Commencement Ticket
				busObRecId: formData.RecID,
				fields: [
					{ // Status
						dirty: true,
						fieldId: 'BO:9481e2daa8766b783b868a448089fb5dff45111855,FI:9481e2ee9fcb9b5ce4b6d04fa9889c785899b92c24',
						value: "Checked-In"
					},
					{ // CurrentDate
						dirty: true,
						fieldId: 'BO:9481e2daa8766b783b868a448089fb5dff45111855,FI:9481e2f02d241fb9788be7475580129d1d795bf05c',
						value: date || null
					},
					{ // Location (user)
						dirty: true,
						fieldId: 'BO:9481e2daa8766b783b868a448089fb5dff45111855,FI:9481e2f0831ff222b6a639427c88c5a43baa4d2423',
						value: employeeID || null
					},
				],
				persist: true
			};
		
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				return resolve(JSON.stringify(ticket));

			}).catch(err => {
				return reject(err);
			});
		});
	}
	updateCommencementRSVP(employeeID, formData, busobj){
		const userID = busobj.fields.find(f => f.name === 'WPIID')['value'];
		const ticketCount = busobj.fields.find(f => f.name === 'WPIID')['value'];

		return new Promise((resolve, reject) => {
			if(employeeID != userID){
				return reject("IDs do not Match")
			}
			var  payload = {};
			var outputStatus = "";
			if(formData.RSVP == "yes"){
				outputStatus = "Attending"
			}
			if(formData.RSVP == "no"){
				outputStatus = "Not Attending"
			}
			payload = {
				busObId: '9481e02f1260cf5b7e9b1e4855b144b5c1795b2a28', //  Commencement RSVP Form
				busObRecId: formData.RecID,
				fields: [
					{ // Status
						dirty: true,
						fieldId: 'BO:9481e02f1260cf5b7e9b1e4855b144b5c1795b2a28,FI:9481e0938f6dab5b6f0cd44043b0037cde28aff4e1',
						value: outputStatus || "Awaiting Response"
					},

				],
				persist: true
			};
		
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				return resolve(JSON.stringify(ticket));

			}).catch(err => {
				return reject(err);
			});
		});
	}
	createCommencementGuest(employeeID, formData, busobj, activeTickets){
		const userID = busobj.fields.find(f => f.name === 'WPIID')['value'];
		const allowedTickets = busobj.fields.find(f => f.name === 'TicketAllocation')['value'];
		const activeTicketsCount = activeTickets.length;

		return new Promise((resolve, reject) => {
			if(employeeID != userID){
				return reject(Error("IDs do not Match"))
			}
			if(activeTicketsCount >= allowedTickets || allowedTickets == 0){
				return reject(Error("Too Many Tickets"))
			}
			var  payload = {};

			payload = {
				busObId: '9481e2daa8766b783b868a448089fb5dff45111855', //  Commencement Ticket
				fields: [
					{ // RecID
						dirty: true,
						fieldId: 'BO:9481e2daa8766b783b868a448089fb5dff45111855,FI:9481e2dc3b9228171a867346c987166875484246d3',
						value: formData.RecID
					},
					{ // Attendee First
						dirty: true,
						fieldId: 'BO:9481e2daa8766b783b868a448089fb5dff45111855,FI:9481e2ec4088accba9baad48ce8cdc15300eee54b0',
						value: formData.guestFirst
					},
					{ // Attendee Last
						dirty: true,
						fieldId: 'BO:9481e2daa8766b783b868a448089fb5dff45111855,FI:9481e2ec6a46e8549fae7349a9aad69a673e54f775',
						value: formData.guestLast
					},
					{ // Attendee Email
						dirty: true,
						fieldId: 'BO:9481e2daa8766b783b868a448089fb5dff45111855,FI:9481e2e72c1249b539a4ea40bbb709ab645c702980',
						value: formData.guestEmail
					},

				],
				persist: true
			};
		
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				return resolve(JSON.stringify(ticket));

			}).catch(err => {
				return reject(err);
			});
		});
	}
	voidCommencementGuest(employeeID, formData){

		return new Promise((resolve, reject) => {
			
			var  payload = {};

			payload = {
				busObId: '9481e2daa8766b783b868a448089fb5dff45111855', //  Commencement Ticket
				busObRecID: formData.RecID,
				fields: [
					{ // Status
						dirty: true,
						fieldId: 'BO:9481e2daa8766b783b868a448089fb5dff45111855,FI:9481e2ee9fcb9b5ce4b6d04fa9889c785899b92c24',
						value: "Void"
					},
					{ // Void Reason
						dirty: true,
						fieldId: 'BO:9481e2daa8766b783b868a448089fb5dff45111855,FI:9481e313af15f60e7155d8484680843cc1a5176bda',
						value: "Void by Student"
					},

				],
				persist: true
			};
		
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				return resolve(JSON.stringify(ticket));

			}).catch(err => {
				return reject(err);
			});
		});
	}
	updateCommencementAcknowledgement(userAttributes, formData, moment){
		return new Promise((resolve, reject) => {
			var  payload = {};
			payload = {
				busObId: '9471b2f910d1a1cc5991e94d4b916c59096f6b946f', //  Commencement Form
				busObRecId: formData.busObRecId,
				fields: [
					{ // Status
						dirty: true,
						fieldId: 'BO:9471b2f910d1a1cc5991e94d4b916c59096f6b946f,FI:9471b301ed5257f5e3b3cb47038e40ac46a5479237',
						value: "Complete"
					},
					{ // Date Completed
						dirty: true,
						fieldId: 'BO:9471b2f910d1a1cc5991e94d4b916c59096f6b946f,FI:9471b3026e302da06fd7c2441d920364d2f8e02c26',
						value: moment
					},
					{ // Type
						dirty: true,
						fieldId: 'BO:9471b2f910d1a1cc5991e94d4b916c59096f6b946f,FI:9471b30228d510a339d0cb4154b4d771e2bcd6a073',
						value: formData.submitType
					},
					{ // Full Name
						dirty: true,
						fieldId: 'BO:9471b2f910d1a1cc5991e94d4b916c59096f6b946f,FI:9471b2ff98ad37b703249941f1a8fe4949835a29f4',
						value: formData.name
					},
					{ // WPI ID
						dirty: true,
						fieldId: 'BO:9471b2f910d1a1cc5991e94d4b916c59096f6b946f,FI:9471b3004e5826a415d3bc444a91f3fac2b43d77d7',
						value: formData.wpiID
					},
					{ // Email
						dirty: true,
						fieldId: 'BO:9471b2f910d1a1cc5991e94d4b916c59096f6b946f,FI:9471b3012f2ff82341977b4ae8a18979e79eb8d84e',
						value: formData.email
					},
					{ // Phone
						dirty: true,
						fieldId: 'BO:9471b2f910d1a1cc5991e94d4b916c59096f6b946f,FI:9471be07582bc997a98340438796ccd18895d8f3ef',
						value: formData.phone
					}

				],
				persist: true
			};

			if(formData.isGuardian == true || formData.isGuardian == "true" || formData.isGuardian == "True"){
				payload.fields.push(
					{ // Is Guardian
						dirty: true,
						fieldId: 'BO:9471b2f910d1a1cc5991e94d4b916c59096f6b946f,FI:9471b44b269854c51dd58449ada3371abf62c7d7e4',
						value: formData.isGuardian
					},
					{ // Guardian Name
						dirty: true,
						fieldId: 'BO:9471b2f910d1a1cc5991e94d4b916c59096f6b946f,FI:9471b44b79db1280c7979143d0ba3785eec6e4faaf',
						value: formData.guardName
					},
					{ // Guardian Phone
						dirty: true,
						fieldId: 'BO:9471b2f910d1a1cc5991e94d4b916c59096f6b946f,FI:9471b44e143aa659787afb4d13a4eec1dadffb2c4d',
						value: formData.guardPhone
					},
					{ // Guardian Email
						dirty: true,
						fieldId: 'BO:9471b2f910d1a1cc5991e94d4b916c59096f6b946f,FI:9471b44dcc547342a6b7704e31acb8641de2e04b29',
						value: formData.guardEmail
					},
				);
			}
		
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				return resolve(JSON.stringify(ticket));

			}).catch(err => {
				return reject(err);
			});
		});
	}
	updateCommencementVirtual(userAttributes, formData, file){
		
		const form = JSON.parse(formData);
		return new Promise((resolve, reject) => {

			var fileExtension = "";
			if(file.mimetype =="image/jpeg"){
				fileExtension = ".jpg";
			}else if(file.mimetype =="image/png"){
				fileExtension = ".png";
			}
			const fileName = form.WPIID + fileExtension

			var  payload = {};
			payload = {
				busObId: '946f2d8bcefc7371a40f794ec08278d036c7348cb0', //  Commencement Form
				busObRecId: form.busObRecId,
				fields: [
					{ // Virtual Status
						dirty: true,
						fieldId: 'BO:946f2d8bcefc7371a40f794ec08278d036c7348cb0,FI:947120e272633663878ee24c27871cfabb5be6bb88',
						value: "Complete"
					},
					{ // Quote
						dirty: true,
						fieldId: 'BO:946f2d8bcefc7371a40f794ec08278d036c7348cb0,FI:947120e2c022dfc303762245a3b94804d073e71495',
						value: form.quote
					},
					{ // FileName
						dirty: true,
						fieldId: 'BO:946f2d8bcefc7371a40f794ec08278d036c7348cb0,FI:94713c28a35d2a68a668b84dbbad0fbcd8c0a35c87',
						value: fileName
					},
				],
				persist: true
			};

			this.saveBusinessObject(payload).then(ticket => {
				this.uploadBuisinessObjectAttachment(fileName,"946f2d8bcefc7371a40f794ec08278d036c7348cb0",form.busObRecId,0,file.size,file).then(ticket => {
					ticket = ticket;
					return resolve(ticket);
				}).catch(err => {
					return reject(err);
				});
				

			}).catch(err => {
				return reject(err);
			});
		});
	}
	updateREU(userAttributes, formData, moment){
		return new Promise((resolve, reject) => {
			var  payload = {};
			payload = {
				busObId: '947051628214740ec43be6439cb5c437f11ea10ed9', //  REU Form
				
				fields: [
					{ // Status
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:9470525752cd209166eb064398b25fbd415b9ae2a6',
						value: formData.status
					},
					{ // department
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947052491686b157a42fa44ba79c0ec9c124bbfff6',
						value: formData.department
					},
					{ // nameFirst
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:9470521bdca6e779b3be1044e49a120a6500073336',
						value: formData.nameFirst
					},
					{ // nameFirst
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:9470521bf7a8424d76b97c405e8c0893c86b50c589',
						value: formData.nameLast
					},
					{ // homeUniversity
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:94705240ee80d7f105178045cf84a04bb42771ed96',
						value: formData.homeUniversity
					},
					{ // personalCell
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:9470521e09610a924a24cc408fa1b1d0c015f36b4a',
						value: formData.personalCell
					},
					{ // personalEmail
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:9470521cbff6247e9317514faabea92630372b07cb',
						value: formData.personalEmail
					},
					{ // dateOfBirth
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:9470521f847f66789438e94df2ad657a88cc2ff3ae',
						value: formData.dateOfBirth
					},
					{ // Home addr1
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947104cd0d5c1bd12295bc49e483f8b102e2025c01',
						value: formData.homeaddr1
					},
					{ // Home addr2
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947104cd625f39d330ff484ed2be3846da7e7234f3',
						value: formData.homeaddr2
					},
					{ // Home city
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947104cdbea75226e2ad02477f80c0475ea4288ccc',
						value: formData.homecity
					},
					{ // Home state
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947104ce41540c60c9e21849b28a0c1a25625b7b31',
						value: formData.homestate
					},
					{ // zip
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947104cea1f87cefcc64a74ad8af56deefdc217703',
						value: formData.homezip
					},
					{ // gender
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:9470521e719213d44aa22244d98b6b403c67594f2d',
						value: formData.gender
					},
					{ // genderOther
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947053182f530f0dac35154d5092aba51c2460a74c',
						value: formData.genderOther
					},
					{ // race
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:9470521edb6460c7793e2b40c99579a2e06ac63b22',
						value: formData.race
					},
					{ // raceOther
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947052777fd584175a4e3d427b861995c111480c92',
						value: formData.raceOther
					},
					{ // planToLive
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:9470522a85b803456c3e5b4a17b857630bf2540008',
						value: formData.planToLive
					},
					{ // offCampusDate
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:9470522d394aaa6d70c0df4a6ca61cfc3c0ee01b4b',
						value: formData.offCampusDate
					},
					{ // addr1
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947052239f953ee2cad70c4ad9af5aa8b97d5c551d',
						value: formData.addr1
					},
					{ // addr2
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:94705223dca38582058a1f4267a69a021a269783cf',
						value: formData.addr2
					},
					{ // city
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:94705224412141d7df196848b7a594f3387d0aa253',
						value: formData.city
					},
					{ // state
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947052245a53633d83436e44cea822b5cda9e4bc86',
						value: formData.state
					},
					{ // zip
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947052246e4d84f15346e8452b97d192c234226abb',
						value: formData.zip
					},
					{ // travelFrom
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:94705220a2d34d233012404bb282140c4042d96073',
						value: formData.travelFrom
					},
					{ // vaccineStatus
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:9470523e006a0ad1c1e9314f4b88c31134242a54ce',
						value: formData.vaccineStatus
					},
					{ // vaccineDate
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:9470523e6c587f3a15457e4d5e8ffbd62cb37fcd44',
						value: formData.vaccineDate
					},
					{ // insuranceProvider
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:94705230d7953d6674eb1a468586d3b9f18487a255',
						value: formData.insuranceProvider
					},
					{ // insuranceMember
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947052316faa3d85e2dc2a4e15bea9cfe24f790dcf',
						value: formData.insuranceMember
					},
					{ // emergencyName
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:9470522f9c7079b6829c454b09bfb69d090c778247',
						value: formData.emergencyName
					},
					{ // emergencyPhone
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:94705230301230069ab25a444e91b31345cc3bd9dd',
						value: formData.emergencyPhone
					},
					{ // emergencyRelationship
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:9470522fd63498efc1e5b24ec081106529d98ce16d',
						value: formData.emergencyRelationship
					},
					{ // dietaryNeeds
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:94705241a08385c6ff063e4afead80a634f7cd89c3',
						value: formData.dietaryNeeds
					},
					{ // accomodations
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947052427cec5d7c8a32ab4acca1605fb11ce59afc',
						value: formData.accomodations
					},


				],
				persist: true
			};
			if(formData.isEditor == true || formData.isEditor == "true"){
				payload.busObRecId = formData.busObRecId;
				payload.fields.push(
					{ // wpiID
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:9470521baf5f6110b335894a3ca62e6045b663e4f1',
						value: formData.wpiID
					},
					{ // formsI9
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:94705243d1e601c74a3300441fb90475dc55494fd8',
						value: formData.formsI9
					},
					{ // formsID
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947052467cb5fd903fc7ba4ccd94dca4fa71517f31',
						value: formData.formsID
					},
					{ // formsInternational
						dirty: true,
						fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947052454d017572e8cbf942019630505b9617db45',
						value: formData.formsInternational
					},
					// { // clearedPreArrival
					// 	dirty: true,
					// 	fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:9470524739c3f39a2a9dcf4f2481299ff8cb4ea96f',
					// 	value: formData.clearedPreArrival
					// },
					// { // clearedWaiver
					// 	dirty: true,
					// 	fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:9470524a300e4559311efa40e0bbe55996df34e638',
					// 	value: formData.clearedWaiver
					// },
					// { // clearedAlden
					// 	dirty: true,
					// 	fieldId: 'BO:947051628214740ec43be6439cb5c437f11ea10ed9,FI:947052479fd578d06aef1d4285bbc835614513ecbb',
					// 	value: formData.clearedAlden
					// }
				);
			}
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				return resolve(JSON.stringify(ticket));

			}).catch(err => {
				return reject(err);
			});
		});
	}
	updateApproval(userAttributes, formData, moment){
		return new Promise((resolve, reject) => {
			const payload = {
				busObId: '9465996db3ca51cce7e8aa47d8baa52b3ad8672f00', //  Approval
				busObPublicId: formData.busObPublicId,
				busObRecId: formData.busObRecId,
				fields: [
					{ // Status
						dirty: true,
						fieldId: 'BO:9465996db3ca51cce7e8aa47d8baa52b3ad8672f00,FI:9465997a9166e2db5a83344c92aa2ba947a0b359e3',
						value: formData.status || "Waiting"
					},
					{ // Approval Note
						dirty: true,
						fieldId: 'BO:9465996db3ca51cce7e8aa47d8baa52b3ad8672f00,FI:946633ad0b7231fb08a78e4b34b7e3d9e6626d6c95',
						value: formData.note || ""
					},
					{ // Approval time
						dirty: true,
						fieldId: 'BO:9465996db3ca51cce7e8aa47d8baa52b3ad8672f00,FI:94663aab76d088b346306241b795b3cb6f2e89c631',
						value: moment || ""
					},
				],
				persist: true
			};
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				logger.info(ticket);
				return resolve(JSON.stringify(ticket));

			}).catch(err => {
				return reject(err);
			});
		});
	}

	
	createIncidentCovid19(customerID, formData, customerFullName) {
		return new Promise((resolve, reject) => {
			let detailsValue = `<strong>Source:</strong> ${formData.source}<br>
			<strong>Type</strong>: ${formData.type}<br>
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Submitting User</p>
			<strong>Full Name:</strong> ${formData.fullName}<br>
			<strong>Department:</strong> ${formData.department}<br>
			<strong>WPI ID #:</strong> ${formData.wpiID}<br>
			<strong>WPI Email:</strong> ${formData.wpiEmail}<br>
			<strong>WPI Phone:</strong> ${formData.wpiPhone}<br>
			<hr>
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Center Information</p>

			<strong>Center</strong><br>
			<span style="font-size:.7em;font-style: italic;">Based on physical location, is your lab within a Research Center?</span><br>
			${formData.RLR_1}<br>
			<strong>Center Director's Name</strong><br>
			${formData.RLR_2}<br>
			<strong>Center Director's Email</strong><br>
			${formData.RLR_3}<br>
			<strong>Department Head</strong><br>
			<span style="font-size:.7em;font-style: italic;">Choose Department Head, Center Director, or other supervisor overseeing this lab for compliance</span><br>
			${formData.RLR_4}<br>

			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Personnel Justification</p>
			<strong>Personnel Justification</strong><br>
			<span style="font-size:.7em;font-style: italic;">For any personnel who are ready to return to on-campus work, please explain why their in-person presence is considered a priority.</span><br>
			${formData.RLR_5}<br>
			<strong>Personnel Travel</strong><br>
			<span style="font-size:.7em;font-style: italic;">Do you have lab members who have recently traveled to other states or outside the U.S. during the past 4 weeks?</span><br>
			${formData.RLR_6}<br>
			<strong>Lab Safety Training</strong><br>
			<span style="font-size:.7em;font-style: italic;">Are you and all members of your laboratory up to date on laboratory safety training?</span><br>
			${formData.RLR_7}<br>
			<strong>WPI ID Cards</strong><br>
			<span style="font-size:.7em;font-style: italic;">WPI ID Cards: Do you and all members of your laboratory have their WPI ID Cards?</span><br>
			${formData.RLR_8}<br>
			<strong>Card Printing</strong><br>
			<span style="font-size:.7em;font-style: italic;">If “No,” please write the name of any lab members who will need a WPI ID Card reprinted prior to returning to campus.</span><br>
			${formData.RLR_9}<br>

			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Grant Support</p>
			<strong>Grants (if Applicable)</strong><br>
			<span style="font-size:.7em;font-style: italic;">If the research is grant funded what are the timelines associated with each grant?</span><br>
			${formData.RLR_10}<br>

			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Space and Equipment</p>
			<strong>Building in which the lab is located. </strong><br>
			${formData.RLR_11}<br>
			<strong>Floor(s) & Room(s)</strong><br>
			<span style="font-size:.7em;font-style: italic;">Please provide the floor/s and list all room numbers for the lab.</span><br>
			${formData.RLR_12}<br>
			<strong>Shared Space</strong><br>
			<span style="font-size:.7em;font-style: italic;">Do you use any shared spaces with other labs?</span><br>
			${formData.RLR_13}<br>
			<strong>Shared Space Function</strong><br>
			<span style="font-size:.7em;font-style: italic;">What shared space(s) do you use? How often and for what purpose(s)?</span><br>
			${formData.RLR_14}<br>
			<strong>Equipment Checks</strong><br>
			<span style="font-size:.7em;font-style: italic;">Have you or emergency responder staff been able to check on the status of lab equipment since you ramped down your on-campus lab in March?</span><br>
			${formData.RLR_15}<br>
			<strong>Equipment Status</strong><br>
			<span style="font-size:.7em;font-style: italic;">Is all lab equipment in working order?</span><br>
			${formData.RLR_16}<br>
			<strong>Supply Level</strong><br>
			<span style="font-size:.7em;font-style: italic;">Do you have sufficient Laboratory Supplies/Reagents?</span><br>
			${formData.RLR_17}<br>
			<strong>Supply Resupply</strong><br>
			<span style="font-size:.7em;font-style: italic;">When will laboratory supplies and reagents need to be replenished? Give time frame relative to the date of completion of this form.</span><br>
			${formData.RLR_18}<br>
			<strong>PPE Level</strong><br>
			<span style="font-size:.7em;font-style: italic;">Do you have sufficient PPE?</span><br>
			${formData.RLR_19}<br>
			<strong>PPE Resupply</strong><br>
			<span style="font-size:.7em;font-style: italic;">When will PPE need to be replenished? Give time frame relative to the date of completion of this form</span><br>
			${formData.RLR_20}<br>
			<strong>Cleaning Supply Level</strong><br>
			<span style="font-size:.7em;font-style: italic;">Do you have sufficient cleaning and disinfecting supplies?</span><br>
			${formData.RLR_21}<br>
			<strong>Cleaning Supply Resupply</strong><br>
			<span style="font-size:.7em;font-style: italic;">When will cleaning and disinfecting supplies need to be replenished? Give time frame relative to the date of completion of this form.</span><br>
			${formData.RLR_22}<br>
			<strong>Core Facilities Use</strong><br>
			<span style="font-size:.7em;font-style: italic;">Will you need access to core facilities to resume research?</span><br>
			${formData.RLR_23}<br>
			<strong>Core Facilities</strong><br>
			<span style="font-size:.7em;font-style: italic;">Which core facilities do you need access to? Do you require assistance to operate the instruments?</span><br>
			${formData.RLR_24}<br>
			`
			if(formData.RLR_25 == 'yes'){
				detailsValue += `
				<p style="font-weight:600;color:#c1272d;font-size:1.4em">Animal Research</p>
				<strong>Animal Use</strong><br>
				<span style="font-size:.7em;font-style: italic;">Do you use animals in your work?</span><br>
				${formData.RLR_25}<br>
				<strong>Animal Timeline</strong><br>
				<span style="font-size:.7em;font-style: italic;">Please describe the timeline for animal colony regeneration and what needs you will have for services from the vivarium staff, including routine and specialty services.</span><br>
				${formData.RLR_26}<br>
				<strong>Animal Order</strong><br>
				<span style="font-size:.7em;font-style: italic;">When will you need to order animals again? Give time frame relative to the date of completion of this form.</span><br>
				${formData.RLR_27}<br>
				<strong>Animal Housing Access</strong><br>
				<span style="font-size:.7em;font-style: italic;">When do you anticipate entering the vivarium? Give an estimated time frame based on the date of resumption of research activity.</span><br>
				${formData.RLR_28}<br>
			`
			}
			
			detailsValue += `
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Laboratory Reopening and Social Distancing Plan</p>
			
				<strong>Research Project(s)</strong><br>
				${formData.LRSD_1}<br>
				<strong>Rationale for Return to On-Campus Research</strong><br>
				${formData.LRSD_2}<br>
				<strong>Social Distancing</strong><br>
				${formData.LRSD_3}<br>
				<strong>Hygiene Protocols</strong><br>
				${formData.LRSD_4}<br>
				<strong>Staffing and Operations</strong><br>
				${formData.LRSD_5}<br>
				<strong>Cleaning and Disinfecting</strong><br>
				${formData.LRSD_6}<br>
				<strong>Other</strong><br>
				${formData.LRSD_7}<br>
				<strong>Ramp-down Plan</strong><br>
				${formData.LRSD_8}<br>
			`
			if (formData.users && formData.users.length) {
			detailsValue += `<p style="font-weight:600;color:#c1272d;font-size:1.4em">Additional People</p>
							<table style="border-collapse: collapse;width:100%;" >
							<tr style="border:1px solid #e6e6e6;padding:.25em;background-color:#c1272d;color:#fff;">
								<th>Name</th>
								<th>WPI ID</th>
								<th>Email</th>
								<th>Type</th>
								<th>Phase</th>
								<th>Funding</th>
								<th>Remotely?</th>
								<th>Safe Return</th>
								<th>Residence</th>
								<th>Appointment Yr</th>
								<th>Grad Year / Year of Study</th>
							</tr>`
			for (const user of formData.users) {
			detailsValue += `<tr style="border:1px solid #e6e6e6;padding:.25em">
				<td>${user.usersName}</td>
				<td>${user.usersID}</td>
				<td>${user.usersEmail}</td>
				<td>${user.usersType}</td>
				<td>${user.usersPhase}</td>
				<td>${user.usersfunding}</td>
				<td>${user.usersRemote}</td>
				<td>${user.usersSafety}</td>
				<td>${user.usersReside}</td>
				<td>${user.usersAppointment}</td>
				<td>${user.usersGradYear}</td>
			</tr>
			`;
			}
			detailsValue += `</table>`
			}
			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: 'Research Lab Reopening Webform'
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Incident'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'DR Response'
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138',
						value: detailsValue
					},
					{ // Impact
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:ae05c132527e48bd95d063c445622df7',
						value: 'Must Have'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:29d741aae8bf461f8aafa3c9eb4dc822',
						value: 'Expedite'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:83c36313e97b4e6b9028aff3b401b71c',
						value: '1'
					},
					{ // Service
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4',
						value: 'DR Response'
					},
					{ // Category
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa',
						value: 'Campus Access'
					},
					{ // Subcategory
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
						value: 'Research Lab Reopening Form'
					},
					{ // Debt Head
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:945f9ed2b24581fed57c3e41b6886e25b4ea31f49e',
						value: formData.RLR_4 != 'undefined' ? formData.RLR_4 : ''
					},

					
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: detailsValue
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}
				this.saveRelatedBusinessObject(journalPayload).then(() => {
					return resolve(JSON.stringify(ticket));
				}).catch(err => {
					return reject(err);
				});
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createIncidentCovid19Add(customerID, formData, customerFullName) {
		return new Promise((resolve, reject) => {
			let detailsValue = `<strong>Source:</strong> ${formData.source}<br>
			<strong>Type</strong>: ${formData.type}<br>
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Submitting User</p>
			<strong>Full Name:</strong> ${formData.fullName}<br>
			<strong>Department:</strong> ${formData.department}<br>
			<strong>WPI ID #:</strong> ${formData.wpiID}<br>
			<strong>WPI Email:</strong> ${formData.wpiEmail}<br>
			<strong>WPI Phone:</strong> ${formData.wpiPhone}<br>
			<hr>
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Research Lab Plan Update</p>

			<strong>Original Ticket #</strong><br>
			<span style="font-size:.7em;font-style: italic;"> Original Ticket</span><br>
			${formData.RLR_1}<br>
			<strong>Modified Social Distancing Plan </strong><br>
			<span style="font-size:.7em;font-style: italic;">Please provide any modifications needed for your Social Distancing plans to accomodate additional personnel.</span><br>
			${formData.RLR_2}<br>

			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Personnel Justification Updates</p>
			<strong>Personnel Justification</strong><br>
			<span style="font-size:.7em;font-style: italic;">For any personnel additions who are ready to return to on-campus work, please explain why their in-person presence is considered a priority.</span><br>
			${formData.RLR_5}<br>
			<strong>Personnel Travel</strong><br>
			<span style="font-size:.7em;font-style: italic;">Have any of these additional lab members recently traveled to other states or outside the U.S. during the past 4 weeks?</span><br>
			${formData.RLR_6}<br>
			<strong>Lab Safety Training</strong><br>
			<span style="font-size:.7em;font-style: italic;">Are these additional personnel up to date on laboratory safety training?</span><br>
			${formData.RLR_7}<br>
			<strong>WPI ID Cards</strong><br>
			<span style="font-size:.7em;font-style: italic;">WPI ID Cards: Do these additional members of your laboratory have their WPI ID Cards?</span><br>
			${formData.RLR_8}<br>
			<strong>Card Printing</strong><br>
			<span style="font-size:.7em;font-style: italic;">If “No,” please write the name of any additional lab members who will need a WPI ID Card reprinted prior to returning to campus.</span><br>
			${formData.RLR_9}<br>
			`

			if (formData.users && formData.users.length) {
			detailsValue += `<p style="font-weight:600;color:#c1272d;font-size:1.4em">Additional Personnel</p>
							<table style="border-collapse: collapse;width:100%;" >
							<tr style="border:1px solid #e6e6e6;padding:.25em;background-color:#c1272d;color:#fff;">
								<th>Name</th>
								<th>WPI ID</th>
								<th>Email</th>
								<th>Type</th>
								<th>Phase</th>
								<th>Funding</th>
								<th>Remotely?</th>
								<th>Safe Return</th>
								<th>Residence</th>
								<th>Appointment Yr</th>
								<th>Grad Year / Year of Study</th>
							</tr>`
			for (const user of formData.users) {
			detailsValue += `<tr style="border:1px solid #e6e6e6;padding:.25em">
				<td>${user.usersName}</td>
				<td>${user.usersID}</td>
				<td>${user.usersEmail}</td>
				<td>${user.usersType}</td>
				<td>${user.usersPhase}</td>
				<td>${user.usersfunding}</td>
				<td>${user.usersRemote}</td>
				<td>${user.usersSafety}</td>
				<td>${user.usersReside}</td>
				<td>${user.usersAppointment}</td>
				<td>${user.usersGradYear}</td>
			</tr>
			`;
			}
			detailsValue += `</table>`
			}
			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: 'Research Lab Reopening - Additional Personnel'
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Incident'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'DR Response'
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138',
						value: detailsValue
					},
					{ // Impact
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:ae05c132527e48bd95d063c445622df7',
						value: 'Must Have'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:29d741aae8bf461f8aafa3c9eb4dc822',
						value: 'Expedite'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:83c36313e97b4e6b9028aff3b401b71c',
						value: '1'
					},
					{ // Service
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4',
						value: 'DR Response'
					},
					{ // Category
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa',
						value: 'Campus Access'
					},
					{ // Subcategory
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
						value: 'Research Lab Reopening Update'
					},
					{ // Debt Head
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:945f9ed2b24581fed57c3e41b6886e25b4ea31f49e',
						value: formData.RLR_4 != 'undefined' ? formData.RLR_4 : ''
					},
					

					
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: detailsValue
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}
				this.saveRelatedBusinessObject(journalPayload).then(() => {
					return resolve(JSON.stringify(ticket));
				}).catch(err => {
					return reject(err);
				});
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createIncidentCovid19ExternalAdd(customerID, formData, customerFullName) {
		return new Promise((resolve, reject) => {
			let detailsValue = `<strong>Source:</strong> ${formData.source}<br>
			<strong>Type</strong>: ${formData.type}<br>
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Submitting User</p>
			<strong>Full Name:</strong> ${formData.fullName}<br>
			<strong>Department:</strong> ${formData.department}<br>
			<strong>WPI ID #:</strong> ${formData.wpiID}<br>
			<strong>WPI Email:</strong> ${formData.wpiEmail}<br>
			<strong>WPI Phone:</strong> ${formData.wpiPhone}<br>
			<hr>
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Research Lab Plan Update - External Partners</p>

			<strong>Original Ticket #</strong><br>
			<span style="font-size:.7em;font-style: italic;">Original Ticket</span><br>
			${formData.RLR_1}<br>
			<span style="font-size:.7em;font-style: italic;">Department Head</span><br>
			${formData.RLR_4}<br>
			

			<p style="font-weight:600;color:#c1272d;font-size:1.4em">About the External Partner</p>

			<strong>Who is the external partner? </strong><br>
			${formData.RLR_5}<br>

			<strong>What is the external partner’s relationship to your lab or center?</strong><br>
			${formData.RLR_6}<br>

			<strong>Provide a brief summary of the research partner’s research or use of a WPI lab or research facility, in lay terms (max 500 words).</strong><br>
			${formData.RLR_7}<br>

			<strong>Why is the research partner’s access to a WPI lab or research facility essential at this time?(max 500 words). </strong><br>
			${formData.RLR_8}<br>

			<strong>Please list names and contact information of all individuals working for the research partner that need access.</strong><br>
			${formData.RLR_9}<br>

			<strong>Please list the space (labs and/or research facilities) the research partner needs access to. Is this space a shared space? </strong><br>
			${formData.RLR_10}<br>

			<strong>Please explain how long and how often the research partner needs access to the spaces(s) listed above? </strong><br>
			${formData.RLR_11}<br>

			<strong>Do individuals working for the research partner need to be escorted in the lab and/or research facility? </strong><br>
			${formData.RLR_12}<br>

			<strong>Do individuals working for the research partner need to be assisted in the use of equipment?</strong><br>
			${formData.RLR_13}<br>

			<strong>How will you ensure that the research partner complies with the <a href="https://www.wpi.edu/we-are-wpi/research-labs" target="_blank" rel="noopen norefer">Research Lab Reopening Guidance</a>, the <a href="https://www.wpi.edu/news/coronavirus/return-campus-guidance" target="_blank" rel="noopen norefer">Return to Campus Guidance</a>, and information on the <a href="https://www.wpi.edu/we-are-wpi" target="_blank" rel="noopen norefer"></a>We Are WPI website</a>? </strong><br>
			${formData.RLR_14}<br>

			<strong>How does your lab’s Laboratory Research and Social Distancing Plan need to be modified to accommodate the research partner? </strong><br>
			${formData.RLR_15}<br>

			<strong>How will the research partner ensure that any individuals working for the research partner have complied with <a href="https://www.mass.gov/info-details/covid-19-travel-order" target="_blank" rel="noopen norefer">Massachusetts’ travel order</a>?</strong><br>
			${formData.RLR_16}<br>

			<strong>How will the research partner ensure that their research can rapidly ramp down, if needed? </strong><br>
			${formData.RLR_17}<br>
			`

			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: 'Research Lab Reopening - Add External Partner'
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Incident'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'DR Response'
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138',
						value: detailsValue
					},
					{ // Impact
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:ae05c132527e48bd95d063c445622df7',
						value: 'Must Have'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:29d741aae8bf461f8aafa3c9eb4dc822',
						value: 'Expedite'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:83c36313e97b4e6b9028aff3b401b71c',
						value: '1'
					},
					{ // Service
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4',
						value: 'DR Response'
					},
					{ // Category
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa',
						value: 'Campus Access'
					},
					{ // Subcategory
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
						value: 'Research Lab Reopening Update'
					},
					{ // Debt Head
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:945f9ed2b24581fed57c3e41b6886e25b4ea31f49e',
						value: formData.RLR_4 != 'undefined' ? formData.RLR_4 : ''
					},
					

					
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: detailsValue
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}
				this.saveRelatedBusinessObject(journalPayload).then(() => {
					return resolve(JSON.stringify(ticket));
				}).catch(err => {
					return reject(err);
				});
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createIncidentCovid19HumansAdd(customerID, formData, customerFullName) {
		return new Promise((resolve, reject) => {
			let detailsValue = `<strong>Source:</strong> ${formData.source}<br>
			<strong>Type</strong>: ${formData.type}<br>
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Submitting User</p>
			<strong>Full Name:</strong> ${formData.fullName}<br>
			<strong>Department:</strong> ${formData.department}<br>
			<strong>WPI ID #:</strong> ${formData.wpiID}<br>
			<strong>WPI Email:</strong> ${formData.wpiEmail}<br>
			<strong>WPI Phone:</strong> ${formData.wpiPhone}<br>
			<hr>
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Research Lab Plan Update - Human Subjects</p>

			<strong>Original Ticket #</strong><br>
			<span style="font-size:.7em;font-style: italic;">Original Ticket</span><br>
			${formData.RLR_1}<br>
			<span style="font-size:.7em;font-style: italic;">Department Head</span><br>
			${formData.RLR_4}<br>
			

			<p style="font-weight:600;color:#c1272d;font-size:1.4em">About the Research</p>

			<strong>Provide a brief summary of the research, in lay terms (max 500 words).</strong><br>
			${formData.RLR_5}<br>
			<strong>Describe the rationale for conducting in-person, face-to-face human subjects research at this time. Researchers must present a rationale for the research given the potential risks of COVID-19 (max 500 words).</strong><br>
			${formData.RLR_6}<br>
			<strong>Describe why the human subjects research cannot be performed remotely (max 500 words)</strong><br>
			${formData.RLR_7}<br>


			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Study Participants</p>

			<strong>Total number to participate in the study and the timeframe </strong><br>
			${formData.RLR_8}<br>

			<strong>Number of participants that are WPI students or employees</strong><br>
			${formData.RLR_9}<br>

			<strong>How many have Campus access already?</strong><br>
			${formData.RLR_10}<br>

			<strong>Number of participants that are recruited from outside of WPI</strong><br>
			${formData.RLR_11}<br>

			<strong>Age Range</strong><br>
			${formData.RLR_12}<br>

			<strong>Is it possible (depending on the research purpose) to exclude individuals above a certain age, or with specific chronic conditions?</strong><br>
			${formData.RLR_13}<br>

			<strong>Health status of participants—screening for co-morbidities</strong><br>
			${formData.RLR_14}<br>

			<strong>How recruitment and screening will be altered for COVID-19</strong><br>
			${formData.RLR_15}<br>


			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Research Locations</p>

			<strong>List research sites</strong><br>
			${formData.RLR_16}<br>

			<strong>List which counties/states participants will be traveling from to participate in the study:</strong><br>
			${formData.RLR_17}<br>

			<strong>Are there COVID-19-related restrictions for counties/states listed?</strong><br>
			${formData.RLR_18}<br>

			<strong>If using an on-campus, shared facility (e.g., PracticePoint), have you consulted with the relevant Facility Director?</strong><br>
			${formData.RLR_19}<br>


			<p style="font-weight:600;color:#c1272d;font-size:1.4em">In-Person Interaction</p>

			<strong>The planned travel path of the participants into and out of the building and room where face-to-face activities will occur</strong><br>
			${formData.RLR_20}<br>

			<strong>The length of the contact and with whom; and length of time between participant study visits. </strong><br>
			${formData.RLR_21}<br>

			<strong>The length of the contact and with whom; and length of time between participant study visits. </strong><br>
			${formData.RLR_22}<br>

			<strong>What will participants be asked to do during the study visits?</strong><br>
			${formData.RLR_23}<br>

			<strong>How will interaction between study staff members be managed for physical distancing and how staff will be protected?</strong><br>
			${formData.RLR_24}<br>

			<strong>What changes will changes be implemented in the physical space</strong><br>
			${formData.RLR_25}<br>

			<strong>What are the cleaning protocols for the physical space, including equipment, between research visits </strong><br>
			${formData.RLR_26}<br>


			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Screening Precautions</p>

			<strong>Describe health screening procedures for study visits, as required by the Return toCampus Guidance</strong><br>
			${formData.RLR_27}<br>


			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Positive Case Handling</p>

			<strong>Describe plans for handling if a staff member or participant tests positive for COVID19 following participant interaction, including notification of close contacts which may include staff members or other participants:</strong><br>
			${formData.RLR_28}<br>

			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Ramp Down Planning</p>

			<strong>How will the research rapidly ramp down, if needed? Will the research pause? Will portions of the research be conducted remotely? Can the research space be closed rapidly, if needed (i.e., to reinstate working from home protocols, secure data, etc.)? </strong><br>
			${formData.RLR_29}<br>
			`

			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: 'Research Lab Reopening - Human Subjects'
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Incident'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'DR Response'
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138',
						value: detailsValue
					},
					{ // Impact
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:ae05c132527e48bd95d063c445622df7',
						value: 'Must Have'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:29d741aae8bf461f8aafa3c9eb4dc822',
						value: 'Expedite'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:83c36313e97b4e6b9028aff3b401b71c',
						value: '1'
					},
					{ // Service
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4',
						value: 'DR Response'
					},
					{ // Category
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa',
						value: 'Campus Access'
					},
					{ // Subcategory
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
						value: 'Research Lab Reopening Update'
					},
					{ // Debt Head
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:945f9ed2b24581fed57c3e41b6886e25b4ea31f49e',
						value: formData.RLR_4 != 'undefined' ? formData.RLR_4 : ''
					},
					

					
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: detailsValue
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}
				this.saveRelatedBusinessObject(journalPayload).then(() => {
					return resolve(JSON.stringify(ticket));
				}).catch(err => {
					return reject(err);
				});
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createIncidentCovid19ResearchCont(customerID, formData, customerFullName) {
		return new Promise((resolve, reject) => {
			let detailsValue = `<strong>Source:</strong> ${formData.source}<br>
			<strong>Type</strong>: ${formData.type}<br>
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Submitting User</p>
			<strong>Full Name:</strong> ${formData.fullName}<br>
			<strong>Department:</strong> ${formData.department}<br>
			<strong>WPI ID #:</strong> ${formData.wpiID}<br>
			<strong>WPI Email:</strong> ${formData.wpiEmail}<br>
			<strong>WPI Phone:</strong> ${formData.wpiPhone}<br>
			<hr>
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Research Continuity Request</p>

			<strong>Original Ticket #</strong><br>
			<span style="font-size:.7em;font-style: italic;">Original Ticket</span><br>
			${formData.RLR_1}<br>
			<span style="font-size:.7em;font-style: italic;">Department Head</span><br>
			${formData.RLR_4}<br>
			`

			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: 'Research Continuity Request'
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Incident'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'DR Response'
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138',
						value: detailsValue
					},
					{ // Impact
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:ae05c132527e48bd95d063c445622df7',
						value: 'Must Have'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:29d741aae8bf461f8aafa3c9eb4dc822',
						value: 'Expedite'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:83c36313e97b4e6b9028aff3b401b71c',
						value: '1'
					},
					{ // Service
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4',
						value: 'DR Response'
					},
					{ // Category
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa',
						value: 'Campus Access'
					},
					{ // Subcategory
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
						value: 'Research Continuity'
					},
					{ // Debt Head
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:945f9ed2b24581fed57c3e41b6886e25b4ea31f49e',
						value: formData.RLR_4 != 'undefined' ? formData.RLR_4 : ''
					},
					

					
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: detailsValue
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}
				this.getRelatedBusinessObjects('6dd53665c0c24cab86870a21cf6434ae', ticket.busObRecId, '933a679f9955f58f203e6d459592f5f19a87a9b622').then(specificsForm => {
					specificsForm = JSON.parse(specificsForm);
					const theSpecificsForm = specificsForm.relatedBusinessObjects[0];
					// Make specifics payload
					const specificsFields = [
						{ //Original Ticket
							dirty: true,
							fieldId: 'BO:94682b5624ca3a742d67a34e3b9583789bd8e187c9,FI:94682b72ad4fc1c85866354b03abaf1a20558770f8',
							value:  formData.RLR_1
						},
						{ //Research
							dirty: true,
							fieldId: 'BO:94682b5624ca3a742d67a34e3b9583789bd8e187c9,FI:94682b73a60bfc648a35844d67a4e4f0571c442293',
							value:  formData.RLR_5
						},
						{ //Personnel
							dirty: true,
							fieldId: 'BO:94682b5624ca3a742d67a34e3b9583789bd8e187c9,FI:94682b74139c9ca20d83754d8984bff0e12756b551',
							value:  formData.RLR_6
						},
						{ //Locations
							dirty: true,
							fieldId: 'BO:94682b5624ca3a742d67a34e3b9583789bd8e187c9,FI:94682b7477fdf2dbc68cfe40599af303de2b1d06b5',
							value:  formData.RLR_7
						},
						{ //MQPs
							dirty: true,
							fieldId: 'BO:94682b5624ca3a742d67a34e3b9583789bd8e187c9,FI:9468b2e75d789fa0ac2da94227b83c3d8d6e471dfa',
							value:  formData.RLR_8
						},

					];

					const specificsPayload = {
						busObId: theSpecificsForm.busObId,
						busObRecId: theSpecificsForm.busObRecId,
						fields: specificsFields,
						persist: true
					};
					Promise.all([this.saveRelatedBusinessObject(journalPayload), this.saveBusinessObject(specificsPayload)]).then(() => {
						return resolve(JSON.stringify(ticket));
					}).catch(err => {
						return reject(err);
					});
				}).catch(err => {
					return reject(err);
				});
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createIncidentCovid19Department(customerID, formData, customerFullName) {
		return new Promise((resolve, reject) => {
			let detailsValue = `<strong>Source:</strong> ${formData.source}<br>
			<strong>Type</strong>: ${formData.type}<br>
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Submitting User</p>
			<strong>Full Name:</strong> ${formData.fullName}<br>
			<strong>Department:</strong> ${formData.department}<br>
			<strong>WPI ID #:</strong> ${formData.wpiID}<br>
			<strong>WPI Email:</strong> ${formData.wpiEmail}<br>
			<strong>WPI Phone:</strong> ${formData.wpiPhone}<br>
			<hr>

			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Department Information</p>

			<strong>Department Name</strong><br>
			${formData.DRW_1}<br>
			<strong>Building(s) / Room(s)</strong><br>
			<pre>${formData.DRW_2}</pre><br>
			<strong>Rationale</strong><br>
			<span style="font-size:.7em;font-style: italic;">Explain why your department’s return to work on campus should be prioritized.</span><br>
			<pre>${formData.DRW_3}</pre><br>

			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Department Reopening Plan</p>

			<strong>Social Distancing</strong><br>
			<span style="font-size:.7em;font-style: italic;">Describe how your department will ensure social distancing (> 6 feet between individuals).</span><br>
			<pre>${formData.DRW_4}</pre><br>

			<strong>Hygiene Protocols</strong><br>
			<span style="font-size:.7em;font-style: italic;">Describe how your department will apply robust hygiene protocols.</span><br>
			<pre>${formData.DRW_5}</pre><br>

			<strong>Staffing and Operations</strong><br>
			<pre>${formData.DRW_6}</pre><br>

			<strong>Cleaning and Disinfecting</strong><br>
			<span style="font-size:.7em;font-style: italic;">Describe how your department will incorporate robust cleaning and disinfecting protocols in the offices and shared spaces.</span><br>
			<pre>${formData.DRW_7}</pre><br>

			<strong>Other</strong><br>
			<span style="font-size:.7em;font-style: italic;">What other plans will you put in place to reduce chance of COVID-19 transmission?  How will you supervise and enforce your plans? </span><br>
			<pre>${formData.DRW_8}</pre><br>

			<strong>Ramp-down Plan</strong><br>
			<span style="font-size:.7em;font-style: italic;">If required to ramp down your department’s on-campus presence, what steps will you take to restrict your department’s presence as soon as possible?</span><br>
			<pre>${formData.DRW_9}</pre><br>

			`

			if (formData.users && formData.users.length) {
			detailsValue += `<p style="font-weight:600;color:#c1272d;font-size:1.4em">Department Personnel</p>
							${formData.users}`
			}
			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: 'Department Reopening Webform'
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Incident'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'DR - Dept Committee'
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138',
						value: detailsValue
					},
					{ // Impact
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:ae05c132527e48bd95d063c445622df7',
						value: 'Must Have'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:29d741aae8bf461f8aafa3c9eb4dc822',
						value: 'Expedite'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:83c36313e97b4e6b9028aff3b401b71c',
						value: '1'
					},
					{ // Service
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4',
						value: 'DR Response'
					},
					{ // Category
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa',
						value: 'Campus Access'
					},
					{ // Subcategory
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
						value: 'Department Reopening Form'
					}
					
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: detailsValue
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}
				this.saveRelatedBusinessObject(journalPayload).then(() => {
					return resolve(JSON.stringify(ticket));
				}).catch(err => {
					return reject(err);
				});
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createIncidentNSO(customerID, formData, customerFullName) {
		return new Promise((resolve, reject) => {
			let detailsValue = `<strong>Source:</strong> ${formData.source}<br>
			<strong>Type</strong>: ${formData.type}<br>
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Submitting User</p>
			<strong>Full Name:</strong> ${formData.fullName}<br>
			<strong>WPI ID #:</strong> ${formData.wpiID}<br>
			<strong>WPI Email:</strong> ${formData.wpiEmail}<br>
			<hr>
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Request Details</p>
			<strong>Secret Code</strong><br>
			${formData.details}<br>
			`

			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: 'NSO Secret Code Submission'
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Incident'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'Service Desk Staff'
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138',
						value: detailsValue
					},
					{ // Impact
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:ae05c132527e48bd95d063c445622df7',
						value: 'Whenever Possible'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:29d741aae8bf461f8aafa3c9eb4dc822',
						value: 'Standard'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:83c36313e97b4e6b9028aff3b401b71c',
						value: '3'
					},
					{ // Service
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4',
						value: 'Training'
					},
					{ // Category
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa',
						value: 'New Student Orientation'
					},
					{ // Subcategory
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
						value: '2021 Scavenger Hunt'
					},
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: detailsValue
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}
				this.saveRelatedBusinessObject(journalPayload).then(() => {
					return resolve(JSON.stringify(ticket));
				}).catch(err => {
					return reject(err);
				});
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createIncidentChangeTest(customerID, formData, customerFullName) {
		return new Promise((resolve, reject) => {
			let detailsValue = `<strong>Source:</strong> ${formData.source}<br>
			<strong>Type</strong>: ${formData.type}<br>
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Submitting User</p>
			<strong>Full Name:</strong> ${formData.fullName}<br>
			<strong>WPI ID #:</strong> ${formData.wpiID}<br>
			<strong>WPI Email:</strong> ${formData.wpiEmail}<br>
			<hr>
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Request Details</p>
			<strong>Test Frequency</strong><br>
			${formData.frequency}<br>
			<strong>Currently Assigned</strong><br>
			${formData.currentDays}<br>
			<strong>Requested Change</strong><br>
			${formData.preferredDays}<br>
			<strong>Given Reason</strong><br>
			${formData.reason}<br>
			`

			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: 'Request Change of Testing Day'
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Service Request'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'Student Intent Survey'
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138',
						value: detailsValue
					},
					{ // Impact
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:ae05c132527e48bd95d063c445622df7',
						value: 'Whenever Possible'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:29d741aae8bf461f8aafa3c9eb4dc822',
						value: 'Standard'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:83c36313e97b4e6b9028aff3b401b71c',
						value: '3'
					},
					{ // Service
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4',
						value: 'DR Response'
					},
					{ // Category
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa',
						value: 'Student Intent'
					},
					{ // Subcategory
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
						value: 'Request to Change Testing Day'
					},
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: detailsValue
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}
				this.saveRelatedBusinessObject(journalPayload).then(() => {
					return resolve(JSON.stringify(ticket));
				}).catch(err => {
					return reject(err);
				});
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createIncidentChangeArrival(customerID, formData, customerFullName) {
		return new Promise((resolve, reject) => {
			let detailsValue = `<strong>Source:</strong> ${formData.source}<br>
			<strong>Type</strong>: ${formData.type}<br>
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Submitting User</p>
			<strong>Full Name:</strong> ${formData.fullName}<br>
			<strong>WPI ID #:</strong> ${formData.wpiID}<br>
			<strong>WPI Email:</strong> ${formData.wpiEmail}<br>
			<hr>
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Request Details</p>
			<strong>Current MoveIn Day</strong><br>
			${formData.currentDay}<br>
			<strong>Requested Change</strong><br>
			${formData.choice}<br>
			<strong>Given Reason</strong><br>
			${formData.reason}<br>
			`

			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: 'Request Change of Move In Day'
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Service Request'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'Student Intent Survey'
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138',
						value: detailsValue
					},
					{ // Impact
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:ae05c132527e48bd95d063c445622df7',
						value: 'Whenever Possible'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:29d741aae8bf461f8aafa3c9eb4dc822',
						value: 'Standard'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:83c36313e97b4e6b9028aff3b401b71c',
						value: '3'
					},
					{ // Service
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4',
						value: 'DR Response'
					},
					{ // Category
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa',
						value: 'Student Intent'
					},
					{ // Subcategory
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
						value: 'Change Move In Test Day'
					},
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: detailsValue
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}
				this.saveRelatedBusinessObject(journalPayload).then(() => {
					return resolve(JSON.stringify(ticket));
				}).catch(err => {
					return reject(err);
				});
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createIncidentChangeOnboarding(customerID, formData, customerFullName) {
		return new Promise((resolve, reject) => {
			let detailsValue = `<strong>Source:</strong> ${formData.source}<br>
			<strong>Type</strong>: ${formData.type}<br>
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Submitting User</p>
			<strong>Full Name:</strong> ${formData.fullName}<br>
			<strong>WPI ID #:</strong> ${formData.wpiID}<br>
			<strong>WPI Email:</strong> ${formData.wpiEmail}<br>
			<hr>
			<p style="font-weight:600;color:#c1272d;font-size:1.4em">Request Details</p>
			<strong>Current Onboarding Day</strong><br>
			${formData.currentDay}<br>
			<strong>Requested Change</strong><br>
			${formData.choice}<br>
			<strong>Given Reason</strong><br>
			${formData.reason}<br>
			`

			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: 'Request Change of Onboarding Day'
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Service Request'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'Student Intent Survey'
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138',
						value: detailsValue
					},
					{ // Impact
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:ae05c132527e48bd95d063c445622df7',
						value: 'Whenever Possible'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:29d741aae8bf461f8aafa3c9eb4dc822',
						value: 'Standard'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:83c36313e97b4e6b9028aff3b401b71c',
						value: '3'
					},
					{ // Service
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4',
						value: 'DR Response'
					},
					{ // Category
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa',
						value: 'Student Intent'
					},
					{ // Subcategory
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
						value: 'Request Change of Onboarding Day'
					},
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: detailsValue
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}
				this.saveRelatedBusinessObject(journalPayload).then(() => {
					return resolve(JSON.stringify(ticket));
				}).catch(err => {
					return reject(err);
				});
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createIncidentGradeFormat(customerID, formData, customerFullName, employeeID) {
		return new Promise((resolve, reject) => {
			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: 'Grading Format Request'
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Service Request'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'Registrar'
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138',
						value: 'Grading Format Request'
					},
					{ // Impact
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:ae05c132527e48bd95d063c445622df7',
						value: 'Whenever Possible'
					},
					{ // Urgency
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:29d741aae8bf461f8aafa3c9eb4dc822',
						value: 'Standard'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:83c36313e97b4e6b9028aff3b401b71c',
						value: '3'
					},
					{ // Service
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4',
						value: 'Office of The Registrar'
					},
					{ // Category
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa',
						value: 'Registrar Services'
					},
					{ // Subcategory
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
						value: 'Grade Format Change'
					},
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				/**
				 * Make journal payload
				 */
				let detailsValue = `<p><strong>Source:</strong> ${formData.source}</p>
				<p><strong>Type:</strong> ${formData.type}</p>
				<p><strong>Full Name:</strong> ${formData.fullName}</p>
				<p><strong>WPI ID #:</strong> ${formData.wpiID}</p>
				<p><strong>WPI Email:</strong> ${formData.wpiEmail}</p>
				<p><strong>WPI Phone:</strong> ${formData.wpiPhone}</p>
				<p><strong>Details:</strong> ${formData.details}</p>`;
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: detailsValue
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}

				this.getRelatedBusinessObjects('6dd53665c0c24cab86870a21cf6434ae', ticket.busObRecId, '933a679f9955f58f203e6d459592f5f19a87a9b622').then(specificsForm => {
					specificsForm = JSON.parse(specificsForm);
					const theSpecificsForm = specificsForm.relatedBusinessObjects[0];
					// Make specifics payload
					const specificsFields = [
						{
							dirty: true,
							fieldId: 'BO:945d5981e315855764a91d4a8cb42196834f36c36e,FI:945d59bf8cffc41cb7646e4d4ca8f1637d1cc77db6',
							value: employeeID
						}
					];
					for (let i = 1; i <= 10; i++) {
						specificsFields.push({
							dirty: true,
							fieldId: theSpecificsForm.fields.find(f => f.name === `Reg_course_${i}`).fieldId,
							value: formData.courses.length >= i ? formData.courses[i - 1].course : ''
						});
						specificsFields.push({
							dirty: true,
							fieldId: theSpecificsForm.fields.find(f => f.name === `Reg_delta_${i}`).fieldId,
							value: formData.courses.length >= i ? formData.courses[i - 1].choice : ''
						});
					}

					const specificsPayload = {
						busObId: theSpecificsForm.busObId,
						busObRecId: theSpecificsForm.busObRecId,
						fields: specificsFields,
						persist: true
					};
					Promise.all([this.saveRelatedBusinessObject(journalPayload), this.saveBusinessObject(specificsPayload)]).then(() => {
						return resolve(JSON.stringify(ticket));
					}).catch(err => {
						return reject(err);
					});
				}).catch(err => {
					return reject(err);
				});
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createIncidentStudentFlag(customerID, formData, customerFullName, employeeID) {
		return new Promise((resolve, reject) => {
			let detailsValue = `A student outreach request has been initiated for ${formData.studentName} (${formData.studentID})
			<p>${formData.crn} - ${formData.courseTitle}</p>
			<p><strong>Reason for Concern</strong><br>
			Missed Class: ${formData.flagClass}<br>
			Not Responding to Emails: ${formData.flagResponse}<br>
			Not Submitting Assignments: ${formData.flagAssignments}<br>
			Not Responding to Outreach: ${formData.flagOutreach}<br>
			Other: ${formData.flagOther}</p>
			<p><strong>Faculty Note</strong><br>
			${formData.reason}</p>
			`;
			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: `Student Outreach Request - ${formData.studentName}` || "Student Outreach Request"
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Service Request'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'Academic Advising'
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138',
						value: detailsValue
					},
					{ // Impact
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:ae05c132527e48bd95d063c445622df7',
						value: 'Whenever Possible'
					},
					{ // Urgency
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:29d741aae8bf461f8aafa3c9eb4dc822',
						value: 'Standard'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:83c36313e97b4e6b9028aff3b401b71c',
						value: '3'
					},
					{ // Service
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4',
						value: 'Virtual WPI'
					},
					{ // Category
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa',
						value: 'Student Engagement'
					},
					{ // Subcategory
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
						value: 'Report Student Concern'
					}
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				/**
				 * Make journal payload
				 */
				
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: detailsValue
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}

				this.getRelatedBusinessObjects('6dd53665c0c24cab86870a21cf6434ae', ticket.busObRecId, '933a679f9955f58f203e6d459592f5f19a87a9b622').then(specificsForm => {
					specificsForm = JSON.parse(specificsForm);
					const theSpecificsForm = specificsForm.relatedBusinessObjects[0];
					// Make specifics payload
					const specificsFields = [
						{ //Student ID
							dirty: true,
							fieldId: 'BO:946d92aae14ad6eb352a144de788c4e966b59b6f92,FI:946178bb73c9fad42fcca2466eab16ccbb62da8ce4',
							value: formData.studentID
						},
						{ // Flag - Missing Class
							dirty: true,
							fieldId: 'BO:946d92aae14ad6eb352a144de788c4e966b59b6f92,FI:946d92ffd1cd44586643c247f68ea2e85f0285951b',
							value: formData.flagClass
						},
						{ //Flag - No response to email
							dirty: true,
							fieldId: 'BO:946d92aae14ad6eb352a144de788c4e966b59b6f92,FI:946d93005d58f508e40d914104b2b829d7d17ba6a8',
							value: formData.flagResponse
						},
						{ //Flag - Missing Assignment
							dirty: true,
							fieldId: 'BO:946d92aae14ad6eb352a144de788c4e966b59b6f92,FI:946d9300cf0d595df2125b4fa08da7c32570b2260e',
							value: formData.flagAssignments
						},
						{ //Flag - No response to Outreach
							dirty: true,
							fieldId: 'BO:946d92aae14ad6eb352a144de788c4e966b59b6f92,FI:946d9301602b55794557f7470ca870c653256c24ef',
							value: formData.flagOutreach
						},
						{ //Flag - Other
							dirty: true,
							fieldId: 'BO:946d92aae14ad6eb352a144de788c4e966b59b6f92,FI:946d93018bac8112be20604cd19954715c16d2895f',
							value: formData.flagOther
						},
						{ //Reason for Concern
							dirty: true,
							fieldId: 'BO:946d92aae14ad6eb352a144de788c4e966b59b6f92,FI:946d92c3d4d3685554677244eeaad0f1009da99d04',
							value: formData.reason
						},
						{ // Course Number (not CRN?)
							dirty: true,
							fieldId: 'BO:946d92aae14ad6eb352a144de788c4e966b59b6f92,FI:946d92c799a0a5f5e8609f45f6b62e9324b857936d',
							value: formData.crn
						},
						{ // Course Title
							dirty: true,
							fieldId: 'BO:946d92aae14ad6eb352a144de788c4e966b59b6f92,FI:946d92c5f78f565bb6552741fd8fea758d34495361',
							value: formData.courseTitle
						},
					];

					const specificsPayload = {
						busObId: theSpecificsForm.busObId,
						busObRecId: theSpecificsForm.busObRecId,
						fields: specificsFields,
						persist: true
					};
					Promise.all([this.saveRelatedBusinessObject(journalPayload), this.saveBusinessObject(specificsPayload)]).then(() => {
						return resolve(JSON.stringify(ticket));
					}).catch(err => {
						return reject(err);
					});
				}).catch(err => {
					return reject(err);
				});
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createIncidentWorkdayRequest(customerID, formData, customerFullName, employeeID) {
		return new Promise((resolve, reject) => {
			let detailsValue = `A workday ${formData.type} request has been entered.
			<p><strong>Details</strong><br>
			Tenant: ${formData.tenant}<br>
			Is This Urgent?: ${formData.urgent}<br>
			Request Type: ${formData.type}<br>
			<p><strong>Details</strong><br>
			${formData.reason}</p>
			`;
			var impact ="";
			var urgency ="";
			var priority = "";

			if(formData.urgent != "" && formData.urgent == "Yes" ){
				impact ="University";
				urgency ="High";
				priority = "1";
			}else{
				impact ="University";
				urgency ="Low";
				priority = "3";
			}

			var subcat = "";
			if(formData.type != "" && formData.type == "Security" ){
				subcat = "Security Issue"
			}else{
				subcat = "Configuration Issue"
			}

			var configItem = "";
			var configRec = "";
			if(formData.tenant != "" && formData.tenant == "Production" ){
				configItem = "20471";
				configRec = "946d1b48d1a9754c1b59c24a66867454b75a3ca98d"
			}
			else if(formData.tenant != "" && formData.tenant == "Sandbox" ){
				configItem = "20472";
				configRec = "946d1b9419cacec61e47ca4cf7ac1af423d951b29e";
			}
			else if(formData.tenant != "" && formData.tenant == "Preview" ){
				configItem = "20473"
				configRec = "946d1b9714aefdca7869b644189dc27d1fca5889f1"
			}
			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: `Workday ${formData.type} Request`
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Service Request'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'Enterprise Solutions Support'
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138',
						value: detailsValue
					},
					{ // Impact
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:ae05c132527e48bd95d063c445622df7',
						value: impact
					},
					{ // Urgency
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:29d741aae8bf461f8aafa3c9eb4dc822',
						value: urgency
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:83c36313e97b4e6b9028aff3b401b71c',
						value: priority
					},
					{ // Service
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4',
						value: 'Enterprise Platform'
					},
					{ // Category
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa',
						value: 'Workday'
					},
					{ // Subcategory
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
						value: subcat
					},
					{ // AssetTag
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:945840aa5de4be0ccb974e41298ac23cbcdd3b8694',
						value: configItem
					}
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				/**
				 * Make journal payload
				 */
				
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: detailsValue
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}
				if(configItem != ""){

					Promise.all([this.saveRelatedBusinessObject(journalPayload),this.linkRelatedBusinessObjects('6dd53665c0c24cab86870a21cf6434ae', ticket.busObRecId, '9365f406ec2d34899c213946d5907c67db853416ae','9343f8800bd7ce14f0bf0a402d9d38be1a25069644',configRec)
				]).then(() => {
						return resolve(JSON.stringify(ticket));
					}).catch(err => {
						return reject(err);
					});
				}else{
					Promise.all([this.saveRelatedBusinessObject(journalPayload)]).then(() => {
						return resolve(JSON.stringify(ticket));
					}).catch(err => {
						return reject(err);
					});
				}

			}).catch(err => {
				return reject(err);
			});
		});
	}
	createIncidentSoftwareRequest(customerID, formData, customerFullName, employeeID) {
		return new Promise((resolve, reject) => {

			let detailsValue = `A Software request has been entered.
			<p><strong>Details</strong><br>
			Course: ${formData.course}<br>

			<p><strong>Software</strong></p>
			<pre>${formData.software}</pre>

			<p><strong>Location</strong></p>
			<pre>${formData.location}</pre>

			<p><strong>Note</strong></p>
			<pre>${formData.note}</pre>
			`;

			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: `Software Request Submission`
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Service Request'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'Service Desk Staff'
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138',
						value: detailsValue
					},
					{ // Impact
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:ae05c132527e48bd95d063c445622df7',
						value: "University"
					},
					{ // Urgency
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:29d741aae8bf461f8aafa3c9eb4dc822',
						value: "Medium"
					},
					{ // Service
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4',
						value: 'Software'
					},
					{ // Category
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa',
						value: 'Software Distribution'
					},
					{ // Subcategory
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
						value: "Software Request Submission"
					}
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				/**
				 * Make journal payload
				 */
				
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: detailsValue
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}

				Promise.all([this.saveRelatedBusinessObject(journalPayload)]).then(() => {
					return resolve(JSON.stringify(ticket));
				}).catch(err => {
					return reject(err);
				});

			}).catch(err => {
				return reject(err);
			});
		});
	}
	createIncidentCommencement(customerID, formData, customerFullName, employeeID) {
		return new Promise((resolve, reject) => {
			
			var detailsValue = "";
			var summaryValue = "";
			var classif = "";
			logger.warn(formData.isUpdate);
			if(formData.isUpdate == true || formData.isUpdate == 'true'){

				summaryValue = `Updated Commencement Participation Response`
				detailsValue = `<p>${customerFullName} is updating their Commencement Participation Intentions.<br>
				old Value: ${formData.oldResponseDesc}<br>
				New Value: ${formData.choiceText}</p>`;
				classif = "Updated Commencement Participation Response"
			}else{

				summaryValue = `Commencement Participation Response`
				detailsValue = `<p>${customerFullName} is submitting their Commencement Participation Intentions.<br>
				${formData.choiceText}</p>`;
				classif = "Commencement Participation Response"
			}
			

			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: summaryValue
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Service Request'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'Registrar'
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138',
						value: detailsValue
					},
					{ // Impact
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:ae05c132527e48bd95d063c445622df7',
						value: 'Whenever Possible'
					},
					{ // Urgency
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:29d741aae8bf461f8aafa3c9eb4dc822',
						value: 'Standard'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:83c36313e97b4e6b9028aff3b401b71c',
						value: '3'
					},
					{ // Service
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4',
						value: 'Student Enrollment'
					},
					{ // Category
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa',
						value: 'Graduation Preparation'
					},
					{ // Subcategory
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
						value: classif
					},
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				/**
				 * Make journal payload
				 */
				
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: detailsValue
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}

				this.getRelatedBusinessObjects('6dd53665c0c24cab86870a21cf6434ae', ticket.busObRecId, '933a679f9955f58f203e6d459592f5f19a87a9b622').then(specificsForm => {
					specificsForm = JSON.parse(specificsForm);
					const theSpecificsForm = specificsForm.relatedBusinessObjects[0];
					// Make specifics payload
					const specificsFields = [
						{ //Short Choice
							dirty: true,
							fieldId: 'BO:946e18a25ec3d7d67fe6964ea79c448d965caf2cb7,FI:946e18a6f849e6f20fa5dc48dab413709f913dfaef',
							value: formData.choice
						},
						{ //isUpdate
							dirty: true,
							fieldId: 'BO:946e18a25ec3d7d67fe6964ea79c448d965caf2cb7,FI:946e18a724b4aace5f928b43e98d347d53555bb0c0',
							value: formData.isUpdate
						},
					];

					const specificsPayload = {
						busObId: theSpecificsForm.busObId,
						busObRecId: theSpecificsForm.busObRecId,
						fields: specificsFields,
						persist: true
					};
					Promise.all([this.saveRelatedBusinessObject(journalPayload), this.saveBusinessObject(specificsPayload)]).then(() => {
						return resolve(JSON.stringify(ticket));
					}).catch(err => {
						return reject(err);
					});
				}).catch(err => {
					return reject(err);
				});
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createIncidentIntentToGrad(customerID, formData, customerFullName, employeeID) {
		return new Promise((resolve, reject) => {
			let detailsValue = `${formData.firstName} is submitting their intent to graduate for a ${formData.degreeType} program.
				<p><strong>Source:</strong> ${formData.source}</p>`;
			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: `Intent to Graduate - ${formData.dateName} -  ${formData.lastName}` || "Intent to Graduate"
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Service Request'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'Registrar'
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138',
						value: detailsValue
					},
					{ // Impact
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:ae05c132527e48bd95d063c445622df7',
						value: 'Whenever Possible'
					},
					{ // Urgency
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:29d741aae8bf461f8aafa3c9eb4dc822',
						value: 'Standard'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:83c36313e97b4e6b9028aff3b401b71c',
						value: '3'
					},
					{ // Service
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4',
						value: 'Student Enrollment'
					},
					{ // Category
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa',
						value: 'Graduation Preparation'
					},
					{ // Subcategory
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
						value: 'Application to Graduate'
					},
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				/**
				 * Make journal payload
				 */
				
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: detailsValue
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}

				this.getRelatedBusinessObjects('6dd53665c0c24cab86870a21cf6434ae', ticket.busObRecId, '933a679f9955f58f203e6d459592f5f19a87a9b622').then(specificsForm => {
					specificsForm = JSON.parse(specificsForm);
					const theSpecificsForm = specificsForm.relatedBusinessObjects[0];
					// Make specifics payload
					const specificsFields = [
						{ //WPI ID
							dirty: true,
							fieldId: 'BO:9465392b2ef3131c1ddaa149c081544691b53668c4,FI:946178bb73c9fad42fcca2466eab16ccbb62da8ce4',
							value: employeeID
						},
						{ //Degree Type
							dirty: true,
							fieldId: 'BO:9465392b2ef3131c1ddaa149c081544691b53668c4,FI:94653955f5eaacf694aa744c96a152b21198ec78b1',
							value: formData.degreeType
						},
						{ //Date Val
							dirty: true,
							fieldId: 'BO:9465392b2ef3131c1ddaa149c081544691b53668c4,FI:94653956a95c1b25d02b57401496ed2240dfad3790',
							value: formData.date
						},
						{ //First Name
							dirty: true,
							fieldId: 'BO:9465392b2ef3131c1ddaa149c081544691b53668c4,FI:94653957393e7c4fc57d8d4f6985db0ce8e75013d4',
							value: formData.firstName
						},
						{ //Middle Name
							dirty: true,
							fieldId: 'BO:9465392b2ef3131c1ddaa149c081544691b53668c4,FI:94653957579a9b8d0b6b6a4237b6f9c734e8a58d72',
							value: formData.middleName
						},
						{ //Last Name
							dirty: true,
							fieldId: 'BO:9465392b2ef3131c1ddaa149c081544691b53668c4,FI:9465395772ddb8774ead5c452fa44cac3de7d46ca2',
							value: formData.lastName
						},
						{ //Suffix
							dirty: true,
							fieldId: 'BO:9465392b2ef3131c1ddaa149c081544691b53668c4,FI:94653957d7818ad17f69f2436d931c7a0b485bfee6',
							value: formData.suffix
						},
						{ //nameCombined
							dirty: true,
							fieldId: 'BO:9465392b2ef3131c1ddaa149c081544691b53668c4,FI:9465395d133f2879789e0948ee9a4710bf5484f03a',
							value: formData.nameCombined
						},
						{ //address1
							dirty: true,
							fieldId: 'BO:9465392b2ef3131c1ddaa149c081544691b53668c4,FI:946178b2acd600686f55ae4412b00065b5e9c48631',
							value: formData.address1
						},
						{ //address2
							dirty: true,
							fieldId: 'BO:9465392b2ef3131c1ddaa149c081544691b53668c4,FI:946178b2ee1dbbeab5d63e40c0b202834a08ba7137',
							value: formData.address2
						},
						{ //city
							dirty: true,
							fieldId: 'BO:9465392b2ef3131c1ddaa149c081544691b53668c4,FI:946178b38367bb010a461745b88a27d9f1a16b577a',
							value: formData.city
						},
						{ //state
							dirty: true,
							fieldId: 'BO:9465392b2ef3131c1ddaa149c081544691b53668c4,FI:946178b74d10e26b79b57b4fdc8e5e7870f62a43e8',
							value: formData.state
						},
						{ //zip
							dirty: true,
							fieldId: 'BO:9465392b2ef3131c1ddaa149c081544691b53668c4,FI:946178b78eacc953dcbed142618cdb25b80e9b0c65',
							value: formData.zip
						},
						{ //Country
							dirty: true,
							fieldId: 'BO:9465392b2ef3131c1ddaa149c081544691b53668c4,FI:946178b7b6ad212346f3004e92855dab741bd1237c',
							value: formData.country
						},
						{ //Degree
							dirty: true,
							fieldId: 'BO:9465392b2ef3131c1ddaa149c081544691b53668c4,FI:94653958519e5bc24896dd4d4694cc98c0f653c83f',
							value: formData.degree
						},
						{ //Major
							dirty: true,
							fieldId: 'BO:9465392b2ef3131c1ddaa149c081544691b53668c4,FI:946539587e912e44fa5c63471da4eb17805aaadc73',
							value: formData.major
						},
						{ //Thesis
							dirty: true,
							fieldId: 'BO:9465392b2ef3131c1ddaa149c081544691b53668c4,FI:94653958b928374801167f47ddb9a933db3fa6cd4e',
							value: formData.thesis
						},
					];

					const specificsPayload = {
						busObId: theSpecificsForm.busObId,
						busObRecId: theSpecificsForm.busObRecId,
						fields: specificsFields,
						persist: true
					};
					Promise.all([this.saveRelatedBusinessObject(journalPayload), this.saveBusinessObject(specificsPayload)]).then(() => {
						return resolve(JSON.stringify(ticket));
					}).catch(err => {
						return reject(err);
					});
				}).catch(err => {
					return reject(err);
				});
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createIncidentAddDrop(customerID, formData, customerFullName) {
		let status = "";
		let pendDate = "";
		let buildDesc = "";
		let reason = ""
		if(formData.approvals && formData.approvals.length >= 1){
			status = "Pending";
			pendDate = moment().add(14,'d').toISOString();
			reason = "Pending Approval";
		}else{
			status = "New";
			pendDate = "";
			reason = "";
		}
		let buildDropped = "";

		if(formData.dropCourse && formData.dropCourse.length >= 1){
			buildDropped = `<h3>DROP Course</h3>`;
			for(const dropped of formData.dropCourse){
				buildDropped += `
				<p>${dropped.Course_Title}</p>
				<p>${dropped.cour_sec_def_referenceID} - ${dropped.Course_Definition}</p>
				<P>${dropped.Course_Section_Definition}</p>
				<p>${dropped.CF_LRV_Instructor_Preferred_First_Name} ${dropped.CF_LRV_Instructor_Preferred_Last_Name}"</p>
				<p>${dropped.Offering_Period} </p>
				<br>
				`
			}
		}else{
			buildDropped = `<h3>DROP Course</h3><p>none</p>`;
		}
		buildDesc =`
			Requesting to Add / Drop for ${formData.addCourse[0].Academic_Period_Type}
			<h3>User</h3>
			<p>${formData.fullName} (${formData.wpiID})</p>

			<h3>Additional Information</h3>
			<p>${formData.additional}</p>
			<h3>Add Course</h3>
			<p>${formData.addCourse[0].Section_Listings}</p>
			<p>${formData.addCourse[0].cour_sec_def_referenceID} - ${formData.addCourse[0].cour_sec_def_Title}</p>
			<p>${formData.addCourse[0].Minimum_Credits} Credit Hours</p>
			<p>${formData.addCourse[0].Primary_Instructor_Name}</p>

			${buildDropped}
			
		`;
		return new Promise((resolve, reject) => {
			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: status
					},
					{ // Review By Date
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9378aba4eb664c75b19162486199a67ac141aa8dad',
						value: pendDate
					},
					{ // Pending Reason
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9378aba490aadc483cf364416783a48d7d63ae11aa',
						value: reason
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: `Course Add Drop - ${formData.addCourse[0].cour_Definition}`
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Service Request'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'Registrar'
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138',
						value: buildDesc
					},
					{ // Impact
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:ae05c132527e48bd95d063c445622df7',
						value: 'Whenever Possible'
					},
					{ // Urgency
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:29d741aae8bf461f8aafa3c9eb4dc822',
						value: 'Standard'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:83c36313e97b4e6b9028aff3b401b71c',
						value: '3'
					},
					{ // Service
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4',
						value: 'Student Enrollment'
					},
					{ // Category
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa',
						value: 'Course Registration'
					},
					{ // Subcategory
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
						value: 'Add Drop Course'
					},
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				/**
				 * Make journal payload
				 */

				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: buildDesc
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}

				this.getRelatedBusinessObjects('6dd53665c0c24cab86870a21cf6434ae', ticket.busObRecId, '933a679f9955f58f203e6d459592f5f19a87a9b622').then(specificsForm => {
					specificsForm = JSON.parse(specificsForm);
					const theSpecificsForm = specificsForm.relatedBusinessObjects[0];
					// Make specifics payload
					const specificsFields = [
						{ //Approval Types
							dirty: true,
							fieldId: 'BO:946451c601cbaf92827eaf44798a06df2104c9d705,FI:946451cd64eb41f8b5e76041aaa3e5c7073e1c0b3d',
							value:  JSON.stringify(formData.booleans, null, 2)
						},
						{ //CRN
							dirty: true,
							fieldId: 'BO:946451c601cbaf92827eaf44798a06df2104c9d705,FI:946451e0f3b4ca29b122eb4efe86e11681382be423',
							value:  formData.addCourse[0].cour_sec_def_referenceID
						},
						{ //COURSE
							dirty: true,
							fieldId: 'BO:946451c601cbaf92827eaf44798a06df2104c9d705,FI:946451e13b48e80c223ca442f4a795c217d9647fb5',
							value:  formData.addCourse[0].Section_Listings
						},
						{ //TITLE
							dirty: true,
							fieldId: 'BO:946451c601cbaf92827eaf44798a06df2104c9d705,FI:946451e192d71ba5c539924a3cbce6268e7004240d',
							value:  formData.addCourse[0].cour_sec_def_Title
						},
						{ //TITLE
							dirty: true,
							fieldId: 'BO:946451c601cbaf92827eaf44798a06df2104c9d705,FI:9466efee260010d2ff636c48d487c9769a45dfa3ae',
							value:  formData.addCourse[0].Primary_Instructor_Name
						},
						{ //Dropped Courses
							dirty: true,
							fieldId: 'BO:946451c601cbaf92827eaf44798a06df2104c9d705,FI:946451e3f255eee100d83b4cc38c11fdf6b26424dc',
							value:  buildDropped
						}
					];

					const specificsPayload = {
						busObId: theSpecificsForm.busObId,
						busObRecId: theSpecificsForm.busObRecId,
						fields: specificsFields,
						persist: true
					};
					Promise.all([this.saveRelatedBusinessObject(journalPayload), this.saveBusinessObject(specificsPayload)]).then(() => {

						if(formData.approvals && formData.approvals.length >= 1){
							for(const approvals of formData.approvals){
								const approvalFields = [
									{ //Parent Incident
										dirty: true,
										fieldId: 'BO:94644c61359570d6f38f634caaa62c422d5d940a12,FI:94644c967b0ff4ea4c80984fb9bb4d07d0f4a06cfc',
										value:  ticket.busObRecId
									},
									{ //Approver Type
										dirty: true,
										fieldId: 'BO:94644c61359570d6f38f634caaa62c422d5d940a12,FI:94644c8dc13553a617d7954b588f230cbb43df0e1f',
										value:  approvals.type
									},
									{ //Approver Relation
										dirty: true,
										fieldId: 'BO:94644c61359570d6f38f634caaa62c422d5d940a12,FI:94644c673ab1c0a8e0b6a545e4be37f14bceeaa6fe',
										value:  approvals.id
									},
									{ //Approver WPI ID
										dirty: true,
										fieldId: 'BO:94644c61359570d6f38f634caaa62c422d5d940a12,FI:94644c9437f7bd7c28297b4a058278c15dbd56e7c9',
										value:  approvals.relation
									},
									{ //Course
										dirty: true,
										fieldId: 'BO:94644c61359570d6f38f634caaa62c422d5d940a12,FI:94644c8f117ff868bf8a754d7dbe077c8409a3e2a8',
										value:  `${formData.addCourse[0].cour_Definition}`
									},
									{ //Student Name
										dirty: true,
										fieldId: 'BO:94644c61359570d6f38f634caaa62c422d5d940a12,FI:94644d15ffcb7c2532df8d4569a3012cf317285eae',
										value:  formData.fullName
									},
									{ //Student ID
										dirty: true,
										fieldId: 'BO:94644c61359570d6f38f634caaa62c422d5d940a12,FI:94644d16a0723aafe96ff14d07abb4758b83e65e38',
										value:  formData.wpiID
									},
								]
								const approvalPayload = {
									busObId: "94644c61359570d6f38f634caaa62c422d5d940a12",
									fields: approvalFields,
									persist: true
								};
								this.saveBusinessObject(approvalPayload).then(() =>{

							}).catch(err => {
								return reject(err);
							});
							
						}
					}
						return resolve(JSON.stringify(ticket));
					}).catch(err => {
						return reject(err);
					});
				}).catch(err => {
					return reject(err);
				});
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createCovidLog(formData) {
		return new Promise((resolve, reject) => {
			const payload = {
				busObId: '946345aba1a463c0af5d5d43dbbae16f063bf3f9c6', // VisitorLog
				fields: [
					{ // Name
						dirty: true,
						fieldId: 'BO:946345aba1a463c0af5d5d43dbbae16f063bf3f9c6,FI:946345b02b92d1766305dc42eda84c106c73f7fac4',
						value: formData.name || ""
					},
					{ // Phone
						dirty: true,
						fieldId: 'BO:946345aba1a463c0af5d5d43dbbae16f063bf3f9c6,FI:946345b06d3dc2b31ff8d34847b3c32d995f415ce1',
						value: formData.phone || ""
					},
					{ // Email
						dirty: true,
						fieldId: 'BO:946345aba1a463c0af5d5d43dbbae16f063bf3f9c6,FI:946345b08680daeffa6af545489268aff7ad2041af',
						value: formData.email || ""
					},
					{ // isSigned
						dirty: true,
						fieldId: 'BO:946345aba1a463c0af5d5d43dbbae16f063bf3f9c6,FI:946345b16ba5d9bca51dc94f9584a40466aa0c3e42',
						value: formData.isSigned || ""
					},
					{ // dateSigned
						dirty: true,
						fieldId: 'BO:946345aba1a463c0af5d5d43dbbae16f063bf3f9c6,FI:946345b1f2edbfd7b0ee6d4410a45d97ebb20ce1c4',
						value: formData.dateSigned || ""
					},
					{ // Company
						dirty: true,
						fieldId: 'BO:946345aba1a463c0af5d5d43dbbae16f063bf3f9c6,FI:946345b32379ecc91c99d34544b1888b824e8218bc',
						value: formData.company || ""
					},
					{ // Type
						dirty: true,
						fieldId: 'BO:946345aba1a463c0af5d5d43dbbae16f063bf3f9c6,FI:946345b422126f22de1527472b81b71bab33157ced',
						value: formData.type || "Visitor"
					},
					{ // Details
						dirty: true,
						fieldId: 'BO:946345aba1a463c0af5d5d43dbbae16f063bf3f9c6,FI:9463462a3535038b5bebc948c88e0777337e3bbe11',
						value: formData.details || ""
					},
					{ // HasGuardian
						dirty: true,
						fieldId: 'BO:946345aba1a463c0af5d5d43dbbae16f063bf3f9c6,FI:9463a43957a4fcda5e34d14892bd3b435ecdb7c000',
						value: formData.hasGuardian || ""
					},
					{ // Guardian name
						dirty: true,
						fieldId: 'BO:946345aba1a463c0af5d5d43dbbae16f063bf3f9c6,FI:9463a43983dead2d3e065c45e8a87e56f48b4f8f4a',
						value: formData.guardName || ""
					},
					{ // Guardian Email
						dirty: true,
						fieldId: 'BO:946345aba1a463c0af5d5d43dbbae16f063bf3f9c6,FI:9463a439cb4663d265a52943e2b95b6d12f4d48108',
						value: formData.guardEmail || ""
					},
					{ // Guardian Phone
						dirty: true,
						fieldId: 'BO:946345aba1a463c0af5d5d43dbbae16f063bf3f9c6,FI:9463a43a196ec0c12f30e84190bd33440b52512e47',
						value: formData.guardPhone || ""
					}

					
				],
				persist: true
			};

			this.saveBusinessObject(payload).then(ticket => {
				return resolve(JSON.stringify(ticket));
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createOrUpdateCall(callBody, InteractionGuid) {
		return new Promise((resolve, reject) => {
			const payload = {
				busObId: '9481662ba319990089940d46c994d9e288fac9f6d6', // Call Log
				busObPublicId: InteractionGuid,
				fields: [
						{//Command
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:94816634032e08cd3ac1424ace824315a0d3be73d6',
						value: callBody.Command
						},
						{//cmd
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:948166344e984a35f3b7974ac3a99ba667889d7b21',
						value: callBody.cmd
						},
						{//AgentID
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:94816634a0955efb3e91ae4556992115d067cad754',
						value: callBody.AgentID
						},
						{//LoginID
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:94816635d91954801dc46c42fe93db03dcc4d80328',
						value: callBody.LoginID
						},
						{//Username
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:9481663617529a9626948346519acd576b8ec08228',
						value: callBody.Username
						},
						{//extLogin
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:9481663668e9d1bcf4c79346d3b96ddf384f1eb26f',
						value: callBody.extLogin
						},
						{//Account
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:94816636c0d70edacafb2340c1b57131aeaf758b84',
						value: callBody.Account
						},
						{//Role
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:948166373144b9e6ebdb0042e08aa2c7c9e28376d7',
						value: callBody.Role
						},
						{//Tenant
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:948166376c422b37812bd64027bea0b62f494085a6',
						value: callBody.Tenant
						},
						{//CaseID
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:94816637a21726170faca74dac97fea79137af77cb',
						value: callBody.CaseID
						},
						{//AccountID
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:94816637ee6b7915de6ef94034a7c6a59e4b461d84',
						value: callBody.AccountID
						},
						{//FollowupID
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:9481663829c6dc6f600f02412982d593a12eebe9a7',
						value: callBody.FollowupID
						},
						{//Subject
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:9481663856849113188c9f4f9d9e96590aa3eb655a',
						value: callBody.Subject
						},
						{//Channel
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:94816638a2ea8d6deded5c484d91334471dd5f814f',
						value: callBody.Channel
						},
						{//Queue
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:9481663979697837e1b334431cab51040d34f38a84',
						value: callBody.Queue
						},
						{//WaitTime
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:94816639bc78841f440def41e6baaae281910079c3',
						value: callBody.WaitTime
						},
						{//CustomerName
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:9481663aca09b45e574a294a019d8aa9e890afd298',
						value: callBody.CustomerName
						},
						{//Company
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:9481663b2e16a4810d364b4b5393f9ea799de2df45',
						value: callBody.Company
						},
						{//ANI
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:9481663b7480992af20c8941d7a8a190feb49c0b62',
						value: callBody.ANI
						},
						{//ExtVar1
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:9481663bbb837ef1a514dc478797bbb989a8d9b790',
						value: callBody.ExtVar1
						},
						{//ExtVar2
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:9481663bdf1254f57014c74f1bbd10e0f30c45ac6a',
						value: callBody.ExtVar2
						},
						{//Event
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:9481663c04517d214d12194e229b0982f540d5b084',
						value: callBody.Event
						},
						{//Media
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:9481663c8ed7fe19cfc18c440d9b216759cc9d951e',
						value: callBody.Media
						},
						{//Timestamp
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:9481663cda21d37cbd79784e2aa0f20b027f576790',
						value: callBody.Timestamp
						},
						{//TransactionId
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:9481663d31540c8d5a890341deb8ac5bf472a92246',
						value: callBody.TransactionId
						},
						{//TclSeletedItems
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:9481663d96815dad11c3064ac789bf1f32ea548c10',
						value: callBody.TclSeletedItems
						},
						{//TclSelectedDescs
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:9481663dcdf7372c6f0c3a402e93ca0d5cfbb11f01',
						value: callBody.TclSelectedDescs
						},
						{//InteractionGuid
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:94816632c7149d35b91ca748778f9201072f5679ac',
						value: callBody.InteractionGuid
						},
						{//UserDataXml
						dirty: true,
						fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:9481663e24c182289b7dea453486dd24d408ef5c73',
						value: callBody.UserDataXml
						}
				],
				persist: true
			};

			this.saveBusinessObject(payload).then(callLog => {
				return resolve(JSON.stringify(callLog));
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createCovidCase(formData,WPIID) {
		return new Promise((resolve, reject) => {
			const payload = {
				busObId: '947e19ccdca569b417a6944df497444fde9f6f0edb', // Covid Case
				fields: [
					{ // WPI
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19d45b31f2a022644040f3a4e5ec850a8de308',
						value: WPIID
					},
					{ // Test Type Trigger
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e4436342c382104300149acaa15e6dc93331c71',
						value: formData.test.type
					},
					{ // Test Type Date
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e5005a2ebf7471d94124e529a935c84c441f63c',
						value: formData.test.date
					},
					{ // Symptoms Mild
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19d8cb05628d4dac7d406488e0a2cddfc3ce13',
						value: formData.symptoms.mild
					},
					{ // Symptoms Mild Date
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e4434c97a5094f6e3254f848092c37f75d2f8b8',
						value: formData.symptoms.mildDate
					},
					{ // Symptoms - Severe - Breathing
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19db460c50977babfb4720b4b0ebf577e419fa',
						value: formData.symptoms.severe.breathing
					},
					{ // Symptoms - Severe - chestPain
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19dd3b13d17b7dc65f419e94a60ccb216223aa',
						value: formData.symptoms.severe.chestPain
					},
					{ // Symptoms - Severe - confusion
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19dda2ba4a9c866edd43c4a6169808ecd1bdff',
						value: formData.symptoms.severe.confusion
					},
					{ // Symptoms - Severe - awake
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19def09760e2553b4f4ecab7c1d5f147151b9a',
						value: formData.symptoms.severe.awake
					},
					{ // Symptoms - Severe - blueSkin
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19dffcc9e0ea7cad7345379674a5a18d64682f',
						value: formData.symptoms.severe.blueSkin
					},
					{ // Symptoms - Severe - fever
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19e0401f6fd6788a0849db88753dcf8d8d7e5e',
						value: formData.symptoms.severe.fever
					},
					{ // Health Condition - cancer
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19e1faa05ed0596c16434aa6eb76ad5032399e',
						value: formData.healthCondition.cancer
					},
					{ // Health Condition - cerebrovascular
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19e35fb1907810d3d248d6ba3f2cd70e341ea3',
						value: formData.healthCondition.cerebrovascular
					},
					{ // Health Condition - kidney
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19e3bbb7e849dffd114427b90a33571f344524',
						value: formData.healthCondition.kidney
					},
					{ // Health Condition - lung
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19e45bedde5d49f7f7499e9b7420e276afcac6',
						value: formData.healthCondition.lung
					},
					{ // Health Condition - liver
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19e4da1456df7d970e4c63a40754f71660f965',
						value: formData.healthCondition.liver
					},
					{ // Health Condition - diabetes
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19e53f4e388261f6a34fea8007c89c24ef603b',
						value: formData.healthCondition.diabetes
					},
					{ // Health Condition - heart
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19e582e6b71633417749e99b1ef391b6dbd629',
						value: formData.healthCondition.heart
					},
					{ // Health Condition - mentalHealth
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19e5ef5e0d3c268224431c8bd19f8ff75bb306',
						value: formData.healthCondition.mentalHealth
					},
					{ // Health Condition - obesity
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19e635ed784ed91eb34e25927eeaa99bac313f',
						value: formData.healthCondition.obesity
					},
					{ // Health Condition - pregnant
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19e740774fc0c4b60b4b2481fc0f28e1aff0f3',
						value: formData.healthCondition.pregnant
					},
					{ // Health Condition - smoking
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19e77f0443137866f44644a2313002f5a5aa73',
						value: formData.healthCondition.smoking
					},
					{ // Health Condition - tuberculosis
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19e8f25bce5449299b4605bec567f047617bf3',
						value: formData.healthCondition.tuberculosis
					},
					{ // Health Condition - otherImmune
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19e9432d1d1fb35c824e03b8663650a6bf0a86',
						value: formData.healthCondition.otherImmune
					},
					{ // Health Condition - Roommate
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e4433140adaaa3b86b84f818e2d11be5f000e7b',
						value: formData.healthCondition.roommate
					},
					{ // Exposure - recentCloseContact
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19eb84bbe01524dc7c43beac5276d72f20a4a8',
						value: formData.exposure.recentCloseContact
					},
					{ // Exposure - aroundSick
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19ec869cde10618dd744dbb72f8c7f11561266',
						value: formData.exposure.aroundSick
					},
					{ // Exposure - visitFamily
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19ed2ff308da93da8f4f28ae850139046ce6bc',
						value: formData.exposure.visitFamily
					},
					{ // Exposure - socialGathering
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19edb86e47b3ee4ada4bfd94222df9c9606964',
						value: formData.exposure.socialGathering
					},
					{ // Exposure - publicTransport
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19ee207ac526b8fa6040ec896d51c530164c49',
						value: formData.exposure.publicTransport
					},
					{ // Exposure - barRestaurant
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19ee8cdd1252f8d8cf420f96b7fafedc542d2d',
						value: formData.exposure.barRestaurant
					},
					{ // Exposure - funeralWedding
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19ef31991e616eb31b4216afed8a8ddbcc8576',
						value: formData.exposure.funeralWedding
					},
					{ // Exposure - salon
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19ef843ba7b8b738e14d65bf7865c77c2fc8c6',
						value: formData.exposure.salon
					},
					{ // Exposure - groupExercise
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19f050ef4c327418244074804a94e40df520b3',
						value: formData.exposure.groupExercise
					},
					{ // Exposure - pool
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19f0b20a27c300d00340988a7d5559adfd68a1',
						value: formData.exposure.pool
					},
					{ // Exposure - contactSport
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19f136a44492ed48724a699ba3aefd821a8ce6',
						value: formData.exposure.contactSport
					},
					{ // Exposure - recActivity
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19f1eaac35e92a2f1e45f2b357b051def6582d',
						value: formData.exposure.recActivity
					},
					{ // Exposure - movieTheater
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19f26c0407495ee33c4dbc84e0f6f2c201ce4a',
						value: formData.exposure.movieTheater
					},
					{ // Exposure - libraryMuseum
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19f31ce5d4c0ae7e044bd8a278639651033315',
						value: formData.exposure.libraryMuseum
					},
					{ // Exposure - mallGrocery
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19f394f5cdeded383a472cb58bd420474f4d39',
						value: formData.exposure.mallGrocery
					},
					{ // Exposure - largePublic
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19f4187b5e039d582a4717b14febaed9942587',
						value: formData.exposure.largePublic
					},
					{ // Exposure - roommate
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:9480448a94290dc496aad5479aa524a61dafe4e080',
						value: formData.exposure.roommate
					},
					{ // Exposure - Partners
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:9480448b1ba28a633ad75a44b7ab0d8727e42929e7',
						value: formData.exposure.partners
					},
					{ // Exposure - other
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19f46b53360d644a5a404fa8d32a3c071d8499',
						value: formData.exposure.other
					},
					{ // Exposure - otherDetail
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19f4ad1495f4a391294503944352f324be6c5c',
						value: formData.exposure.otherDetail
					},
					{ // Exposure - travel
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19f5bc10bd82c78a6b4a4185d0c125bef7e7fb',
						value: formData.exposure.travel
					},
					{ // Exposure - travelDestination
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19f65025489ec256b947d38210e497d04535ed',
						value: formData.exposure.travelDestination
					},
					{ // Exposure - travelDetails
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19f6b0c46d508808f2457292c6ec785dd4e17d',
						value: formData.exposure.travelDetails
					},
					{ // Diet - vegetarian
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19f7ac18a4ac2e512b4ba8ada24584358f436f',
						value: formData.diet.vegetarian
					},
					{ // Diet - vegan
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19f7da470ab22528054c02971a86a576542cf0',
						value: formData.diet.vegan
					},
					{ // Diet - lactose
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19f9eb8c65b6f252c44f8896dbf4104d2382bf',
						value: formData.diet.lactose
					},
					{ // Diet - gluten
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19fa45f976df612feb44d2b4aecd3f750950b0',
						value: formData.diet.gluten
					},
					{ // Diet - kosherhallal
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19fac5d11b275e6e8449a4bec08a5291ffd975',
						value: formData.diet.kosherhallal
					},
					{ // Diet - nut
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19fbe690be78d44d124f66b47e191c903ee4ae',
						value: formData.diet.nut
					},
					{ // Diet - seafood
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19fd864e54e45f7f2a4c85aeb591804b0ba0a6',
						value: formData.diet.seafood
					},
					{ // Diet - soy
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19fdc732efdcb6580c46f2af81e0f36f5e1e6d',
						value: formData.diet.soy
					},
					{ // Diet - other
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19fe3dee75fcc4db974508ba920c6a46222405',
						value: formData.diet.other
					},
					{ // Diet - otherDetail
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e19ff360104528ae5e748cba4da78dcde45ebc8',
						value: formData.diet.otherDetail
					},
					{ // Isolation - home
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e1a0066f2ea4bd639d54ffa9811008d175e065e',
						value: formData.isolation.home
					},
					{ // Isolation - city
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e1a0267c5b146d5529b4e5493173d538c32f871',
						value: formData.isolation.city
					},
					{ // Isolation - state
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e1a03da69d1959b9f174c7988df990887db25e3',
						value: formData.isolation.state
					},
					{ // Telephone 
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:948d184d3ea608ef8a85634079ba729b0c4af42e1a',
						value: formData.isolation.telephone
					},
					{ // acknowledgement
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e1a0b7d7b2273e001d5405b9774e345e07d109d',
						value: true
					},
					{ // contactME
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:948debc3dcbed5c211398c46d284bd4e50c0dabd57',
						value: formData.isolation.contactMe
					},
					{ // Isolation Location
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:948debc8bcfe5c8a31b9b7421c85db09c2ce43ca26',
						value: formData.isolation.location
					},
					{ // acknolwledgement Date
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e1a0bdcb997edbadf8345bb946af35a5df185f1',
						value: moment().toISOString()
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:947e19ccdca569b417a6944df497444fde9f6f0edb,FI:947e1a36a0db22b907ec4b492d86a416273ba5fa68',
						value: "In Isolation"
					},
				],
				persist: true
			};

			this.saveBusinessObject(payload).then(ticket => {
				return resolve(JSON.stringify(ticket));
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createCovidClear(formData,WPIID) {
		return new Promise((resolve, reject) => {
			const payload = {
				busObId: '947e508fcfd432122602d446479543f0d2f586b153', // Covid Clear
				fields: [
					{ // WPI
						dirty: true,
						fieldId: 'BO:947e508fcfd432122602d446479543f0d2f586b153,FI:947e51136f09f016b2477e4b0eb23bf93c37c6dffd',
						value: WPIID
					},
					{ // asymptomatic
						dirty: true,
						fieldId: 'BO:947e508fcfd432122602d446479543f0d2f586b153,FI:947e5112e82fb27cbc14bb4e018282a4382c03bc21',
						value: formData.check.asymptomatic
					},
					{ // feverFree
						dirty: true,
						fieldId: 'BO:947e508fcfd432122602d446479543f0d2f586b153,FI:947e5113404ab13400a5c547f5916287dbbce40e3a',
						value: formData.check.feverFree
					},
					{ // isolation
						dirty: true,
						fieldId: 'BO:947e508fcfd432122602d446479543f0d2f586b153,FI:947e511be2e2e029e03612423180f658af86e49cc6',
						value: formData.check.isolation
					},
					{ // test
						dirty: true,
						fieldId: 'BO:947e508fcfd432122602d446479543f0d2f586b153,FI:947e7a5e697a61d126e091412d86e82c7212c97676',
						value: formData.check.test
					}
					
				],
				persist: true
			};

			this.saveBusinessObject(payload).then(ticket => {
				return resolve(JSON.stringify(ticket));
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createSwipeRecord(formData) {
		return new Promise((resolve, reject) => {
			const payload = {
				busObId: '9474b9b4048b46f9f088de43d499805f80b7c06a33', 
				fields: [
					{ // Time Stamp
						dirty: true,
						fieldId: 'BO:9474b9b4048b46f9f088de43d499805f80b7c06a33,FI:9474b9b8a1074844bbd6af4c83a09b86292e7cac78',
						value: formData.timeStamp
					},
					{ // WPI ID
						dirty: true,
						fieldId: 'BO:9474b9b4048b46f9f088de43d499805f80b7c06a33,FI:9474b9baa06971385924f449e999ce39745e409467',
						value: formData.ID
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:9474b9b4048b46f9f088de43d499805f80b7c06a33,FI:9474b9bad6d4e8d7be7346426786120d2513fc8d96',
						value: formData.status
					},
					{ // Comments
						dirty: true,
						fieldId: 'BO:9474b9b4048b46f9f088de43d499805f80b7c06a33,FI:9474b9bb61645751e6b42f45bc90dc717a20356067',
						value: formData.comments
					},

				],
				persist: true
			};
			
			this.saveBusinessObject(payload).then(ticket => {
				return resolve(ticket);
			}).catch(err => {
				return reject(err);
			});
		});
	}

	createAllocationRecord(formData) {
		return new Promise((resolve, reject) => {
			const payload = {
				busObId: '94891eae54d2d97ba909044a8da89747c089ea3d01', 
				fields: [

					{ // WPI ID
						dirty: true,
						fieldId: 'BO:94891eae54d2d97ba909044a8da89747c089ea3d01,FI:94891ecfe5bcc6208d0fd74a4e8d0623683e993f5b',
						value: formData.ID
					},
					{ // Full Name
						dirty: true,
						fieldId: 'BO:94891eae54d2d97ba909044a8da89747c089ea3d01,FI:94891ed262ef4fff7da82246ac9e26da4cf0f9bcdf',
						value: formData.name
					},
					{ // Record Type
						dirty: true,
						fieldId: 'BO:94891eae54d2d97ba909044a8da89747c089ea3d01,FI:94891f01def150e37a52104528846fa8ddd2acde46',
						value: formData.recordType
					},
					{ // Quantity
						dirty: true,
						fieldId: 'BO:94891eae54d2d97ba909044a8da89747c089ea3d01,FI:94891eb2389e1a15bc4dae42b790d76b4535c327fc',
						value: 1
					},
					{ // Distributed By
						dirty: true,
						fieldId: 'BO:94891eae54d2d97ba909044a8da89747c089ea3d01,FI:948920918dff97373b96f4405b845f913a3fd677e2',
						value: formData.createdBy
					}

				],
				persist: true
			};
			this.saveBusinessObject(payload).then(ticket => {
				return resolve(ticket);
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createCovidDeptLog(formData) {
		return new Promise((resolve, reject) => {
			const payload = {
				busObId: '9463486073b7ad1289f39c41458faa136917c8013d', // DeptLog
				fields: [
					{ // First Name
						dirty: true,
						fieldId: 'BO:9463486073b7ad1289f39c41458faa136917c8013d,FI:946348630f5489ea0247574d02af5142e6d727eb85',
						value: formData.firstName || ""
					},
					{ // Last Name
						dirty: true,
						fieldId: 'BO:9463486073b7ad1289f39c41458faa136917c8013d,FI:9463486328b3f07d3c55cf423f986dcdfd2418b2f2',
						value: formData.lastName || ""
					},
					{ // Company Name
						dirty: true,
						fieldId: 'BO:9463486073b7ad1289f39c41458faa136917c8013d,FI:9463486498f694522140474477bbb1483f93392a7a',
						value: formData.companyName || ""
					},
					{ // Visit Start
						dirty: true,
						fieldId: 'BO:9463486073b7ad1289f39c41458faa136917c8013d,FI:94634863ca440bb7cabf294cce9c0beb3b3d1d5e6f',
						value: formData.visitStart || ""
					},
					{ // Visit End
						dirty: true,
						fieldId: 'BO:9463486073b7ad1289f39c41458faa136917c8013d,FI:9463486454eee45dc9eb7544a6b6fecff8cf5782e2',
						value: formData.visitEnd || ""
					},
					{ // Department Visiting
						dirty: true,
						fieldId: 'BO:9463486073b7ad1289f39c41458faa136917c8013d,FI:9463486510875b054c02144599a09e0cf1003009bc',
						value: formData.deptVisit || ""
					},
					{ // Department Contact Name
						dirty: true,
						fieldId: 'BO:9463486073b7ad1289f39c41458faa136917c8013d,FI:9463486568ec3bd4e1da0f4489acb6dad016560ac6',
						value: formData.deptContactName || ""
					},
					{ // Department Contact Email
						dirty: true,
						fieldId: 'BO:9463486073b7ad1289f39c41458faa136917c8013d,FI:94635867f4e78a975928d14ffe9a52810fc860d223',
						value: formData.deptContactEmail || ""
					},
					{ // Building
						dirty: true,
						fieldId: 'BO:9463486073b7ad1289f39c41458faa136917c8013d,FI:94634865aeeded56acaca9472a8039b26a658ad579',
						value: formData.building || ""
					},
					{ // Room
						dirty: true,
						fieldId: 'BO:9463486073b7ad1289f39c41458faa136917c8013d,FI:946348660ae3f9df12b26d4064be8fac4594590ac3',
						value: formData.room || ""
					},
					{ // Notes
						dirty: true,
						fieldId: 'BO:9463486073b7ad1289f39c41458faa136917c8013d,FI:94634866490d79b2c269264f6f911b2e381e91fc03',
						value: formData.note || ""
					},
					{ // Created By User
						dirty: true,
						fieldId: 'BO:9463486073b7ad1289f39c41458faa136917c8013d,FI:9463487b0f17217a950b87465e842f1df9858e3f6f',
						value: formData.userName || ""
					},
					{ // Created By Email
						dirty: true,
						fieldId: 'BO:9463486073b7ad1289f39c41458faa136917c8013d,FI:9463487b3658ace64e674f4fc1851e30c9e84d62b1',
						value: formData.userEmail || ""
					},
					{ // Created By ID
						dirty: true,
						fieldId: 'BO:9463486073b7ad1289f39c41458faa136917c8013d,FI:9463487beefd4a93edb84c412cb7f9087dcb3c9407',
						value: formData.userID || ""
					},
					{ // Created By Dept
						dirty: true,
						fieldId: 'BO:9463486073b7ad1289f39c41458faa136917c8013d,FI:946351c015b3dc252bfac5491a89639947d27ee814',
						value: formData.userDept || ""
					},
					{ // Type (Visitor, Vendor, Employee)
						dirty: true,
						fieldId: 'BO:9463486073b7ad1289f39c41458faa136917c8013d,FI:946475385df1af161bea9644a7b0897432675aba81',
						value: formData.type || ""
					},

					
				],
				persist: true
			};

			this.saveBusinessObject(payload).then(ticket => {
				return resolve(JSON.stringify(ticket));
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createCovidVisitor(formData) {
		return new Promise((resolve, reject) => {
			const payload = {
				busObId: '94663491368f8c5d41cfbb440fa33d0e700da6d565', // Covid Visitor Log
				fields: [
					{ // First Name
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:94663497a9db4342d00cfa4e5fbeb56cf450a178b1',
						value: formData.firstName || ""
					},
					{ // middle name
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:94663497d22d1f9c7a75b14084b82ea7b3f91c2f87',
						value: formData.middleName || ""
					},
					{ // last name
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:94663497ef9b78ac27364f4e8ca718e8ed7bf96aa5',
						value: formData.lastName || ""
					},
					{ //  full name
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:94663498170e6d12c91db242ec8ff5dcd541d7e45b',
						value: formData.fullName || ""
					},
					{ // Phone
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:94663498e5482bc867713e4c7eaca1332f30dc0288',
						value: formData.phone || ""
					},
					{ // Email
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:946634992ba9c0c3f062174f32a0d310655acb45c9',
						value: formData.email || ""
					},
					{ // Company
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:946634997de1cad84514ae4dffbd7dd6efaa682948',
						value: formData.companyName || ""
					},
					{ // Under 18
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:94663499e10dda430b142d4ec9ab8f24a9b1cfedc5',
						value: formData.underAge || ""
					},
					{ // Guardian Full NBame
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:9466349a7c0aa92504fea34f738f645daa26134781',
						value: formData.guardName || ""
					},
					{ //  Guardian Phone
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:9466349aebd6116a53dd4649d88a517db583db3af1',
						value: formData.guardPhone || ""
					},
					{ // Guardian Email
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:9466349b460d1e2b48414241d78bee1caf2ff8a03d',
						value: formData.guardEmail || ""
					},
					{ // Start date
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:9466349bd73443147a39db420183dcd1db0c431cd4',
						value: formData.visitStart || ""
					},
					{ // End Date
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:9466349ca0f38fa55954b141148c198b9eb8da73b9',
						value: formData.visitEnd || ""
					},
					{ // Dept Visiting
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:9466349d502aa0c20e1c324f9288937b1233fc6edf',
						value: formData.deptVisit || ""
					},
					{ // Dept Contact Full Name
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:9466349db4eec3ce064e3a43d9a84ca14d22e43dcb',
						value: formData.deptContactName || ""
					},
					{ // Dept Contact Email
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:9466349edd43e178d9d345489d9be8b25f55dc220c',
						value: formData.deptContactEmail || ""
					},
					{ // Building Visiting
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:9466349f9c256a8e50c8084253916e6c803116b3d7',
						value: formData.building || ""
					},
					{ // Room Visiting
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:9466349fe46691d8e0f78e4923a7247f7faa16f3d2',
						value: formData.room || ""
					},
					{ // Note
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:946634a03c49a97423f3324346bd02e5336193b155',
						value: formData.note || ""
					},
					{ // Code
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:9466350080e3f63f87d102401e85a1bca3436837f3',
						value: formData.code || ""
					},
					{ // AgreeTOS
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:946634a0b38fbec161b2ac488094feea007ebaa7cc',
						value: formData.agreeTOS || ""
					},
					{ // Type
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:946634a33442e5bf564a984d63b4d8dcc236c04ebb',
						value: formData.type || ""
					},
					{ // Agree Date
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:946634a1cacdc1d074b3574af9844433421420556d',
						value: formData.agreeDate || ""
					},
					{ // EmployeeAccess
						dirty: true,
						fieldId: 'BO:94663491368f8c5d41cfbb440fa33d0e700da6d565,FI:9466f02e1f1555628d925d47d2931d22e1d2c5e677',
						value: formData.employeeAccess || ""
					}

					
				],
				persist: true
			};

			this.saveBusinessObject(payload).then(ticket => {
				return resolve(JSON.stringify(ticket));
			}).catch(err => {
				return reject(err);
			});
		});
	}
	createIncidentStudentIntent(customerID, formData, customerFullName, employeeID) {
		return new Promise((resolve, reject) => {
			let detailsValue = `
				
				<p><strong>Source:</strong> ${formData.source}</p>
				<p><strong>Type:</strong> ${formData.type}</p>

				<h2>User Info</h2>
				<p><strong>Full Name:</strong> ${formData.fullName}</p>
				<p><strong>WPI ID #:</strong> ${formData.wpiID}</p>
				<p><strong>WPI Email:</strong> ${formData.email}</p>

				<h2>Plans</h2>
				<p>
				<strong>Now that WPI has announced plans for the fall; for A & B Term / Fall Semester do you plan to:</strong><br>
				${formData.plan}
				</p>

				<p>
				<strong>Where do you plan to live?</strong><br>
				${formData.housing}
				</p>
				`
				if(formData.isInternational == true){

				detailsValue += `
				<h2>Visa</h2>
				<p>
				<strong>Are you located outside the U.S?</strong><br>
				${formData.visaLocation}
				</p>
				<p>
				<strong>Do you need to secure a new visa?</strong><br>
				${formData.visaSecured}
				</p>
				<p>
				<strong>Have You Secured a Visa Appointment?</strong><br>
				${formData.visaAppointment}
				</p>
				<p>
				<strong>(Yes) When is it?</strong><br>
				${formData.visaDate}
				</p>
				`
				}

				detailsValue += `
				<h2>Address</h2>
				<p>
				<strong>Is this address where you will be collecting physical mail as of August 10th?</strong><br>
				${formData.addressOK}
				</p>
				`
				if(formData.addressOK == 'no'){
				detailsValue += `
				<strong>Address1</strong><br>
				${formData.address1}
				</p>
				<strong>Address2</strong><br>
				${formData.address2}
				</p>
				<strong>City</strong><br>
				${formData.city}
				</p>
				<strong>State</strong><br>
				${formData.state}
				</p>
				<strong>Zip</strong><br>
				${formData.zip}
				</p>
				<strong>Country</strong><br>
				${formData.country}
				</p>`
				}
				

				detailsValue += `
				<h2>Special Circumstances</h2>
				<p>
				<strong>Are there special circumstances that affect your decisions above that you’d like to talk about with a WPI representative? </strong><br>
				${formData.special}
				</p>
				`
				if(formData.special == 'yes'){
				detailsValue += `
				<p>
				<strong>(Yes) Please describe </strong><br>
				${formData.specialDetail}
				</p>
				`;
				}
				
			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: 'Student Intent Survey Fall 2020'
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Service Request'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'Student Intent Survey'
					},
					{ // Description
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:252b836fc72c4149915053ca1131d138',
						value: detailsValue
					},
					{ // Impact
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:ae05c132527e48bd95d063c445622df7',
						value: 'Whenever Possible'
					},
					{ // Urgency
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:29d741aae8bf461f8aafa3c9eb4dc822',
						value: 'Standard'
					},
					{ // Priority
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:83c36313e97b4e6b9028aff3b401b71c',
						value: '3'
					},
					{ // Service
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:936725cd10c735d1dd8c5b4cd4969cb0bd833655f4',
						value: 'DR Response'
					},
					{ // Category
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9e0b434034e94781ab29598150f388aa',
						value: 'Student Intent'
					},
					{ // Subcategory
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:1163fda7e6a44f40bb94d2b47cc58f46',
						value: 'Student Intent - Fall 2020'
					}
					
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				/**
				 * Make journal payload
				 */
				
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: detailsValue
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}

				this.getRelatedBusinessObjects('6dd53665c0c24cab86870a21cf6434ae', ticket.busObRecId, '933a679f9955f58f203e6d459592f5f19a87a9b622').then(specificsForm => {
					specificsForm = JSON.parse(specificsForm);
					const theSpecificsForm = specificsForm.relatedBusinessObjects[0];
					// Make specifics payload
					const specificsFields = [
						// Student ID
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:946178bb73c9fad42fcca2466eab16ccbb62da8ce4',
							value: formData.wpiID
						},
						// Student Name
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:946178bc024373c19628244416958aa0ef7103fa84',
							value: formData.fullName
						},
						// Student Email
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:94618ad3dbcb5bf53ba9584353a28915e88352895d',
							value: formData.email
						},
						// Student ColCode
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:94618ad592308dd258261d4d9e92b410b2a82301bc',
							value: formData.colCode
						},
						// Plan
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:946178af78168963e0c77c4c8798834868667d21ee',
							value: formData.plan
						},
						// Housing
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:946178b0459ec6ac949a234436b8642299286722f5',
							value: formData.housing
						},
						// Visa Located
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:946178b14a2f926c61258b4128b660530d44f21d2d',
							value: formData.visaLocation
						},
						// Visa Secured
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:94618ad1c3217a68f9f91041a7a29a0571c8932b71',
							value: formData.visaSecured
						},
						// Visa Appointment
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:94618ad160009a68095a054b4fa134049e537d967b',
							value: formData.visaAppointment
						},
						// Visa Date
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:946178b21bdded725eb4854516ab25c5644c1b0e41',
							value: formData.visaDate
						},
						// Address1
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:946178b2acd600686f55ae4412b00065b5e9c48631',
							value: formData.address1
						},
						// Address2
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:946178b2ee1dbbeab5d63e40c0b202834a08ba7137',
							value: formData.address2
						},
						// City
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:946178b38367bb010a461745b88a27d9f1a16b577a',
							value: formData.city
						},
						// State
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:946178b74d10e26b79b57b4fdc8e5e7870f62a43e8',
							value: formData.state
						},
						// Zip
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:946178b78eacc953dcbed142618cdb25b80e9b0c65',
							value: formData.zip
						},
						// Country
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:946178b7b6ad212346f3004e92855dab741bd1237c',
							value: formData.country
						},
						// Address Check
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:946178b8dbbef6a3fef0e2429c90b0c42cce3a73d2',
							value: formData.addressOK
						},
						// Special Check
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:946178b9f320e4b7bab9364878b9452b687f410145',
							value: formData.special
						},
						// Special Detail
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:946178ba37e36462b91d9b4302b115b7473f39e6c8',
							value: formData.specialDetail
						},
						// isResident
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:946178da9388debb33581349a0b45a11c1feaa8434',
							value: formData.isResident
						},
						// isInternational
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:946178dad1635f7d6a63a14224adee2ad1dc7cb941',
							value: formData.isInternational
						},
						// isFirstYear
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:946178dd2d796f6a6eb1b2412aaf3862bb74803465',
							value: formData.isFirstYear
						},
						// isGrad
						{
							dirty: true,
							fieldId: 'BO:946178ab8a6fe217834a6f43c49ff507e70777a9ba,FI:94618af3636045f2f5025a4389a26c9e710d406146',
							value: formData.isGrad
						},
						
						
						
					];

					const specificsPayload = {
						busObId: theSpecificsForm.busObId,
						busObRecId: theSpecificsForm.busObRecId,
						fields: specificsFields,
						persist: true
					};
					Promise.all([this.saveRelatedBusinessObject(journalPayload), this.saveBusinessObject(specificsPayload)]).then(() => {
						return resolve(JSON.stringify(ticket));
					}).catch(err => {
						return reject(err);
					});
				}).catch(err => {
					return reject(err);
				});
			}).catch(err => {
				return reject(err);
			});
		});
	}

	createIncidentWithAsset(customerID, formData, customerFullName, assetBusObRecId) {
		return new Promise((resolve, reject) => {
			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				fields: [
					{ // CallSource
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:93670bdf8abe2cd1f92b1f490a90c7b7d684222e13',
						value: 'Portal'
					},
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'New'
					},
					{ // Summary
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:944e5415a22df3753efde442cfae1010706317d687',
						value: 'New Ticket From Portal'
					},
					{ // IncidentType
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9365a6098398ff2551e1c14dd398c466d5a201a9c7',
						value: 'Incident'
					},
					{ // OwnedByTeam
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9339fc404e8d5299b7a7c64de79ab81a1c1ff4306c',
						value: 'Service Desk'
					},
					{ // Asset BusObID
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:9354c1c37a136d59ef5e874940bd225039776d5778',
						value: assetBusObRecId
					}
				],
				persist: true
			};
			payload.fields.push(
				{ // CustomerID
					dirty: true,
					fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:933bd530833c64efbf66f84114acabb3e90c6d7b8f',
					value: customerID || '93db6da57bde4b909d98d340d59e22c974abd9c903' // LoggedIn || Default Customer
				}
			);
			this.saveBusinessObject(payload).then(ticket => {
				ticket = JSON.parse(ticket);
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: `
Asset Tag: ${formData.assetTag}
Asset Friendly Name: ${formData.friendly}
Details: ${formData.details}
Source: ${formData.source}
Ticket Type: ${formData.type}`
						},
					],
					persist: true
				};
				if (customerID) {
					journalPayload.fields.push(
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					);
				}
				this.saveRelatedBusinessObject(journalPayload).then(() => {
					return resolve(JSON.stringify(ticket));
				}).catch(err => {
					return reject(err);
				});
			}).catch(err => {
				return reject(err);
			});
		});
	}

	createJournalForIncident(ticket, customerID, formData, customerFullName, setStatus = 'Assigned') {
		return new Promise((resolve, reject) => {
			const ticketPayload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				busObRecId: ticket.busObRecId, // RecID
				fields: [
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: setStatus
					}
				],
				persist: true
			};
			this.saveBusinessObject(ticketPayload).then(() => {
				const journalPayload = {
					parentBusObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
					parentBusObPublicId: ticket.busObPublicId,
					parentBusObRecId: ticket.busObRecId,
					relationshipId: '934d819237a4ec95ae69394e539440a17591e9d490',
					busObId: '9453426a3fb724746464b3456d854759d900764276', // JournalPortal
					fields: [
						{ // Direction
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:94534271238af76b1d844f414dba10ad12903797ea',
							value: 'Incoming'
						},
						{ // Raw Data
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342a3493b725885f41f4a40b6e207c1609de049',
							value: JSON.stringify(formData, null, 2)
						},
						{ // Details
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9341223bbcef1e2b8dfa6048a2bb4be1e94bad60ac',
							value: `${formData.details}`
						},
						{ // IncomingUserID
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:9453427747bc01b20a35544b6a9eb188e8af2eebd0',
							value: customerID
						},
						{ // IncomingUser
							dirty: true,
							fieldId: 'BO:9453426a3fb724746464b3456d854759d900764276,FI:945342757230494ca9b46949e7b3d7a24f4997f372',
							value: customerFullName || ''
						}
					],
					persist: true
				};
				this.saveRelatedBusinessObject(journalPayload).then(journal => {
					return resolve(JSON.stringify({ticket, journal}));
				}).catch(err => {
					return reject(err);
				});
			}).catch(err => {
				reject(err);
				return null;
			});
		});
	}

	reopenIncident(ticket) {
		const oneStepActionStandInKey = 'DefType:OneStepDef#Scope:Global#Id:93c28182ecc977b3dab73446549d977a008cd84ad2#Owner:6dd53665c0c24cab86870a21cf6434ae'; // references reopen incident
		const { busObId, busObRecId } = ticket;
		const payload = {
			oneStepActionStandInKey,
			busObId,
			busObRecId
		};
		return makeARequest(this.methods.POST, '/runonestepaction', this.baseURL, null, payload);
	}

	closeIncident(ticket) {
		return new Promise((resolve, reject) => {
			const payload = {
				busObId: '6dd53665c0c24cab86870a21cf6434ae', // Incident
				busObRecId: ticket.busObRecId, // RecID
				fields: [
					{ // Status
						dirty: true,
						fieldId: 'BO:6dd53665c0c24cab86870a21cf6434ae,FI:5eb3234ae1344c64a19819eda437f18d',
						value: 'Closed'
					}
				],
				persist: true
			};
			this.saveBusinessObject(payload).then(ticket => {
				resolve(ticket);
				return null;
			}).catch(err => {
				reject(err);
				return null;
			});
		});
	}

	saveBusinessObject(payload) {
		return makeARequest(this.methods.POST, '/savebusinessobject', this.baseURL, null, payload);
	}

	saveRelatedBusinessObject(payload) {
		return makeARequest(this.methods.POST, '/saverelatedbusinessobject', this.baseURL, null, payload);
	}
	

	getSearchResults(search) {
		return makeARequest(this.methods.POST, '/getsearchresults', this.baseURL, null, search);
	}

	getCustomerByID(employeeID) {
		const search = {
			filters: [
				{
					fieldId: 'BO:93405caa107c376a2bd15c4c8885a900be316f3a72,FI:9413741c677678f9d701d7470483540fa7ea3f9d91',
					operator: 'eq',
					value: employeeID
				}
			],
			association: 'Customer - Internal',
			busObId: '93405caa107c376a2bd15c4c8885a900be316f3a72',
			includeAllFields: true,
			pageNumber: 1,
			pageSize: 10,
			scope: 'Global',
			scopeOwner: '(none)',
			scopeName: 'Customer Info'
		};

		return this.getSearchResults(search);
	}
	getWorkdayCustomerByID(employeeID) {
		const search = {
			filters: [
				{
					fieldId: 'BO:9475d0f4e3ff49b4ce82d64a019d3073069502478a,FI:9475d0f69370819641fe7e40349826df820453a754',
					operator: 'eq',
					value: employeeID
				},
				{
					fieldId: 'BO:9475d0f4e3ff49b4ce82d64a019d3073069502478a,FI:9475d133b760aa91aab7b5477d946713d6f2d79062',
					operator: 'eq',
					value: 1
				}
			],
			association: 'TestReady',
			busObId: '9475d0f4e3ff49b4ce82d64a019d3073069502478a',
			includeAllFields: true,
			pageNumber: 1,
			pageSize: 10,
		};

		return this.getSearchResults(search);
	}

	getRelationshipID(busObjID, relationshipDisplayName) {
		return new Promise((resolve, reject) => {
			this.getBusinessObjectSchemaByBusObjID(busObjID, true).then(busObjSchema => {
				busObjSchema = JSON.parse(busObjSchema);
				if (busObjSchema.relationships) {
					const filteredSchema = busObjSchema.relationships.filter(value => value.displayName === relationshipDisplayName);
					if (filteredSchema.length) {
						resolve(
							JSON.stringify(
								{
									relationshipID: filteredSchema[0].relationshipId
								}
							)
						);
					} else {
						reject(new Error('unable to find relationship'));
					}
				} else {
					reject(new Error('unable to find relationship'));
				}
			}).catch(err => {
				reject(err);
			});
		});
	}

	getRelatedBusinessObjects(parentBusObjID, parentBusObjRecID, relationshipID) {
		return makeARequest(this.methods.GET, `/getrelatedbusinessobject/parentbusobid/${parentBusObjID}/parentbusobrecid/${parentBusObjRecID}/relationshipid/${relationshipID}`, this.baseURL);
	}
	linkRelatedBusinessObjects(parentBusObjID, parentBusObjRecID, relationshipID,busobid,busobrecid) {
		return makeARequest(this.methods.GET, `/linkrelatedbusinessobject/parentbusobid/${parentBusObjID}/parentbusobrecid/${parentBusObjRecID}/relationshipid/${relationshipID}/busobid/${busobid}/busobrecid/${busobrecid}`, this.baseURL);
	}

	getRelatedBusinessObjectsWithGrid(parentBusObjID, parentBusObjRecID, relationshipID, gridID) {
		return makeARequest(this.methods.GET, `/getrelatedbusinessobject/parentbusobid/${parentBusObjID}/parentbusobrecid/${parentBusObjRecID}/relationshipid/${relationshipID}/gridid/${gridID}`, this.baseURL);
	}

	getBusinessObject(busObjID, publicID) {
		return makeARequest(this.methods.GET, `/getbusinessobject/busobid/${busObjID}/publicid/${publicID}`, this.baseURL);
	}
	getBusinessObjectByRecID(busObjID, recID) {
		return makeARequest(this.methods.GET, `/getbusinessobject/busobid/${busObjID}/busobrecid/${recID}`, this.baseURL);
	}
	getBusinessObjectSchemaByBusObjID(busObjID, includeRelationships = false) {
		const qs = {};
		qs.includeRelationships = includeRelationships;
		return makeARequest(this.methods.GET, `/getbusinessobjectschema/busobid/${busObjID}`, this.baseURL, qs);
	}
	uploadBuisinessObjectAttachment(filename, busobid, busobrecid,offset,totalsize,payload) {
		return makeARequestFileUpload(this.methods.POST, `/uploadbusinessobjectattachment/filename/${filename}/busobid/${busobid}/busobrecid/${busobrecid}/offset/${offset}/totalsize/${totalsize}`, this.baseURL, null, payload);
	}
	getBusinessObjectSchemaByName(name, includeRelationships = false) {
		if (name in this.businessObjectIds) {
			return this.getBusinessObjectSchemaByBusObjID(this.businessObjectIds[name], includeRelationships);
		} else {
			return new Promise((resolve, reject) => {
				this.getBusinessObjectSummaryByName(name).then(businessObjectSummary => {
					businessObjectSummary = JSON.parse(businessObjectSummary);
					if (Array.isArray(businessObjectSummary));
					this.updateBusinessObjectIDCache(name, businessObjectSummary[0].busObId);
					resolve(this.getBusinessObjectSchemaByBusObjID(businessObjectSummary[0].busObId, includeRelationships));
				}).catch(err => {
					reject(err);
				});
			});
		}
	}

	getBusinessObjectIDByName(name) {
		if (name in this.businessObjectIds) {
			return Promise.resolve(this.businessObjectIds[name]);
		} else {
			return new Promise((resolve, reject) => {
				this.getBusinessObjectSummaryByName(name).then(businessObjectSummary => {
					businessObjectSummary = JSON.parse(businessObjectSummary);
					if (Array.isArray(businessObjectSummary));
					this.updateBusinessObjectIDCache(name, businessObjectSummary[0].busObId);
					resolve(this.businessObjectIds[name]);
				}).catch(err => {
					reject(err);
				});
			});
		}
	}

	getBusinessObjectSummaryByName(name) {
		return makeARequest(this.methods.GET, `/getbusinessobjectsummary/busobname/${name}`, this.baseURL);
	}

	getBusinessObjectSummariesByType(type) {
		if (!this.businessObjectTypes.includes(type)) {
			return Promise.reject(`${type} is not a valid type - must be one of [${this.businessObjectTypes.toString()}]`);
		}
		return makeARequest(this.methods.GET, `/getbusinessobjectsummaries/type/${type}`, this.baseURL);
	}

	getBusinessObjectTemplate(payload) {
		return makeARequest(this.methods.POST, '/getbusinessobjecttemplate', this.baseURL, null, payload);
	}

	getOneStepActions() {
		return makeARequest(this.methods.GET, '/getonestepactions', this.baseURL);
	}
	

	// class methods
	updateBusinessObjectIDCache(name, id) {
		this.businessObjectIds[name] = id;
	}
	
	getApprovalDept(){
		const filters = [];

		filters.push(
			{ // OwnedByTeam
				fieldId: 'BO:946635640029c21c04533e487f9e2e2d97c47a3626,FI:9466aa007cb1f432e394f047cca2c7414b4221808d',
				operator: 'eq',
				value: 'True'
			}
		);

		const search = {
			filters,
			fields: [
				'Department',
				'IsVisibleOnForm'
			],
			association: 'COVID19DepartmentLogApprovers',
			busObId: '946635640029c21c04533e487f9e2e2d97c47a3626',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 0,
			scope: 'Global'
		};
		return new Promise((resolve, reject) => {
			this.getSearchResults(search).then(results => {
				const deptsRaw = JSON.parse(results).businessObjects;
				const depts = [];
				for (const dept of deptsRaw) {
					depts.push(
						dept.fields.find(f => f.name === 'Department')['value'],
					);
				}
				resolve(depts);
			}).catch(err => {
				reject(err);
			});
		});
	}
	getCallLogByInteractionGUID(InteractionGUID){
		const filters = [];
		filters.push(
			{ // Find guid
				fieldId: 'BO:9481662ba319990089940d46c994d9e288fac9f6d6,FI:94816632c7149d35b91ca748778f9201072f5679ac',
				operator: 'eq',
				value: InteractionGUID
			},
		);
		const search = {
			filters,
			busObId: '9481662ba319990089940d46c994d9e288fac9f6d6',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 0,
			scope: 'Global'
		};
		return new Promise((resolve, reject) => {
			this.getSearchResults(search).then(results => {
				const callsRaw = JSON.parse(results).businessObjects;
				resolve(callsRaw);
			}).catch(err => {
				reject(err);
			});
		});
	}
	getSIEDept(){
		const filters = [];
		const search = {
			filters,
			fields: [
				'Department'
			],
			association: 'IEDepartment',
			busObId: '9473f3c491aa914c3a7ef84ff299b30e5202bdfa3f',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 0,
			sorting: [
				{
				  fieldId: "9473f3cdfe0b6246bc430547fca30542ca8a3e608b",
				  sortDirection: 1
				}
			  ],
			scope: 'Global'
		};
		return new Promise((resolve, reject) => {
			this.getSearchResults(search).then(results => {
				const deptsRaw = JSON.parse(results).businessObjects;
				const depts = [];
				for (const dept of deptsRaw) {
					depts.push(
						{
						"id":dept.fields.find(f => f.name === 'IEDepartmentID')['value'],
						"name": dept.fields.find(f => f.name === 'Department')['value'],
						}
					);
				}
				resolve(depts);
			}).catch(err => {
				reject(err);
			});
		});
	}
	getSIEGoals(){
		const filters = [];
		filters.push(
			{ // Hide from Site is False
				fieldId: 'BO:9473f3a91326c3adc6a94146b8aed299fd9cf52c51,FI:9473f408bb1d07922d7d7a40699cf944ae5e4a5ab2',
				operator: 'eq',
				value: 'False'
			}
		);
		const search = {
			filters,
			association: 'IEGoal',
			busObId: '9473f3a91326c3adc6a94146b8aed299fd9cf52c51',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 0,
			scope: 'Global'
		};
		return new Promise((resolve, reject) => {
			this.getSearchResults(search).then(results => {
				const goalsRaw = JSON.parse(results).businessObjects;
				const goals = [];
				for (const goal of goalsRaw) {
					let objectives = [];
					if(goal.fields.find(f => f.name === 'Goal1')['value'] == "True"){
						objectives.push("1")
					}
					if(goal.fields.find(f => f.name === 'Goal2')['value'] == "True"){
						objectives.push("2")
					}
					if(goal.fields.find(f => f.name === 'Goal3')['value'] == "True"){
						objectives.push("3")
					}
					if(goal.fields.find(f => f.name === 'Goal4')['value'] == "True"){
						objectives.push("4")
					}
					goals.push(
						{
							"id": goal.fields.find(f => f.name === 'IEGoalID')['value'],
							"Title": goal.fields.find(f => f.name === 'Title')['value'],
							"Subtitle": goal.fields.find(f => f.name === 'Subtitle')['value'],
							"Description": goal.fields.find(f => f.name === 'Description')['value'],
							"DepartmentID": goal.fields.find(f => f.name === 'DepartmentID')['value'],
							"Department": goal.fields.find(f => f.name === 'Department')['value'],
							"status":goal.fields.find(f => f.name === 'Status')['value'],
							"StartDate": goal.fields.find(f => f.name === 'StartDate')['value'],
							"EndDate": goal.fields.find(f => f.name === 'EndDate')['value'],
							"Goal1": goal.fields.find(f => f.name === 'Goal1')['value'],
							"Goal2": goal.fields.find(f => f.name === 'Goal2')['value'],
							"Goal3": goal.fields.find(f => f.name === 'Goal3')['value'],
							"Goal4": goal.fields.find(f => f.name === 'Goal4')['value'],
							"Featured": goal.fields.find(f => f.name === 'IsFeatured')['value'],
							"Objective":  objectives,
							"ObjectiveCSV":  objectives.toString(),
							"Outcomes":goal.fields.find(f => f.name === 'Outcomes')['value'],
						},
					);
				}
				resolve(goals);
			}).catch(err => {
				reject(err);
			});
		});
	}
	getASIEGoal(goalID){
		const filters = [];
		filters.push(
			{ // Hide from Site is False
				fieldId: 'BO:9473f3a91326c3adc6a94146b8aed299fd9cf52c51,FI:9473f408bb1d07922d7d7a40699cf944ae5e4a5ab2',
				operator: 'eq',
				value: 'False'
			},
			{ // Goal ID = ID
				fieldId: 'BO:9473f3a91326c3adc6a94146b8aed299fd9cf52c51,FI:9473f3b45ad9662d31dc004e2ea16280f3b718a3cb',
				operator: 'eq',
				value: goalID
			}
		);
		const search = {
			filters,
			association: 'IEGoal',
			busObId: '9473f3a91326c3adc6a94146b8aed299fd9cf52c51',
			includeAllFields: true,
			pageNumber: 0,
			pageSize: 0,
			scope: 'Global'
		};
		return new Promise((resolve, reject) => {
			this.getSearchResults(search).then(results => {
				const goalsRaw = JSON.parse(results).businessObjects;
				const goals = [];
				for (const goal of goalsRaw) {

					const stratFilters = [];
					stratFilters.push(
						{ // Hide from Site is False
							fieldId: 'BO:9473f3d937d88aa221b6bd4dda8515d236c2822578,FI:9473f408393516cc80737f44c7ad86a8e67d9ff5f5',
							operator: 'eq',
							value: 'False'
						},
						{ // Parent Goal ID = ID
							fieldId: 'BO:9473f3d937d88aa221b6bd4dda8515d236c2822578,FI:9473f3dfad8d2821f240da4a9280431aba3fb519a6',
							operator: 'eq',
							value: goal.fields.find(f => f.name === 'RecID')['value']
						}
					);
					const stratSearch = {
						"filters":stratFilters,
						association: 'IEStrategy',
						busObId: '9473f3d937d88aa221b6bd4dda8515d236c2822578',
						includeAllFields: true,
						pageNumber: 0,
						pageSize: 0,
						scope: 'Global'
					};

					this.getSearchResults(stratSearch).then(results => {
					const stratRaw = JSON.parse(results).businessObjects;
					

					const strategies = [];
					for (const strategy of stratRaw) {
						let objectives = [];
						if(goal.fields.find(f => f.name === 'Goal1')['value'] == "True"){
							objectives.push("1")
						}
						if(goal.fields.find(f => f.name === 'Goal2')['value'] == "True"){
							objectives.push("2")
						}
						if(goal.fields.find(f => f.name === 'Goal3')['value'] == "True"){
							objectives.push("3")
						}
						if(goal.fields.find(f => f.name === 'Goal4')['value'] == "True"){
							objectives.push("4")
						}
						strategies.push(
							{
								"id": strategy.fields.find(f => f.name === 'IEStrategyID')['value'],
								"Title": strategy.fields.find(f => f.name === 'Title')['value'],
								"ParentGoal": strategy.fields.find(f => f.name === 'ParentGoalTitle')['value'],
								"ParentGoalID": strategy.fields.find(f => f.name === 'ParentGoalID')['value'],
								"Subtitle": strategy.fields.find(f => f.name === 'Subtitle')['value'],
								"Description": strategy.fields.find(f => f.name === 'Description')['value'],
								"DepartmentID": strategy.fields.find(f => f.name === 'DepartmentID')['value'],
								"Department": strategy.fields.find(f => f.name === 'Department')['value'],
								"status":strategy.fields.find(f => f.name === 'Status')['value'],
								"StartDate": strategy.fields.find(f => f.name === 'StartDate')['value'],
								"EndDate": strategy.fields.find(f => f.name === 'EndDate')['value'],
								"Goal1": strategy.fields.find(f => f.name === 'Goal1')['value'],
								"Goal2": strategy.fields.find(f => f.name === 'Goal2')['value'],
								"Goal3": strategy.fields.find(f => f.name === 'Goal3')['value'],
								"Goal4": strategy.fields.find(f => f.name === 'Goal4')['value'],
								"Objective":  objectives,
								"ObjectiveCSV":  objectives.toString(),
								"Measures": strategy.fields.find(f => f.name === 'MeasureOfSuccess')['value'],
								"ImplementationLead": strategy.fields.find(f => f.name === 'ImplementationLead')['value'],
								"Outcomes":strategy.fields.find(f => f.name === 'Outcomes')['value'],
							},
						);
					}

					let objectives = [];
					if(goal.fields.find(f => f.name === 'Goal1')['value'] == "True"){
						objectives.push("1")
					}
					if(goal.fields.find(f => f.name === 'Goal2')['value'] == "True"){
						objectives.push("2")
					}
					if(goal.fields.find(f => f.name === 'Goal3')['value'] == "True"){
						objectives.push("3")
					}
					if(goal.fields.find(f => f.name === 'Goal4')['value'] == "True"){
						objectives.push("4")
					}
					goals.push(
						{
							"id": goal.fields.find(f => f.name === 'IEGoalID')['value'],
							"Title": goal.fields.find(f => f.name === 'Title')['value'],
							"Subtitle": goal.fields.find(f => f.name === 'Subtitle')['value'],
							"Description": goal.fields.find(f => f.name === 'Description')['value'],
							"DepartmentID": goal.fields.find(f => f.name === 'DepartmentID')['value'],
							"Department": goal.fields.find(f => f.name === 'Department')['value'],
							"status":goal.fields.find(f => f.name === 'Status')['value'],
							"StartDate": goal.fields.find(f => f.name === 'StartDate')['value'],
							"EndDate": goal.fields.find(f => f.name === 'EndDate')['value'],
							"Goal1": goal.fields.find(f => f.name === 'Goal1')['value'],
							"Goal2": goal.fields.find(f => f.name === 'Goal2')['value'],
							"Goal3": goal.fields.find(f => f.name === 'Goal3')['value'],
							"Goal4": goal.fields.find(f => f.name === 'Goal4')['value'],
							"Objective":  objectives,
							"ObjectiveCSV":  objectives.toString(),
							"Outcomes":goal.fields.find(f => f.name === 'Outcomes')['value'],
							"Strategies": strategies
						},
					);
					resolve(goals);
				})
			}
				
			}).catch(err => {
				reject(err);
			});
		});
	}

};

// helpers

function makeARequest(method, url, baseUrl, qs, form) {
	return new Promise((resolve, reject) => {
		CherwellTokenCache.getToken().then(token => {
			requestPromise(
				{
					method,
					baseUrl,
					url,
					qs,
					form,
					jar,
					headers: {
						'Cache-Control': 'no-cache',
						'Authorization': ` Bearer ${token}`
					}
				}
			).then(body => {
				resolve(body);
			}).catch(err => {
				logger.err('error making cherwell request');
				logger.err(err);
				reject(err);
			});
		}).catch(err => {
			logger.err('error getting cherwell token to make a request');
			logger.err(err);
			reject(err);
		});
	});
}
function makeARequestFileUpload(method, url, baseUrl, qs, file) {
	return new Promise((resolve, reject) => {
		CherwellTokenCache.getToken().then(token => {

			requestPromise(
				{
					method,
					baseUrl,
					url,
					headers: {
						'Content-Type': 'application/octet-stream',
						'Authorization': ` Bearer ${token}`
					},
					'body':file.buffer,
				}
			).then(body => {
				resolve(body);
			}).catch(err => {
				logger.err('error making cherwell request');
				logger.err(err);
				reject(err);
			});
		}).catch(err => {
			logger.err('error getting cherwell token to make a request');
			logger.err(err);
			reject(err);
		});
	});
}