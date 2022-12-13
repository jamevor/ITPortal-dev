'use strict';
const config = require('../config.js');
const moment = require('moment');
const algoliasearch = require('algoliasearch');
const client = algoliasearch(config.algolia.applicationID, config.algolia.apiKey);
const index = client.initIndex(process.env.ALGOLIA_INDEX);

const Article = require('../models/Article.js');
const ArticlePhase = require('../models/ArticlePhase.js');
const Spread = require('../models/Spread.js');
const SpreadPhase = require('../models/SpreadPhase.js');
const Tag = require('../models/Tag.js');
const Alias = require('../models/Alias.js');
const Audience = require('../models/Audience.js');
const Action = require('../models/Action.js');
const ActionType = require('../models/ActionType.js');
const News = require('../models/News.js');
const NewsPhase = require('../models/NewsPhase.js');
const CatalogPhase = require('../models/CatalogPhase.js');
const Service = require('../models/Service.js');
const Portfolio = require('../models/Portfolio.js');
const Component = require('../models/Component.js');
const Location = require('../models/Location.js');
const Building = require('../models/Building.js');
const Software = require('../models/Software.js');
const SoftwarePhase = require('../models/SoftwarePhase.js');
const Server = require('../models/Server.js');
const ServerPhase = require('../models/ServerPhase.js');
const MetadataPhase = require('../models/MetadataPhase.js');
const MyApp = require('../models/MyApp.js');
const MyAppPhase = require('../models/MyAppPhase.js');

module.exports = {
	query: (req, res, next) => {
		let length;
		if (req.query.limit && req.query.limit.length) {
			length = parseInt(req.query.limit);
		}
		module.exports.queryIndex({query: req.query.q, length}).then(results => {
			res.json(results);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	queryIndex: searchOptions => {
		return index.search({...searchOptions, offset: 0});
	},
	queryIndexSilent: searchOptions => {
		return index.search(searchOptions.query,{facetFilters:searchOptions.facetFilters,length:searchOptions.length, offset: 0, analytics: false});
	},
	refresh: (req, res, next) => {
		module.exports.refreshIndex().then(data => {
			res.json(
				{
					success: true,
					count: data.length,
					description: `Successfully indexed ${data.length} items`
				}
			);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	refreshIndex: () => {
		return new Promise((globalResolve, globalReject) => {
			const buildObjectsPromises = [];
			// Article
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					Article.findAll(
						{
							include: [
								{
									model: ArticlePhase,
									where: {
										title: 'publish'
									}
								},
								{
									model: Tag
								},
								{
									model: Audience
								},
								{
									model: Action
								}
							]
						}
					).then(articles => {
						const objects = articles.map(a => {
							let content = null;
							if (!a.requireAuth) {
								content = new String(a.contentLegacy + a.contentAdvancedLegacy + a.content + a.contentAdvanced);
								content = content.slice(0, Math.min(8000, content.length));
							}
							return {
								objectID: a.guid,
								publicID: a.id,
								type: 'article',
								icon: 'fa-file-alt',
								color: '9193fa',
								dateCreate: moment(a.createdAt).valueOf(),
								dateModify: moment(a.updatedAt).valueOf(),
								title: a.title,
								link: a.getURL(),
								descriptionShort: a.descriptionShort,
								content,
								metadata: {
									tags: a.tags.map(t => t.title),
									aliases: [],
									audiences: a.audiences.map(a_ => a_.title),
									actions: a.actions.map(a_ => {
										return {
											title: a_.title,
											url: a_.link
										};
									})
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);

			// Spread
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					Spread.findAll(
						{
							include: [
								{
									model: SpreadPhase,
									where: {
										title: 'publish'
									}
								},
								{
									model: Tag
								},
								{
									model: Audience
								},
								{
									model: Alias
								}
							]
						}
					).then(spreads => {
						const objects = spreads.map(s => {
							let content = new String(s.column1 + s.column2 + s.column3);
							content = content.slice(0, Math.min(8000, content.length));
							return {
								objectID: s.guid,
								publicID: s.id,
								type: 'spread',
								icon: 'fa-columns',
								color: '9193fa',
								dateCreate: moment(s.createdAt).valueOf(),
								dateModify: moment(s.updatedAt).valueOf(),
								title: s.title,
								link: s.getURL(),
								descriptionShort: null,
								content,
								metadata: {
									tags: s.tags.map(t => t.title),
									aliases: s.aliases.map(a_ => a_.title),
									audiences: s.audiences.map(a_ => a_.title),
									actions: []
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);

			// Apps
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					MyApp.findAll(
						{
							include: [
								{
									model: MyAppPhase,
									where: {
										title: 'publish'
									}
								},
							]
						}
					).then(articles => {
						const objects = articles.map(a => {
							let content = a.descriptionShort;
							return {
								objectID: a.guid,
								publicID: a.id,
								type: 'app',
								icon: 'fa-icons',
								color: '28b1d5',
								dateCreate: moment(a.createdAt).valueOf(),
								dateModify: moment(a.updatedAt).valueOf(),
								title: a.title,
								link: a.getURL(),
								descriptionShort: a.descriptionShort,
								content,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);

			// News
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					News.findAll(
						{
							include: [
								{
									model: NewsPhase,
									where: {
										title: 'publish'
									}
								},
								{
									model: Tag
								},
								{
									model: Audience
								},
								{
									model: Action
								}
							]
						}
					).then(news => {
						const objects = news.map(n => {
							let content = new String(n.why + n.impact + n.benefits + n.actionDescription + n.details);
							content = content.slice(0, Math.min(8000, content.length));
							return {
								objectID: n.guid,
								publicID: n.id,
								type: 'news',
								icon: 'fa-newspaper',
								color: 'c1272d',
								dateCreate: moment(n.createdAt).valueOf(),
								dateModify: moment(n.updatedAt).valueOf(),
								title: n.title,
								link: n.getURL(),
								descriptionShort: n.descriptionShort,
								content,
								metadata: {
									tags: n.tags.map(t => t.title),
									aliases: [],
									audiences: n.audiences.map(a_ => a_.title),
									actions: n.actions.map(a_ => {
										return {
											title: a_.title,
											url: a_.link
										};
									})
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);

			// Service
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					Service.findAll(
						{
							include: [
								{
									model: CatalogPhase,
									where: {
										title: 'publish'
									}
								},
								{
									model: Tag
								},
								{
									model: Audience
								},
								{
									model: Alias
								},
								{
									model: Action
								}
							]
						}
					).then(services => {
						const objects = services.map(s => {
							let content = new String(s.descriptionLong);
							content = content.slice(0, Math.min(8000, content.length));
							return {
								objectID: s.guid,
								publicID: s.id,
								type: 'service',
								icon: 'fa-book',
								color: '36d657',
								dateCreate: moment(s.createdAt).valueOf(),
								dateModify: moment(s.updatedAt).valueOf(),
								title: s.title,
								link: s.getURL(),
								descriptionShort: s.descriptionShort,
								content,
								metadata: {
									tags: s.tags.map(t => t.title),
									aliases: s.aliases.map(a_ => a_.title),
									audiences: s.audiences.map(a_ => a_.title),
									actions: s.actions.map(a_ => {
										return {
											title: a_.title,
											url: a_.link
										};
									})
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);


			// Component
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					Component.findAll(
						{
							include: [
								{
									model: CatalogPhase,
									where: {
										title: 'publish'
									}
								},
								{
									model: Tag
								},
								{
									model: Audience
								},
								{
									model: Alias
								},
								{
									model: Action
								}
							]
						}
					).then(components => {
						const objects = components.map(c => {
							let content = new String(c.descriptionLong);
							content = content.slice(0, Math.min(8000, content.length));
							return {
								objectID: c.guid,
								publicID: c.id,
								type: 'component',
								icon: 'fa-book',
								color: '36d657',
								dateCreate: moment(c.createdAt).valueOf(),
								dateModify: moment(c.updatedAt).valueOf(),
								title: c.title,
								link: c.getURL(),
								descriptionShort: c.descriptionShort,
								content,
								metadata: {
									tags: c.tags.map(t => t.title),
									aliases: c.aliases.map(a_ => a_.title),
									audiences: c.audiences.map(a_ => a_.title),
									actions: c.actions.map(a_ => {
										return {
											title: a_.title,
											url: a_.link
										};
									})
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);


			// Portfolio
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
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
									model: Tag
								},
								{
									model: Alias
								},
								{
									model: Action
								}
							]
						}
					).then(portfolios => {
						const objects = portfolios.map(p => {
							let content = new String(p.descriptionLong);
							content = content.slice(0, Math.min(8000, content.length));
							return {
								objectID: p.guid,
								publicID: p.id,
								type: 'portfolio',
								icon: 'fa-book',
								color: '36d657',
								dateCreate: moment(p.createdAt).valueOf(),
								dateModify: moment(p.updatedAt).valueOf(),
								title: p.title,
								link: p.getURL(),
								descriptionShort: p.descriptionShort,
								content,
								metadata: {
									tags: p.tags.map(t => t.title),
									aliases: p.aliases.map(a_ => a_.title),
									audiences: [],
									actions: p.actions.map(a_ => {
										return {
											title: a_.title,
											url: a_.link
										};
									})
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);



			// Location
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					Location.findAll(
						{
							include: [
								{
									model: Tag
								},
								{
									model: Audience
								},
								{
									model: Alias
								}
							]
						}
					).then(location => {
						const objects = location.map(l => {
							let content = new String(l.roomNotes) + ' ' + l.room;
							content = content.slice(0, Math.min(8000, content.length));
							return {
								objectID: l.guid,
								publicID: l.id,
								type: 'location',
								icon: 'fa-map-marker-alt',
								color: 'f3553d',
								dateCreate: moment(l.createdAt).valueOf(),
								dateModify: moment(l.updatedAt).valueOf(),
								title: l.title,
								link: l.getURL(),
								descriptionShort: l.descriptionShort,
								content,
								metadata: {
									tags: l.tags.map(t => t.title),
									aliases: l.aliases.map(a_ => a_.title),
									audiences: l.audiences.map(a_ => a_.title),
									actions: []
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);


			// Software
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					Software.findAll(
						{
							include: [
								{
									model: SoftwarePhase,
									where: {
										title: 'publish'
									}
								},
								{
									model: Tag
								},
								{
									model: Audience
								},
								{
									model: Alias
								},
								{
									model: Action
								}
							]
						}
					).then(software => {
						const objects = software.map(s => {
							let content = new String(s.descriptionLong);
							content = content.slice(0, Math.min(8000, content.length));
							return {
								objectID: s.guid,
								publicID: s.id,
								type: 'software',
								icon: 'fa-arrow-alt-to-bottom',
								color: 'ff921f',
								dateCreate: moment(s.createdAt).valueOf(),
								dateModify: moment(s.updatedAt).valueOf(),
								title: s.title,
								link: s.getURL(),
								descriptionShort: s.descriptionShort,
								content,
								metadata: {
									tags: s.tags.map(t => t.title),
									aliases: s.aliases.map(a_ => a_.title),
									audiences: s.audiences.map(a_ => a_.title),
									actions: s.actions.map(a_ => {
										return {
											title: a_.title,
											url: a_.link,
										};
									})
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);


			// Server
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					Server.findAll(
						{
							where: {
								isArchived: false
							},
							include: [
								{
									model: ServerPhase,
									where: {
										title: 'publish'
									}
								},
								{
									model: Tag,
									include: [
										{
											model: MetadataPhase,
											where: {
												title: 'publish'
											}
										}
									]
								},
								{
									model: Audience,
									include: [
										{
											model: MetadataPhase,
											where: {
												title: 'publish'
											}
										}
									]
								},
								{
									model: Alias,
									include: [
										{
											model: MetadataPhase,
											where: {
												title: 'publish'
											}
										}
									]
								}
							]
						}
					).then(servers => {
						const objects = servers.map(s => {
							let content = new String(s.host);
							content = content.slice(0, Math.min(8000, content.length));
							return {
								objectID: s.guid,
								publicID: s.id,
								type: 'server',
								icon: 'fa-server',
								color: 'f3553d',
								dateCreate: moment(s.createdAt).valueOf(),
								dateModify: moment(s.updatedAt).valueOf(),
								title: s.title,
								link: s.getURL(),
								descriptionShort: s.descriptionShort,
								content,
								metadata: {
									tags: s.tags.map(t => t.title),
									aliases: s.aliases.map(a_ => a_.title),
									audiences: s.audiences.map(a_ => a_.title),
									actions: []
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);


			// Building
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					Building.findAll().then(building => {
						const objects = building.map(b => {
							let content = new String(b.address + b.abbr + b.common);
							content = content.slice(0, Math.min(8000, content.length));
							return {
								objectID: b.guid,
								publicID: b.id,
								type: 'building',
								icon: 'fa-building',
								color: 'ff921f',
								dateCreate: moment(b.createdAt).valueOf(),
								dateModify: moment(b.updatedAt).valueOf(),
								title: b.title,
								link: b.getURL(),
								descriptionShort: b.descriptionShort,
								content,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);

			// Actions
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					Action.findAll(
						{
							include: [
								{
									model: MetadataPhase,
									where: {
										title: 'publish'
									}
								},
								{
									model: ActionType,
									required: true
								}
							]
						}
					).then(actions => {
						const objects = actions.map(a => {
							return {
								objectID: a.guid,
								publicID: a.id,
								type: 'action',
								icon: a.actionType.icon,
								color: a.actionType.color,
								dateCreate: moment(a.createdAt).valueOf(),
								dateModify: moment(a.updatedAt).valueOf(),
								title: a.title,
								link: a.link,
								descriptionShort: a.descriptionShort,
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);

			// Pages
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					try {
						const objects = [
							{
								objectID: 'page-1',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Utilities',
								link: '/Utilities',
								descriptionShort: 'Quick Access to Tools and Utilities for managing networking, learning management, email, wpi accounts, UNIX utilities, administrative services setup wireless connection register a device for access request guest wireless canvas blackboard qualtrics wpi email manage a mailinglist manage a standinglist membership filter spam with puremessage change password unlock account change password manage web groups manage group logins web permissions repair tool web file drop bannerweb banner production forms development maps server production maps server',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-2',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								dateCreate: null,
								dateModify: null,
								title: 'Help & Support',
								link: '/Help',
								descriptionShort: 'Getting Support at WPI Information Technology Services at WPI provides various support mechanisms for the global WPI Community support methods phone in person online email interpretive dance support locations technology service desk location George C Godron Library WPI Main Campus Open Closed Hours of operation Call center Academic and Research Computing Academic Technology Center ATC Desktop Support Servcies Network Operations WPI Business Hours. Contact, phone support, call, callcenter, phonenumber, phone number,assistance, customer',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-3',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Service Catalog',
								link: '/Service-Catalog',
								descriptionShort: 'A list of all portfolios components and services within the WPI ITS Service Catalog. ',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-4',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Software Library',
								link: '/Software-Library',
								descriptionShort: 'A list of all software for use on campus including version, install location, operating system, locations for use, servers for use, and information on access and permissions',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-5',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'News',
								link: '/News-and-Events',
								descriptionShort: 'all news alerts and events for campus it news itnews',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-6',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Banner and Argos',
								link: '/Admin',
								descriptionShort: 'Banner and Administrative Services Bannerweb, Banner Production Forms INB Development MAPS Server ARGOS INTELLECHECK Production MAPS Server Banner Forms Using Banner Username Password Banner 8 Seed Database Using Banner Username Password TRNG PPRD STAGE Seed8 ODSP ODST ODS metadat',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-7',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Account Tools',
								link: '/Accounts',
								descriptionShort: 'Account maintenance change password change your WPI Windows Account Password Unlock Account Reset UNIX Password Manage groups manage group logins',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-8',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Site Map',
								link: '/Site-Map',
								descriptionShort: 'Sitemap links site map shortcuts all content',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-9',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Knowledge Base',
								link: '/Knowledge-Base',
								descriptionShort: 'knowledge help generic support problem article',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-10',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'App Marketplace',
								link: '/App-Marketplace',
								descriptionShort: 'install app application market marketplace get download favorite add canvas outlook portal office workday',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-1',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'My Account',
								link: '/Me/My-Account',
								descriptionShort: 'me myself i my its it login account password reset group groups unix',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-2',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Settings',
								link: '/Me/Settings',
								descriptionShort: 'me myself i my settings theme change',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-3',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'My Apps',
								link: '/Me/My-Apps',
								descriptionShort: 'me myself i my apps applications utilities install favorite',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-4',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'My ITS',
								link: '/Me/My-ITS',
								descriptionShort: 'me myself i my it its home dashboard',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-5',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'My Tickets',
								link: '/Me/My-Tickets',
								descriptionShort: 'me myself i my it its ticket tickets issue issues request requests help',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-6',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'History',
								link: '/Me/History',
								descriptionShort: 'me myself i my history view',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-7',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'My Assets',
								link: '/Me/My-Assets',
								descriptionShort: 'me myself i my assets devices view computer phone laptop mobile help',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-8',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'My Dashboard',
								link: '/Me/My-Dashboard',
								descriptionShort: 'me myself i my it its home dashboard',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-9',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'My Techflex',
								link: '/Me/My-Techflex',
								descriptionShort: 'TechFlex management for COVID Testing and Positive Case Management',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-10',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'My Commencement Experience',
								link: '/Me/My-Commencement',
								descriptionShort: 'Commencement Management page where you can RSVP to commencement, Fill out your Intent to Graduate form, Respond to the CDC Survey, Invite Guests and manage tickets, and complete namecoach',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-io-1',
								publicID: null,
								type: 'page',
								icon: 'fa-th-list',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Add Drop Form',
								link: '/io/Add-Drop',
								descriptionShort: 'Course Add Drop form for Adding and dropping courses with conflicts',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-io-2',
								publicID: null,
								type: 'page',
								icon: 'fa-th-list',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Grading Formatg Request Form',
								link: '/io/Grade-Format-Request',
								descriptionShort: 'Grade format request form for choosing pass fail',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-io-3',
								publicID: null,
								type: 'page',
								icon: 'fa-th-list',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Summer Course Offerings',
								link: '/io/Summer',
								descriptionShort: 'Course Offerings for Summer 2022',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-io-4',
								publicID: null,
								type: 'page',
								icon: 'fa-th-list',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'National Student Clearinghouse',
								link: '/io/NSC',
								descriptionShort: 'Enrollment Verification service through the NSC',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-io-5',
								publicID: null,
								type: 'page',
								icon: 'fa-th-list',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Software Request',
								link: '/io/Software-Request',
								descriptionShort: 'Request form for Software to be installed in a Lab or Classroom',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-11',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'My NSO',
								link: '/Me/My-NSO',
								descriptionShort: 'The Customzied page for the New Student Experience including events, news, resources, and training modules',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-12',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Covid Waivers',
								link: '/Me/My-Techflex',
								descriptionShort: 'WPI COVID-19 Health Management Program 2022-2023',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							
						];
						return resolve(objects);
					} catch(err) {
						return reject(err);
					}
				})
			);




			Promise.all(buildObjectsPromises).then(async allObjects_butInTwoDimensions => {
				
				const allObjects_butForRealThisTime = Array.prototype.concat.apply([], allObjects_butInTwoDimensions);
				let allObjects_removeNull = Object.fromEntries(Object.entries(allObjects_butForRealThisTime).filter(([_, v]) => v != null));
				allObjects_removeNull = Object.entries(allObjects_removeNull).map(([k, v]) => (v));
				
				await index.clearObjects();
				await index.saveObjects(allObjects_removeNull, {
					autoGenerateObjectIDIfNotExist: true
				  });
				globalResolve(allObjects_butForRealThisTime);
				return null;
			}).catch(err => {
				globalReject(err);
				return null;
			});
		});
	},
	preview: (req, res, next) => {
		return new Promise((globalResolve, globalReject) => {
			const buildObjectsPromises = [];
			// Article
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					Article.findAll(
						{
							include: [
								{
									model: ArticlePhase,
									where: {
										title: 'publish'
									}
								},
								{
									model: Tag
								},
								{
									model: Audience
								},
								{
									model: Action
								}
							]
						}
					).then(articles => {
						const objects = articles.map(a => {
							let content = null;
							if (!a.requireAuth) {
								content = new String(a.contentLegacy + a.contentAdvancedLegacy + a.content + a.contentAdvanced);
								content = content.slice(0, Math.min(8000, content.length));
							}
							return {
								objectID: a.guid,
								publicID: a.id,
								type: 'article',
								icon: 'fa-file-alt',
								color: '9193fa',
								dateCreate: moment(a.createdAt).valueOf(),
								dateModify: moment(a.updatedAt).valueOf(),
								title: a.title,
								link: a.getURL(),
								descriptionShort: a.descriptionShort,
								content,
								metadata: {
									tags: a.tags.map(t => t.title),
									aliases: [],
									audiences: a.audiences.map(a_ => a_.title),
									actions: a.actions.map(a_ => {
										return {
											title: a_.title,
											url: a_.link
										};
									})
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);

			// Spread
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					Spread.findAll(
						{
							include: [
								{
									model: SpreadPhase,
									where: {
										title: 'publish'
									}
								},
								{
									model: Tag
								},
								{
									model: Audience
								},
								{
									model: Alias
								}
							]
						}
					).then(spreads => {
						const objects = spreads.map(s => {
							let content = new String(s.column1 + s.column2 + s.column3);
							content = content.slice(0, Math.min(8000, content.length));
							return {
								objectID: s.guid,
								publicID: s.id,
								type: 'spread',
								icon: 'fa-columns',
								color: '9193fa',
								dateCreate: moment(s.createdAt).valueOf(),
								dateModify: moment(s.updatedAt).valueOf(),
								title: s.title,
								link: s.getURL(),
								descriptionShort: null,
								content,
								metadata: {
									tags: s.tags.map(t => t.title),
									aliases: s.aliases.map(a_ => a_.title),
									audiences: s.audiences.map(a_ => a_.title),
									actions: []
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);

			// Apps
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					MyApp.findAll(
						{
							include: [
								{
									model: MyAppPhase,
									where: {
										title: 'publish'
									}
								},
							]
						}
					).then(articles => {
						const objects = articles.map(a => {
							let content = a.descriptionShort;
							return {
								objectID: a.guid,
								publicID: a.id,
								type: 'app',
								icon: 'fa-icons',
								color: '28b1d5',
								dateCreate: moment(a.createdAt).valueOf(),
								dateModify: moment(a.updatedAt).valueOf(),
								title: a.title,
								link: a.getURL(),
								descriptionShort: a.descriptionShort,
								content,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);

			// News
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					News.findAll(
						{
							include: [
								{
									model: NewsPhase,
									where: {
										title: 'publish'
									}
								},
								{
									model: Tag
								},
								{
									model: Audience
								},
								{
									model: Action
								}
							]
						}
					).then(news => {
						const objects = news.map(n => {
							let content = new String(n.why + n.impact + n.benefits + n.actionDescription + n.details);
							content = content.slice(0, Math.min(8000, content.length));
							return {
								objectID: n.guid,
								publicID: n.id,
								type: 'news',
								icon: 'fa-newspaper',
								color: 'c1272d',
								dateCreate: moment(n.createdAt).valueOf(),
								dateModify: moment(n.updatedAt).valueOf(),
								title: n.title,
								link: n.getURL(),
								descriptionShort: n.descriptionShort,
								content,
								metadata: {
									tags: n.tags.map(t => t.title),
									aliases: [],
									audiences: n.audiences.map(a_ => a_.title),
									actions: n.actions.map(a_ => {
										return {
											title: a_.title,
											url: a_.link
										};
									})
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);

			// Service
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					Service.findAll(
						{
							include: [
								{
									model: CatalogPhase,
									where: {
										title: 'publish'
									}
								},
								{
									model: Tag
								},
								{
									model: Audience
								},
								{
									model: Alias
								},
								{
									model: Action
								}
							]
						}
					).then(services => {
						const objects = services.map(s => {
							let content = new String(s.descriptionLong);
							content = content.slice(0, Math.min(8000, content.length));
							return {
								objectID: s.guid,
								publicID: s.id,
								type: 'service',
								icon: 'fa-book',
								color: '36d657',
								dateCreate: moment(s.createdAt).valueOf(),
								dateModify: moment(s.updatedAt).valueOf(),
								title: s.title,
								link: s.getURL(),
								descriptionShort: s.descriptionShort,
								content,
								metadata: {
									tags: s.tags.map(t => t.title),
									aliases: s.aliases.map(a_ => a_.title),
									audiences: s.audiences.map(a_ => a_.title),
									actions: s.actions.map(a_ => {
										return {
											title: a_.title,
											url: a_.link
										};
									})
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);


			// Component
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					Component.findAll(
						{
							include: [
								{
									model: CatalogPhase,
									where: {
										title: 'publish'
									}
								},
								{
									model: Tag
								},
								{
									model: Audience
								},
								{
									model: Alias
								},
								{
									model: Action
								}
							]
						}
					).then(components => {
						const objects = components.map(c => {
							let content = new String(c.descriptionLong);
							content = content.slice(0, Math.min(8000, content.length));
							return {
								objectID: c.guid,
								publicID: c.id,
								type: 'component',
								icon: 'fa-book',
								color: '36d657',
								dateCreate: moment(c.createdAt).valueOf(),
								dateModify: moment(c.updatedAt).valueOf(),
								title: c.title,
								link: c.getURL(),
								descriptionShort: c.descriptionShort,
								content,
								metadata: {
									tags: c.tags.map(t => t.title),
									aliases: c.aliases.map(a_ => a_.title),
									audiences: c.audiences.map(a_ => a_.title),
									actions: c.actions.map(a_ => {
										return {
											title: a_.title,
											url: a_.link
										};
									})
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);


			// Portfolio
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
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
									model: Tag
								},
								{
									model: Alias
								},
								{
									model: Action
								}
							]
						}
					).then(portfolios => {
						const objects = portfolios.map(p => {
							let content = new String(p.descriptionLong);
							content = content.slice(0, Math.min(8000, content.length));
							return {
								objectID: p.guid,
								publicID: p.id,
								type: 'portfolio',
								icon: 'fa-book',
								color: '36d657',
								dateCreate: moment(p.createdAt).valueOf(),
								dateModify: moment(p.updatedAt).valueOf(),
								title: p.title,
								link: p.getURL(),
								descriptionShort: p.descriptionShort,
								content,
								metadata: {
									tags: p.tags.map(t => t.title),
									aliases: p.aliases.map(a_ => a_.title),
									audiences: [],
									actions: p.actions.map(a_ => {
										return {
											title: a_.title,
											url: a_.link
										};
									})
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);



			// Location
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					Location.findAll(
						{
							include: [
								{
									model: Tag
								},
								{
									model: Audience
								},
								{
									model: Alias
								}
							]
						}
					).then(location => {
						const objects = location.map(l => {
							let content = new String(l.roomNotes) + ' ' + l.room;
							content = content.slice(0, Math.min(8000, content.length));
							return {
								objectID: l.guid,
								publicID: l.id,
								type: 'location',
								icon: 'fa-map-marker-alt',
								color: 'f3553d',
								dateCreate: moment(l.createdAt).valueOf(),
								dateModify: moment(l.updatedAt).valueOf(),
								title: l.title,
								link: l.getURL(),
								descriptionShort: l.descriptionShort,
								content,
								metadata: {
									tags: l.tags.map(t => t.title),
									aliases: l.aliases.map(a_ => a_.title),
									audiences: l.audiences.map(a_ => a_.title),
									actions: []
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);


			// Software
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					Software.findAll(
						{
							include: [
								{
									model: SoftwarePhase,
									where: {
										title: 'publish'
									}
								},
								{
									model: Tag
								},
								{
									model: Audience
								},
								{
									model: Alias
								},
								{
									model: Action
								}
							]
						}
					).then(software => {
						const objects = software.map(s => {
							let content = new String(s.descriptionLong);
							content = content.slice(0, Math.min(8000, content.length));
							return {
								objectID: s.guid,
								publicID: s.id,
								type: 'software',
								icon: 'fa-arrow-alt-to-bottom',
								color: 'ff921f',
								dateCreate: moment(s.createdAt).valueOf(),
								dateModify: moment(s.updatedAt).valueOf(),
								title: s.title,
								link: s.getURL(),
								descriptionShort: s.descriptionShort,
								content,
								metadata: {
									tags: s.tags.map(t => t.title),
									aliases: s.aliases.map(a_ => a_.title),
									audiences: s.audiences.map(a_ => a_.title),
									actions: s.actions.map(a_ => {
										return {
											title: a_.title,
											url: a_.link,
										};
									})
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);


			// Server
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					Server.findAll(
						{
							where: {
								isArchived: false
							},
							include: [
								{
									model: ServerPhase,
									where: {
										title: 'publish'
									}
								},
								{
									model: Tag,
									include: [
										{
											model: MetadataPhase,
											where: {
												title: 'publish'
											}
										}
									]
								},
								{
									model: Audience,
									include: [
										{
											model: MetadataPhase,
											where: {
												title: 'publish'
											}
										}
									]
								},
								{
									model: Alias,
									include: [
										{
											model: MetadataPhase,
											where: {
												title: 'publish'
											}
										}
									]
								}
							]
						}
					).then(servers => {
						const objects = servers.map(s => {
							let content = new String(s.host);
							content = content.slice(0, Math.min(8000, content.length));
							return {
								objectID: s.guid,
								publicID: s.id,
								type: 'server',
								icon: 'fa-server',
								color: 'f3553d',
								dateCreate: moment(s.createdAt).valueOf(),
								dateModify: moment(s.updatedAt).valueOf(),
								title: s.title,
								link: s.getURL(),
								descriptionShort: s.descriptionShort,
								content,
								metadata: {
									tags: s.tags.map(t => t.title),
									aliases: s.aliases.map(a_ => a_.title),
									audiences: s.audiences.map(a_ => a_.title),
									actions: []
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);


			// Building
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					Building.findAll().then(building => {
						const objects = building.map(b => {
							let content = new String(b.address + b.abbr + b.common);
							content = content.slice(0, Math.min(8000, content.length));
							return {
								objectID: b.guid,
								publicID: b.id,
								type: 'building',
								icon: 'fa-building',
								color: 'ff921f',
								dateCreate: moment(b.createdAt).valueOf(),
								dateModify: moment(b.updatedAt).valueOf(),
								title: b.title,
								link: b.getURL(),
								descriptionShort: b.descriptionShort,
								content,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);

			// Actions
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					Action.findAll(
						{
							include: [
								{
									model: MetadataPhase,
									where: {
										title: 'publish'
									}
								},
								{
									model: ActionType,
									required: true
								}
							]
						}
					).then(actions => {
						const objects = actions.map(a => {
							return {
								objectID: a.guid,
								publicID: a.id,
								type: 'action',
								icon: a.actionType.icon,
								color: a.actionType.color,
								dateCreate: moment(a.createdAt).valueOf(),
								dateModify: moment(a.updatedAt).valueOf(),
								title: a.title,
								link: a.link,
								descriptionShort: a.descriptionShort,
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							};
						});

						return resolve(objects);

					}).catch(err => {
						return reject(err);
					});
				})
			);

			// Pages
			buildObjectsPromises.push(
				new Promise((resolve, reject) => {
					try {
						const objects = [
							{
								objectID: 'page-1',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Utilities',
								link: '/Utilities',
								descriptionShort: 'Quick Access to Tools and Utilities for managing networking, learning management, email, wpi accounts, UNIX utilities, administrative services setup wireless connection register a device for access request guest wireless canvas blackboard qualtrics wpi email manage a mailinglist manage a standinglist membership filter spam with puremessage change password unlock account change password manage web groups manage group logins web permissions repair tool web file drop bannerweb banner production forms development maps server production maps server',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-2',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								dateCreate: null,
								dateModify: null,
								title: 'Help & Support',
								link: '/Help',
								descriptionShort: 'Getting Support at WPI Information Technology Services at WPI provides various support mechanisms for the global WPI Community support methods phone in person online email interpretive dance support locations technology service desk location George C Godron Library WPI Main Campus Open Closed Hours of operation Call center Academic and Research Computing Academic Technology Center ATC Desktop Support Servcies Network Operations WPI Business Hours. Contact, phone support, call, callcenter, phonenumber, phone number,assistance, customer',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-3',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Service Catalog',
								link: '/Service-Catalog',
								descriptionShort: 'A list of all portfolios components and services within the WPI ITS Service Catalog. ',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-4',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Software Library',
								link: '/Software-Library',
								descriptionShort: 'A list of all software for use on campus including version, install location, operating system, locations for use, servers for use, and information on access and permissions',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-5',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'News',
								link: '/News-and-Events',
								descriptionShort: 'all news alerts and events for campus it news itnews',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-6',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Banner and Argos',
								link: '/Admin',
								descriptionShort: 'Banner and Administrative Services Bannerweb, Banner Production Forms INB Development MAPS Server ARGOS INTELLECHECK Production MAPS Server Banner Forms Using Banner Username Password Banner 8 Seed Database Using Banner Username Password TRNG PPRD STAGE Seed8 ODSP ODST ODS metadat',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-7',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Account Tools',
								link: '/Accounts',
								descriptionShort: 'Account maintenance change password change your WPI Windows Account Password Unlock Account Reset UNIX Password Manage groups manage group logins',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-8',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Site Map',
								link: '/Site-Map',
								descriptionShort: 'Sitemap links site map shortcuts all content',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-9',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Knowledge Base',
								link: '/Knowledge-Base',
								descriptionShort: 'knowledge help generic support problem article',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-10',
								publicID: null,
								type: 'page',
								icon: 'fa-browser',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'App Marketplace',
								link: '/App-Marketplace',
								descriptionShort: 'install app application market marketplace get download favorite add canvas outlook portal office workday',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-1',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'My Account',
								link: '/Me/My-Account',
								descriptionShort: 'me myself i my its it login account password reset group groups unix',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-2',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'Settings',
								link: '/Me/Settings',
								descriptionShort: 'me myself i my settings theme change',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-3',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'My Apps',
								link: '/Me/My-Apps',
								descriptionShort: 'me myself i my apps applications utilities install favorite',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-4',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'My ITS',
								link: '/Me/My-ITS',
								descriptionShort: 'me myself i my it its home dashboard',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-5',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'My Tickets',
								link: '/Me/My-Tickets',
								descriptionShort: 'me myself i my it its ticket tickets issue issues request requests help',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-6',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'History',
								link: '/Me/History',
								descriptionShort: 'me myself i my history view',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-7',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'My Assets',
								link: '/Me/My-Assets',
								descriptionShort: 'me myself i my assets devices view computer phone laptop mobile help',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
							{
								objectID: 'page-me-8',
								publicID: null,
								type: 'page',
								icon: 'fa-robot',
								color: 'c1272d',
								dateCreate: null,
								dateModify: null,
								title: 'My Dashboard',
								link: '/Me/My-Dashboard',
								descriptionShort: 'me myself i my it its home dashboard',
								content: null,
								metadata: {
									tags: [],
									aliases: [],
									audiences: [],
									actions: []
								}
							},
						];
						return resolve(objects);
					} catch(err) {
						return reject(err);
					}
				})
			);

			Promise.all(buildObjectsPromises).then(async allObjects_butInTwoDimensions => {
				const allObjects_butForRealThisTime = Array.prototype.concat.apply([], allObjects_butInTwoDimensions);
				let allObjects_removeNull = Object.fromEntries(Object.entries(allObjects_butForRealThisTime).filter(([_, v]) => v != null));
				allObjects_removeNull = Object.entries(allObjects_removeNull).map(([k, v]) => (v));

				res.json(allObjects_removeNull);
				return null;
			}).catch(err => {
				globalReject(err);
				return null;
			});
		});
	}
};

