const config = require('../config.js');
const moment = require('moment-timezone');
const sanitizeHTML = require('sanitize-html');
const requestPromise = require('request-promise-native');
// const logger = require('./logger.js');
const PermissionLevel = require('../models/PermissionLevel.js');
const Permission = require('../models/Permission.js');
const User = require('../models/User.js');
const Group = require('../models/Group.js');
const GroupPermissionLevel = require('../models/GroupPermissionLevel.js');
const CopyToken = require('../models/CopyToken.js');
const { Op } = require('sequelize');
const UserHasMyApp = require('../models/UserHasMyApp.js');
const MyApp = require('../models/MyApp.js');
const MyAppPhase = require('../models/MyAppPhase.js');
const FileUpload = require('../models/FileUpload.js');
const logger = require('./logger.js');
const UserOauth = require('../models/UserOauth.js');

module.exports = {
	/**
	 * @author Ryan LaMarche
	 * @description Default function for dateReviewBy fields in the database.
	 * @param {Integer} numMonths optional argument, otherwise uses default value from config.js
	 * @return {String} ISO date string
	 */
	defaultDateReviewByFunction: numMonths => {
		numMonths = numMonths || config.defaultDateReviewByMonths;
		let d = new Date();
		let mom = moment(d);
		mom.add(numMonths, 'months');
		return mom.format();
	},
	/**
	 * @author Ryan LaMarche
	 * @description Format a string into a phone number
	 * @param {String} phoneNumberString the string
	 * @return {String} phone number
	 */
	formatPhoneNumber: (phoneNumberString) => {
		const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
		const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
		if (match) {
			const intlCode = (match[1] ? '+1 ' : '');
			return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
		}
		return null;
	},
	/**
	 * @author Ryan LaMarche
	 * @description Format a string into an ISO date
	 * @param {String} str the string
	 * @return {String} ISO date string
	 */
	formatISODate: str => {
		const mom = moment(sanitizeHTML(str, config.sanitizeHTML.allowNone)).format();
		return mom === 'Invalid date' ? null : mom;
	},
	/**
	 * @author Ryan LaMarche
	 * @description Format a string into a hue
	 * @param {String} str the string
	 * @return {Number} hue between 0 - 360
	 */
	stringToHue: str => {
		let hash = 0;
		if (str.length === 0) {
			return hash;
		} else {
			for (let i = 0; i < str.length; i++) {
				hash = str.charCodeAt(i) + ((hash << 5) - hash);
				hash = hash & hash;
			}
		}
		return ((hash % 360) + 360) % 360;
	},
	/**
	 * @author Ryan LaMarche
	 * @description Sorting function meant to be called with Array.prototype.sort(<<thisFunction>>) for sorting arry of objects by title property.
	 * @param {Object} a - object a.
	 * @param {Object} b - object b.
	 * @return {Number} -1, 1, 0.
	 */
	sortByTitle: (a, b) => {
		if (a.title.toUpperCase() < b.title.toUpperCase()) {
			return -1;
		} else if (a.title.toUpperCase() > b.title.toUpperCase()) {
			return 1;
		} else {
			return 0;
		}
	},
	/**
	 * @author Ryan LaMarche
	 * @return next route if user is authenticated
	 */
	isAuthenticated: (req, res, next) => {
		return req.isAuthenticated() ? next() : next(403);
	},
	/**
	 * @author Ryan LaMarche
	 * @return next route if user is authenticated, otherwise log them in
	 */
	ensureAuthenticated: (req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		} else {
			req.session['saml-referrer'] = req.baseUrl + req.path;
			return res.redirect('/login');
		}
	},
	ensureAuthenticatedUnless: (req, res, next) => {
		var currentPath = req.baseUrl + req.path;

		if (req.isAuthenticated()) {
			if(currentPath == '/Me/My-NSO'){
				return next();
			}
			if(currentPath == '/Public/My-NSO'){
				return res.redirect('/Me/My-NSO');
			}
			return next();
		}else {
			if(currentPath == '/Me/My-NSO'){
				return res.redirect('/Public/My-NSO');
			}
			if(currentPath == '/Public/My-NSO'){
				return next();
			}
			req.session['saml-referrer'] = req.baseUrl + req.path;
			return res.redirect('/login');
		}
		
		
	},
	/**
	 * @author Ryan LaMarche
	 * @return next route if user is admin or super user
	 */
	nextIfAdmin: (req, res, next) => {
		return req.isAuthenticated() && (req.user.isAdmin || req.user.isSuperUser) ? next() : next(403);
	},
	/**
	 * @author Ryan LaMarche
	 * @return next route if user is super
	 */
	nextIfSuper: (req, res, next) => {
		return req.isAuthenticated() && req.user.isSuperUser ? next() : next(403);
	},
	/**
	 * @author Ryan LaMarche
	 * @return boolean whether or not user is admin
	 */
	isAdminUser: req => {
		return req.isAuthenticated() && (req.user.isAdmin || req.user.isSuperUser);
	},
	/**
	 * @author Ryan LaMarche
	 * @return boolean whether or not user is super
	 */
	isSuperUser: req => {
		return req.isAuthenticated() && req.user.isSuperUser;
	},
	/**
	 * ! THIS FUNCTION IS LITERALLY THE BACKBONE OF THIS ENTIRE APPLICATION
	 */
	/**
	 * @author Ryan LaMarche
	 * @description boolean function to check if the user has the necessary permissions to perform the request.
	 * @param {Object} req express routing object.
	 * @param {String} entity the entity to check permissions for.
	 * @param {String} entityID the ID of the entity to check permissions for (if null, only global permissions will be checked).
	 * @param {String} level the required permission level (if null, read-published permissions will be checked for).
	 * @return {Promise<Boolean>} true if the user has the permissions.
	 */
	checkPermissions: ({req, entity, entityID, level, useModel}) => {
		return new Promise(async(resolve, reject) => {

			// make sure input is valid
			if (typeof req === 'undefined' || typeof entity !== 'string') {
				logger.warn(`req undefined = ${typeof req === 'undefined'}; entity is not string = ${typeof entity !== 'string'}`);
				reject(new Error('malformed input to G.checkPermissions()'));
				return null;
			}

			// format input
			entity = entity.toLowerCase();
			entityID = typeof entityID !== 'undefined' ? parseInt(entityID) : null;
			level = typeof level === 'string' ? level.toLowerCase() : null;
			let permissionLevel = null;

			// get Model if the entity is not a fake entity
			const fakeEntities = ['console', 'articleinternal', 'group', 'featuredcontent', 'hours', 'ticket'];
			let Model;
			if (useModel) {
				Model = useModel;
			} else {
				Model = !fakeEntities.includes(entity) ? req.app.get('models')[Object.keys(req.app.get('models')).find(modelName => modelName.toLowerCase() === entity)] : null;
			}
			if (!Model && !fakeEntities.includes(entity)) {
				reject(new Error(`invalid model in G.checkPermissions: ${entity}`));
				return null;
			}

			// must be logged in unless the specific entity is published and access to it is not restricted (ex: restriction would be to groups with no permission level).
			if (entityID !== null && level === null) {

				var specificEntity = null;

				if(Model && 'findByIdFast' in Model){
					specificEntity = await Model.findByIdFast(entityID)
				}else if(Model && 'findById' in Model){
					specificEntity = await Model.findById(entityID)
				}else{
					specificEntity = null
				}
				
				if (specificEntity && 'getPhaseTitle' in specificEntity && specificEntity.getPhaseTitle() === 'publish' && 'isAccessRestricted' in specificEntity && !specificEntity.isAccessRestricted()) {
					resolve(true);
					return null;
				}
			}
			if (!req.isAuthenticated()) {
				resolve(false);
				return null;
			}

			// admins get everything
			if (req.user.isAdmin || req.user.isSuperUser) {
				resolve(true);
				return null;
			}

			// any permissions will give access to the console dashboard
			if (entity === 'console') {
				let result = false;
				if (req.user) {
					if (typeof req.user.permissions === 'object') {
						for (let userPermission in req.user.permissions) {
							if (req.user.permissions[userPermission].level !== null) {
								result = true;
								break;
							}
						}
					}
					if (!result && Array.isArray(req.user.groups)) {
						result = req.user.groups.some(g => {
							if (typeof g.permissions === 'object') {
								for (let groupPermission in g.permissions) {
									if (g.permissions[groupPermission].level !== null) {
										return true;
									}
								}
							}
						});
					}
					if (!result && (req.user.isAdmin || req.user.isSuperUser)) {
						result = true;
					}
				}
				resolve(result);
				return null;
			}
			// articleinternal is another special case
			if (entity === 'articleinternal') {
				/**
				 * check specific article and look for articleinternal permissions
				 */
				resolve(false); // TODO figure this out
				return null;
			}

			if (entity === 'group' && level === 'read' && entityID !== null) {
				resolve(req.user.groups.some(g => g.id === entityID));
				return null;
			}

			// get permission based on entity type
			const permission = await Permission.findOne(
				{
					where: {
						title: entity
					}
				}
			);
			if (!permission) {
				reject(new Error(`invalid permissions entity for G.checkPermissions(): ${entity}`));
				return null;
			}

			// check for UserPermissionLevel to entity type with level || group that is super and has that GroupPermissionLevel to entity type with level
			if (level !== null) {
				permissionLevel = await PermissionLevel.findOne(
					{
						where: {
							title: level
						},
						attributes: ['id', 'title']
					}
				);
				if (!permissionLevel) {
					reject(new Error(`invalid permission level for G.checkPermissions(): ${level}`));
					return null;
				}
				// UserPermissionLevel
				if (level === 'author' && entity !== null && entityID !== null) { // depends on phase

					if(Model && 'findByIdFast' in Model){
						specificEntity = await Model.findByIdFast(entityID)
					}else if(Model && 'findById' in Model){
						specificEntity = await Model.findById(entityID)
					}else{
						specificEntity = null
					}
					
					const phase = specificEntity && 'getPhaseTitle' in specificEntity ? specificEntity.getPhaseTitle() : '';
					if (phase === 'draft') {
						if (permissionLevel && req.user.permissions && req.user.permissions[entity] && req.user.permissions[entity].level >= 3) {
							resolve(true); // author can draft
							return null;
						}
					} else {
						if (permissionLevel && req.user.permissions && req.user.permissions[entity] && req.user.permissions[entity].level >= 4) { // requires publishing permissions to author things in other phases
							resolve(true);
							return null;
						}
					}
				} else { // does not depend on phase
					if (permissionLevel && req.user.permissions && req.user.permissions[entity] && req.user.permissions[entity].level >= permissionLevel.id) {
						resolve(true);
						return null;
					}
				}
				// GroupPermissionLevel where group isSuper
				if (permissionLevel && Array.isArray(req.user.groups)) {
					const superGroups = req.user.groups.filter(g => g.isSuper === true);
					if (superGroups && superGroups.length) {
						if (superGroups.findIndex(g => permissionLevel && g.permissions && g.permissions[entity] && g.permissions[entity].level >= permissionLevel.id) !== -1) {
							resolve(true);
							return null;
						}
					}
				}
			} else { // if level is null users would also get permissions if they have any permission level through UserPermissionLevel || super GroupPermissionLevel
				// UserPermissionLevel
				if (req.user.permissions && req.user.permissions[entity] && req.user.permissions[entity].level >= 1) {
					resolve(true);
					return null;
				}
				// GroupPermissionLevel where group isSuper
				if (Array.isArray(req.user.groups)) {
					const superGroups = req.user.groups.filter(g => g.isSuper === true);
					if (superGroups && superGroups.length) {
						if (superGroups.findIndex(g => g.permissions && g.permissions[entity] && g.permissions[entity].level >= 1) !== -1) {
							resolve(true);
							return null;
						}
					}
				}
			}

			/**
			 *
			 * different ways to gain access to an entity
			 * Super Groups and UserPermissionLevel have already been checked by this point
			 *
			 */

			// ! method 1
			if (entityID !== null && level !== null) {
				// logger.warn('method 1');
				/**
				 * Get groups with access to specific entity with at least permission level and containing req.user
				 */

				var specificEntity = null;

				if(Model && 'findByIdFast' in Model){
					specificEntity = await Model.findByIdFast(entityID)
				}else if(Model && 'findById' in Model){
					specificEntity = await Model.findById(entityID)
				}else{
					specificEntity = null
				}
				
				const phase = specificEntity && 'getPhaseTitle' in specificEntity ? specificEntity.getPhaseTitle() : '';
				const groups = specificEntity && 'getGroups' in specificEntity ? await specificEntity.getGroups(
					{
						include: [
							{
								model: User,
								where: {
									id: req.user.id
								},
								required: true
							},
							{
								model: GroupPermissionLevel,
								where: {
									idPermission: permission.id,
									idPermissionLevel: { [Op.gte]: permissionLevel.id }
								},
								required: true
							}
						]
					}
				) : [];
				const checkGroupPermissionsPromiseArray = [];
				for (const group of groups) {
					checkGroupPermissionsPromiseArray.push(
						new Promise(resolve => {
							let result = false;
							if (level === 'author') { // depends on phase
								for (let gpl of group.groupPermissionLevels) {
									if (phase === 'draft') {
										result = true; // can author draft
									} else {
										if (gpl.idPermissionLevel >= 4) { // requires publishing permissions to author things in other phases
											result = true;
										}
									}
								}
							} else { // does not depend on phase
								result = true;
							}
							resolve(result);
							return null;
						})
					);
				}
				// user must belong to a group that has the required permission level
				Promise.all(checkGroupPermissionsPromiseArray).then(results => {
					resolve(results.includes(true));
					return null;
				}).catch(err => {
					reject(err);
					return null;
				});

			// ! method 2
			} else if (entityID === null && level !== null) {
				// logger.warn('method 2');
				/**
				 * check for general permission with level to entity type (**ANY** GroupLevelPermission)
				 */
				let result = false;
				for (const group of req.user.groups) {
					if (permissionLevel && group.permissions && group.permissions[entity] && group.permissions[entity].level >= permissionLevel.id) {
						result = true;
					}
				}
				resolve(result);
				return null;


			// ! method 3
			} else if (entityID !== null && level === null) { // check for read-published permissions to specific entity by ID (GroupHasAccessTo)
				// logger.warn('method 3');
				/**
				 * check for permission to an entity type with no specific level, provided that the specific entity is published
				 */
				var specificEntity = null;

				if(Model && 'findByIdFast' in Model){
					specificEntity = await Model.findByIdFast(entityID)
				}else if(Model && 'findById' in Model){
					specificEntity = await Model.findById(entityID)
				}else{
					specificEntity = null
				}
				const phase = specificEntity && 'getPhaseTitle' in specificEntity ? specificEntity.getPhaseTitle() : '';
				// if it is published and not access restricted then it is just publicly facing the world
				if (phase === 'publish' && 'isAccessRestricted' in specificEntity && !specificEntity.isAccessRestricted()) {
					resolve(true);
					return null;
				} else { // otherwise check if there are any groups that grant access
					const groups = specificEntity && 'getGroups' in specificEntity ? await specificEntity.getGroups(
						{
							include: [
								{
									model: User,
									where: {
										id: req.user.id
									},
									required: true
								},
								{
									model: GroupPermissionLevel,
									required: false
								}
							]
						}
					) : [];
					const checkGroupPermissionsPromiseArray = [];
					for (const group of groups) {
						// logger.warn(JSON.stringify(group,null,2));
						checkGroupPermissionsPromiseArray.push(
							new Promise(resolve => {
								let result = phase === 'publish';
								for (let gpl of group.groupPermissionLevels) {
									switch(phase) {
										case 'draft':
										case 'review':
										case 'retire':
											if (gpl.idPermissionLevel >= 1) {
												result = true;
											}
											break;
										case 'publish':
											result = true;
											break;
									}
								}
								resolve(result);
								return null;
							})
						);
					}
					// user must belong to a group that has the required permission level (read-published and phase is published)
					Promise.all(checkGroupPermissionsPromiseArray).then(results => {
						resolve(results.includes(true));
						return null;
					}).catch(err => {
						reject(err);
						return null;
					});
				}
			} else {
				reject(new Error('no entityID or level - unable to check permissions in G.checkPermissions()'));
				return null;
			}
		});
	},
	/**
	 * @author Ryan LaMarche
	 * @description higher order function to check if the user has the necessary permissions to perform the request.
	 * @param {String} entity the entity to check permissions for.
	 * @param {String|Number} entityID the ID of the entity to check permissions for (if null, only global permissions will be checked).
	 * @param {String} level the required permission level (if null, read-published permissions will be checked for).
	 * @param {Boolean} checkReqParamsID Whether or not to check for req.params.id for the entityID - only if `entityID` is null.
	 * @return {Function} An express routing function.
	 */
	hasPermissions: ({entity, entityID, level, checkReqParamsID}) => {
		return async function(req, res, next) {
			if (checkReqParamsID === true) {
				if (typeof req.params.id !== 'string' || req.params.id.length === 0) {
					logger.warn('G.hasPermissions req.params.id required but missing');
					next(403);
					return null;
				}
				entityID = req.params.id;
			}
			try {
				const hasPermissions = await module.exports.checkPermissions(
					{
						req,
						entity,
						entityID,
						level
					}
				);
				if (hasPermissions) {
					next();
					return null;
				} else {
					logger.warn(`403 in G.hasPermissions: entity=${entity} entityID=${entityID} level=${level} url=${req.url}`);
					next(403);
					return null;
				}
			} catch (err) {
				next(err);
				return null;
			}
		};
	},
	/**
	 * @author Ryan LaMarche
	 * @description Ensure groups contains at least one group with req.user that has permissions to `entity`.
	 * @param {String} entity the entity.
	 * @param {Boolean} checkReqParamsID whether or not to check the specific entity to see if groups can be removed.
	 * @return {Function} An express routing funciton.
	 */
	validateReqBodyGroups: (entity, checkReqParamsID) => {
		return async function(req, res, next) {
			/**
			 * Check if groups are required for save
			 */
			// check for UserPermissionLevel || superGroups -> GroupPermissionLevel || isAdmin
			let groupsNotRequired = false;
			// UserPermissionLevel
			if (req.user.isAdmin || req.user.isSuperUser) {
				groupsNotRequired = true;
			}
			if (!groupsNotRequired && req.user.permissions && req.user.permissions[entity] && req.user.permissions[entity].level >= 3) {
				groupsNotRequired = true;
			}
			// superGroups -> GroupPermissionLevel
			if (!groupsNotRequired && Array.isArray(req.user.groups)) {
				const superGroups = req.user.groups.filter(g => g.isSuper === true);
				if (superGroups && superGroups.length) {
					if (superGroups.findIndex(g => g.permissions && g.permissions[entity] && g.permissions[entity].level >= 3) !== -1) {
						groupsNotRequired = true;
					}
				}
			}
			if (groupsNotRequired) {
				next();
				return null;
			}

			/**
			 * Check if groups are valid for save
			 */
			if (!(typeof req.body === 'object' && Array.isArray(req.body.groups))) {
				res.status(400).json(
					{
						status: 400,
						reason: 'Groups cannot be blank'
					}
				);
				return null;
			} else {
				entity = entity.toLowerCase();
				// get Model
				const modelNameLowercase = Object.keys(req.app.get('models')).find(modelName => modelName.toLowerCase() === entity);
				const Model = modelNameLowercase in req.app.get('models') ? req.app.get('models')[modelNameLowercase] : null;
				if (!Model) {
					next(400);
					return null;
				}
				let canRemoveGroups = false;
				if (checkReqParamsID === true) {
					const entityID = req.params.id;
					canRemoveGroups = await module.exports.checkPermissions({req, entity, entityID, level: 'delete'});

					if (!canRemoveGroups && typeof req.query !== 'undefined' && typeof req.query.copy_token === 'string') { // check if they have a valid copy token for this entity
						const copyToken = await CopyToken.findOne(
							{
								where: {
									entity,
									entityID,
									guid: req.query.copy_token,
									isValid: true,
									expires: {
										[Op.gte]: moment().local()
									}
								}
							}
						);

						if (copyToken) {
							canRemoveGroups = true;
							// ! copy token must be marked invalid in the save function for the model
						}

					}

					// if they cannot remove groups, then we must validate that the req.body.groups contains all of the entityGroups
					if (!canRemoveGroups) {
						const specificEntity = await Model.findById(req.params.id);
						const entityGroups = await specificEntity.getGroups().map(g => `${g.id}`);
						const groupsMatch = entityGroups.every(g_id => req.body.groups.includes(g_id));
						if (!groupsMatch) {
							res.status(403).json(
								{
									status: 403,
									reason: `You do not have the necessary permissions to remove groups from this ${entity}`
								}
							);
							return null;
						}
					}
				}

				/**
				 * Make sure the user is in one of the groups.
				 */
				return Group.findAll(
					{
						where: {
							id: {
								[Op.in]: req.body.groups
							}
						},
						include: [
							{
								model: User,
								required: true,
								where: {
									id: req.user.id
								}
							},
							{
								model: GroupPermissionLevel,
								required: true,
								separate: true,
								include: [
									{
										model: PermissionLevel,
										required: true,
										where: {
											id: {
												[Op.gte]: 1
											}
										}
									},
									{
										model: Permission,
										required: true,
										where: {
											title: entity
										}
									}
								]
							}
						]
					}
				).then(groups => {
					if (groups.some(g => Array.isArray(g.groupPermissionLevels) && g.groupPermissionLevels.length)) {
						next();
						return null;
					} else {
						res.status(403).json(
							{
								status: 403,
								reason: `You must belong to at least one of the groups to save this ${entity}`
							}
						);
						return null;
					}
				}).catch(err => {
					next(err);
					return null;
				});
			}
		};
	},
	/**
	 * @author Ryan LaMarche
	 * @description higher order function to check if the user has the necessary permissions to perform the request with the given phase.
	 * @param {String} entity the entity to check permissions for.
	 * @param {String} phaseField the field in the request body.
	 * @param {Boolean} checkReqParamsID check req.params.id.
	 * @return {Function} An express routing function.
	 */
	nextIfValidPhaseForUser: (entity, phaseField, checkReqParamsID) => {
		return async function(req, res, next) {
			let entityID;
			if (checkReqParamsID === true) {
				entityID = req.params.id;
			}
			const isAuthor = await module.exports.checkPermissions({req, entity, level: 'author', entityID});
			const isPublisher = await module.exports.checkPermissions({req, entity, level: 'publish', entityID});
			const phaseMap = {
				'1': isAuthor,
				'2': isAuthor,
				'3': isPublisher,
				'4': isPublisher
			};
			if (req.body && typeof req.body[phaseField] !== undefined && phaseMap[req.body[phaseField]]) {
				next();
				return null;
			} else {
				logger.warn(`403 nextIfValidPhaseForUser: entity: ${entity}, phase: ${req.body[phaseField]}`);
				next(403);
				return null;
			}
		};
	},
	/**
	 * @author Ryan LaMarche
	 * @description creates an object of classLists for res.locals for the navigation menu.
	 * @return {Object} express next route.
	 */
	setActiveTab: (req, res, next) => {
		const requestPath = req.path.split('/')[1];
		const keys = {
			'Me': 'myDashboard',
			'Ticket': 'myDashboard',
			'Knowledge-Base': 'knowledgeBase',
			'article': 'knowledgeBase',
			'spread': 'knowledgeBase',
			'glossary': 'knowledgeBase',
			'Locations-and-Servers': 'locations',
			'location': 'locations',
			'building': 'locations',
			'package': 'locations',
			'Service-Catalog': 'serviceCatalog',
			'portfolio': 'serviceCatalog',
			'service': 'serviceCatalog',
			'component': 'serviceCatalog',
			'Software-Library': 'softwareLibrary',
			'software': 'softwareLibrary',
			'license': 'softwareLibrary',
			'server': 'locations',
			'News-and-Events': 'newsAndEvents',
			'news': 'newsAndEvents',
			'console': 'console',
			'Apps': 'apps'
		};
		const tabs = {
			'index': '',
			'myDashboard': '',
			'knowledgeBase': '',
			'serviceCatalog': '',
			'softwareLibrary': '',
			'locations': '',
			'newsAndEvents': '',
			'console': '',
			'apps': ''
		};
		tabs[keys[requestPath]] = 'active';
		res.locals.tabs = tabs;
		return next();
	},
	buildPageTitle: (req, res, next) => {
		res.locals.title = 'The WPI Hub';
		const pageLink = req.path.split('/');
		if (pageLink[1]) {
			let p1 = ` | ${pageLink[1].replace(/-/g, ' ')}`;
			res.locals.title += p1.replace(/(?:^|\s)\w/g, p_ => p_.toUpperCase());
		}
		if (pageLink[3]) {
			let p3 = ` | ${pageLink[3].replace(/-/g, ' ')}`;
			res.locals.title += p3.replace(/(?:^|\s)\w/g, p_ => p_.toUpperCase());
		}
		return next();
	},
	verifyGrecaptchaToken: (token, ip) => {
		return new Promise((resolve, reject) => {
			requestPromise(
				{
					method: 'POST',
					url: 'https://www.google.com/recaptcha/api/siteverify',
					form: {
						secret: config.grecaptcha.secretKey,
						response: token,
						remoteip: ip || undefined
					},
					headers: {
						'Cache-Control': 'no-cache'
					}
				}
			).then(body => resolve(JSON.parse(body))).catch(err => reject(err));
		});
	},
	/**
	 * @author Ryan LaMarche
	 * @return next route if headers has net ops api key for authorization.
	 */
	requireNetOpsAPIKey: (req, res, next) => {
		const token = req.headers && req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
		if (token === config.cherwell.apiKeys.NetOps) {
			return next();
		} else {
			return res.status(403).json(
				{
					status: 403,
					reason: 'Invalid api key'
				}
			);
		}
	},
		/**
	 * @author Ryan LaMarche
	 * @return next route if headers has net ops api key for authorization.
	 */
		 requireTuftsAPIKey: (req, res, next) => {
			const token = req.headers && req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
			if (token === config.cherwell.apiKeys.Tufts) {
				return next();
			} else {
				return res.status(403).json(
					{
						status: 403,
						reason: 'Invalid api key'
					}
				);
			}
		},
	/**
	 * @author Ryan LaMarche
	 * @return next route if req.body.title is a string and has length of at least 1.
	 */
	requireReqBodyTitle: (req, res, next) => {
		if (typeof req.body.title === 'string' && req.body.title.length) {
			next();
			return null;
		} else {
			next(400);
			return null;
		}
	},
	requireOauthConsent: type => {
		return async function(req, res, next) {
			if (!req.isAuthenticated()) {
				res.redirect('/login');
			}
			try {
				const token = await UserOauth.getToken(req.user.id, type);
				if (token && token.success) {
					next();
					return null;
				} else {
					req.session[`${type}-referrer`] = req.originalUrl;
					res.redirect(`/api/v1/${type}/oauth2/v2.0/authorize`);
				}
			} catch (err) {
				next(err);
				return null;
			}
		};
	}
	
};