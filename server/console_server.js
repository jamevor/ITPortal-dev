const SubSite = require('../models/SubSite.js');
const SubSitePhase = require('../models/SubSitePhase.js');
const Article = require('../models/Article.js');
const ArticlePhase = require('../models/ArticlePhase.js');
const Spread = require('../models/Spread.js');
const SpreadPhase = require('../models/SpreadPhase.js');
const News = require('../models/News.js');
const NewsPhase = require('../models/NewsPhase.js');
const Portfolio = require('../models/Portfolio.js');
const Service = require('../models/Service.js');
const Component = require('../models/Component.js');
const CatalogPhase = require('../models/CatalogPhase.js');
const Building = require('../models/Building.js');
const Location = require('../models/Location.js');
const SpacePhase = require('../models/SpacePhase.js');
const Software = require('../models/Software.js');
const SoftwarePhase = require('../models/SoftwarePhase.js');
const Server = require('../models/Server.js');
const ServerPhase = require('../models/ServerPhase.js');
const Package = require('../models/Package.js');
const PackagePhase = require('../models/PackagePhase.js');
const License = require('../models/License.js');
const LicensePhase = require('../models/LicensePhase.js');
const Action = require('../models/Action.js');
const ActionType = require('../models/ActionType.js');
const MyApp = require('../models/MyApp.js');
const MyAppPhase = require('../models/MyAppPhase.js');
const Alias = require('../models/Alias.js');
const Audience = require('../models/Audience.js');
const Glossary = require('../models/Glossary.js');
const Tag = require('../models/Tag.js');
const MetadataPhase = require('../models/MetadataPhase.js');
const Meta_Home_FeaturedContent = require('../models/Meta_Home_FeaturedContent.js');
const Meta_Home_FeaturedPosition = require('../models/Meta_Home_FeaturedContentPosition.js');
const User = require('../models/User.js');
const Group = require('../models/Group.js');
const Permission = require('../models/Permission.js');
const PermissionLevel = require('../models/PermissionLevel.js');
const UserPermissionLevel = require('../models/UserPermissionLevel.js');
const UserPreference = require('../models/UserPreference.js');
const FileUpload = require('../models/FileUpload.js');
const StandardHours = require('../models/StandardHours.js');
const SpecialHours = require('../models/SpecialHours.js');
const DayOfWeek = require('../models/DayOfWeek.js');
const UserEditHistory = require('../models/UserEditHistory.js');
const G = require('./_global_logic.js');
const sequelize = require('sequelize');
const moment = require('moment');
const path = require('path');
const { Worker } = require('worker_threads');

module.exports = {
	/**
	 * MIDDLEWARE
	 */
	/**
	 * @description for setting active tab based on route
	 */
	buildConsoleTabs: (req, res, next) => {
		const requestPath = req.originalUrl.split('/').length > 2 ? req.originalUrl.split('/')[2].toLowerCase() : req.originalUrl.split('/')[1].toLowerCase();
		const keys = {
			'console': 'dashboard',
			'my-groups': 'myGroups',
			'history': 'history',
			'site': 'site',
			'subsite': 'subsite',
			'documents-and-images': 'documentsAndImages',
			'users': 'users',
			'groups': 'groups',
			'permissions': 'permissions',
			'article': 'article',
			'glossary': 'glossary',
			'news': 'news',
			'portfolio': 'portfolio',
			'service': 'service',
			'component': 'component',
			'building': 'building',
			'location': 'location',
			'hours': 'hours',
			'software': 'software',
			'package': 'package',
			'server': 'server',
			'license': 'license',
			'io': 'io',
			'conversation': 'conversation',
			'user-forms': 'userForms',
			'audience': 'audience',
			'tag': 'tag',
			'action': 'action',
			'alias': 'alias',
			'preview-links': 'previewLinks',
			'app': 'app',
			'spread': 'spread',
			'request-logs': 'requestLogs',
		};
		const tabs = {
			'dashboard': '',
			'myGroups': '',
			'history': '',
			'site': '',
			'subsite': '',
			'documentsAndImages': '',
			'users': '',
			'groups': '',
			'permissions': '',
			'article': '',
			'glossary': '',
			'news': '',
			'portfolio': '',
			'service': '',
			'component': '',
			'building': '',
			'location': '',
			'hours': '',
			'software': '',
			'package': '',
			'server': '',
			'license': '',
			'io': '',
			'conversation': '',
			'userForms': '',
			'audience': '',
			'tag': '',
			'action': '',
			'alias': '',
			'previewLinks': '',
			'app': '',
			'spread': '',
			'requestLogs': ''
		};
		tabs[keys[requestPath]] = 'active';
		res.locals.consoleTabs = tabs;
		return next();
	},
	/**
	 * VIEWS
	 */
	dashboard: (req, res, next) => {
		const countPromises = [Article.count(), News.count(), Software.count(), Portfolio.count(), Service.count(), Component.count(), Building.count(), Location.count()];
		Promise.all(countPromises).then(counts => {
			const whereDateReviewBy = {
				where: {
					dateReviewBy: {
						[sequelize.Op.lte]: moment().format()
					}
				}
			};
			const reviewCountPromises = [Article.count(whereDateReviewBy), Software.count(whereDateReviewBy), Portfolio.count(whereDateReviewBy), Service.count(whereDateReviewBy), Component.count(whereDateReviewBy), Location.count(whereDateReviewBy), Building.count(whereDateReviewBy)];
			Promise.all(reviewCountPromises).then(async reviewCounts => {
				// users log in
				const usersLoggedInLast7Days = await User.count(
					{
						where: {
							updatedAt: {
								[sequelize.Op.gte]: moment().subtract(7, 'days').format()
							}
						}
					}
				);
				const usersLoggedInLast30Days = await User.count(
					{
						where: {
							updatedAt: {
								[sequelize.Op.lte]: moment().subtract(7, 'days').format(),
								[sequelize.Op.gte]: moment().subtract(30, 'days').format()
							}
						}
					}
				);
				const usersLoggedInLast6Months = await User.count(
					{
						where: {
							updatedAt: {
								[sequelize.Op.lte]: moment().subtract(30, 'days').format(),
								[sequelize.Op.gte]: moment().subtract(6, 'months').format()
							}
						}
					}
				);
				const totalUsers = await User.count(
					{
						where: {
							updatedAt: {
								[sequelize.Op.lte]: moment().subtract(6, 'months').format()
							}
						}
					}
				);
				// preferences
				const lightUsers = await UserPreference.count(
					{
						where: {
							themePreference: 'light'
						}
					}
				);
				const darkUsers = await UserPreference.count(
					{
						where: {
							themePreference: 'night'
						}
					}
				);
				const highUsers = await UserPreference.count(
					{
						where: {
							themePreference: 'highContrast'
						}
					}
				);
				const wpiThemeUsers = await UserPreference.count(
					{
						where: {
							themePreference: 'wpiTheme'
						}
					}
				);
				const holidayUsers = await UserPreference.count(
					{
						where: {
							themePreference: 'holiday'
						}
					}
				);
				const shrekUsers = await UserPreference.count(
					{
						where: {
							themePreference: 'shrek'
						}
					}
				);
				const prideUsers = await UserPreference.count(
					{
						where: {
							themePreference: 'pride'
						}
					}
				);
				const noPreferenceUsers = await UserPreference.count(
					{
						where: {
							themePreference: ''
						}
					}
				);
				const installedApps_ = await req.app.get('models').sequelize.query(`SELECT userHasMyApp.idMyApp, myApps.title, count(userHasMyApp.idMyApp) as installCount FROM userHasMyApp
				LEFT JOIN myApps ON myApps.id = userHasMyApp.idMyApp
				GROUP BY userHasMyApp.idMyApp
				ORDER BY installCount DESC
				LIMIT 5`, sequelize.QueryTypes.SELECT);
				const mostInstalledApps = {};
				for (const app_ of installedApps_[0]) {
					mostInstalledApps[app_.title] = app_.installCount;
				}
				res.render('console/dashboard.ejs',
					{
						counts: {
							'Articles': counts[0],
							'News Posts': counts[1],
							'Software': counts[2],
							'Portfolios': counts[3],
							'Services': counts[4],
							'Components': counts[5],
							'Buildings': counts[6],
							'Locations': counts[7]
						},
						reviewCounts: {
							'Articles': reviewCounts[0],
							'Software': reviewCounts[1],
							'Portfolios': reviewCounts[2],
							'Services': reviewCounts[3],
							'Components': reviewCounts[4],
							'Locations': reviewCounts[5],
							'Buildings': reviewCounts[6]
						},
						usersLoggingIn: {
							'Last 7 Days': usersLoggedInLast7Days,
							'Last 30 Days': usersLoggedInLast30Days,
							'Last 6 Months': usersLoggedInLast6Months,
							'All Time': totalUsers
						},
						themePreferences: {
							'Light': lightUsers,
							'Dark': darkUsers,
							'High Contrast': highUsers,
							'WPI Theme' : wpiThemeUsers,
							'Holiday' : holidayUsers,
							'Shrek' : shrekUsers,
							'Pride' : prideUsers,
							'No Preference': noPreferenceUsers + 1 // admin user isn't counted here
						},
						mostInstalledApps
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
	},
	myGroups: (req, res, next) => {
		res.render('console/my-groups.ejs');
		return null;
	},
	history: (req, res, next) => {
		res.render('console/history.ejs');
		return null;
	},
	site: (req, res, next) => {
		const metaPromises = [];
		metaPromises.push(
			Meta_Home_FeaturedContent.findAll(
				{
					where: {
						isPublished: true,
						isArchived: false
					},
					include: [
						{
							model: FileUpload
						}
					],
					order: [
						['order', 'ASC']
					]
				}
			)
		);
		metaPromises.push(
			Meta_Home_FeaturedContent.findAll(
				{
					where: {
						isPublished: false,
						isArchived: false
					},
					include: [
						{
							model: FileUpload
						}
					]
				}
			)
		);
		metaPromises.push(
			Meta_Home_FeaturedPosition.findAll()
		);
		Promise.all(metaPromises).then(metas => {
			res.render('console/site.ejs',
				{
					publishedMetas: metas[0],
					unpublishedMetas: metas[1],
					contentPositions: metas[2]
				}
			);
		}).catch(err => {
			next(err);
			return null;
		});
	},
	permissions: (req, res, next) => {
		UserPermissionLevel.findAll(
			{
				include: [
					{
						model: User
					},
					{
						model: Permission
					},
					{
						model: PermissionLevel
					}
				],
				group: 'idUser'
			}
		).then(userPermissionLevels => {
			res.render('console/permissions.ejs',
				{
					userPermissionLevels
				}
			);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	users: (req, res, next) => {
		User.findAll().then(users => {
			res.render('console/users.ejs',
				{
					users
				}
			);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	groups: (req, res, next) => {
		Group.findAll(
			{
				attributes: ['id', 'title'],
				include: [
					{
						model: User,
						attributes: ['id']
					}
				]
			}
		).then(groups => {
			res.render('console/groups.ejs',
				{
					groups
				}
			);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	hours: (req, res, next) => {
		const hoursPromises = [];
		hoursPromises.push(
			StandardHours.findAll(
				{
					include: [
						{
							model: DayOfWeek
						},
						{
							model: Location,
							required: true,
							where: {
								hasHours: true,
								isArchived: false
							},
							include: [
								{
									model: SpacePhase,
									required: true,
									where: {
										title: 'publish'
									}
								}
							]
						}
					]
				}
			)
		);

		hoursPromises.push(
			SpecialHours.findAll(
				{
					where: {
						date: {
							[sequelize.Op.gt]: moment().subtract(7, 'days').format()
						}
					},
					include: [
						{
							model: Location,
							required: true,
							where: {
								hasHours: true,
								isArchived: false
							},
							include: [
								{
									model: SpacePhase,
									required: true,
									where: {
										title: 'publish'
									}
								}
							]
						}
					]
				}
			)
		);

		hoursPromises.push(
			Location.findAll(
				{
					where: {
						hasHours: true,
						isArchived: false
					},
					include: [
						{
							model: SpacePhase,
							required: true,
							where: {
								title: 'publish'
							}
						}
					]
				}
			)
		);

		hoursPromises.push(DayOfWeek.findAll(
			{
				order: [
					['order', 'asc']
				]
			}
		));

		Promise.all(hoursPromises).then(values => {
			res.render('console/hours.ejs',
				{
					standardHours: values[0],
					specialHours: values[1],
					locations: values[2],
					daysOfWeek: values[3]
				}
			);
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	entityTable: async(req, res, next) => {
		let type, typePlural, avsan;
		let canCopy = false;
		const entity = req.url.split('/')[2];
		let entityRenamed = null; // for app -> myapp in G.checkPermissions and s -> subsite
		switch (entity) {
			case 'subsite':
				type = 'subsite';
				typePlural = 'subsites';
				avsan = ' a';
				break;
			case 'article':
				type = 'article';
				typePlural = 'articles';
				avsan = ' an';
				break;
			case 'news':
				type = 'news';
				typePlural = 'news';
				avsan = '';
				res.locals.sortOrder = 'desc';
				canCopy = true;
				break;
			case 'portfolio':
				type = 'portfolio';
				typePlural = 'portolios';
				avsan = ' a';
				break;
			case 'service':
				type = 'service';
				typePlural = 'services';
				avsan = ' a';
				break;
			case 'component':
				type = 'component';
				typePlural = 'components';
				avsan = ' a';
				break;
			case 'building':
				type = 'building';
				typePlural = 'buildings';
				avsan = ' a';
				break;
			case 'location':
				type = 'location';
				typePlural = 'locations';
				avsan = ' a';
				break;
			case 'software':
				type = 'software';
				typePlural = 'software';
				avsan = '';
				canCopy = true;
				break;
			case 'server':
				type = 'server';
				typePlural = 'servers';
				avsan = ' a';
				break;
			case 'package':
				type = 'package';
				typePlural = 'packages';
				avsan = ' a';
				break;
			case 'license':
				type = 'license';
				typePlural = 'licenses';
				avsan = ' a';
				break;
			case 'app':
				type = 'app';
				typePlural = 'apps';
				avsan = ' an';
				entityRenamed = 'myapp';
				break;
			case 'spread':
				type = 'spread';
				typePlural = 'spreads';
				avsan = ' a';
				canCopy = true;
				break;
			default:
				next(404);
				return null;
		}
		res.render('console/entity-table.ejs',
			{
				type,
				typePlural,
				avsan,
				canCopy,
				canCreate: await G.checkPermissions(
					{
						req,
						entity: entityRenamed || entity,
						level: 'create'
					}
				)
			}
		);
		return null;
	},
	getEntityTableData: async(req, res, next) => {
		let phaseModel, model;
		const entity = req.params.entity;
		let entityRenamed = null; // for app -> myapp in G.checkPermissions
		switch (entity) {
			case 'article':
				model = Article;
				phaseModel = ArticlePhase;
				break;
			case 'subsite':
				model = SubSite;
				phaseModel = SubSitePhase;
				break;
			case 'news':
				model = News;
				phaseModel = NewsPhase;
				break;
			case 'portfolio':
				model = Portfolio;
				phaseModel = CatalogPhase;
				break;
			case 'service':
				model = Service;
				phaseModel = CatalogPhase;
				break;
			case 'component':
				model = Component;
				phaseModel = CatalogPhase;
				break;
			case 'building':
				model = Building;
				phaseModel = SpacePhase;
				break;
			case 'location':
				model = Location;
				phaseModel = SpacePhase;
				break;
			case 'software':
				model = Software;
				phaseModel = SoftwarePhase;
				break;
			case 'server':
				model = Server;
				phaseModel = ServerPhase;
				break;
			case 'package':
				model = Package;
				phaseModel = PackagePhase;
				break;
			case 'license':
				model = License;
				phaseModel = LicensePhase;
				break;
			case 'app':
				model = MyApp;
				phaseModel = MyAppPhase;
				entityRenamed = 'myapp';
				break;
			case 'spread':
				model = Spread;
				phaseModel = SpreadPhase;
				break;
			default:
				next(404);
				return null;
		}
		if (!(await G.checkPermissions(
			{
				req,
				entity: entityRenamed || entity,
				level: 'read'
			}
		))) {
			next(403);
			return null;
		}
		const consolePromises = [];
		phaseModel.findAll().then(phases => {
			for (const phase of phases) {
				consolePromises.push(
					model.findAndCountAll(
						{
							where: {
								isArchived: false
							},
							include: [
								{
									model: phaseModel,
									where: {
										title: phase.title
									}
								}
							]
						}
					)
				);
			}
			return Promise.all(consolePromises).then(async itemsGroupedByPhase => {
				const phasesWithRelatedItemsPromises = [];
				for (const phaseIndex in itemsGroupedByPhase) {
					phasesWithRelatedItemsPromises.push(
						new Promise((resolve, reject) => {
							// create workers here (this would give us one for each phase)
							// we need to clone the important properties of the request object we need so that we can send it through to the worker thread
							const req_ = {
								user: req.user,
								isAuthenticated: req.isAuthenticated()
							};
							const workerData = {
								req: req_,
								entity: entityRenamed || entity,
								phases: phases.map(p => p.toJSON()),
								rows: itemsGroupedByPhase[phaseIndex].rows.map(r => r.toJSON()),
								phase: phases[phaseIndex].toJSON(),
								count: itemsGroupedByPhase[phaseIndex].count
							};
							const worker = new Worker(path.join(__dirname, 'workers/console-entity-table-data-getter/index.js'), { workerData });

							worker.on('message', data => {
								resolve(data);
								return null;
							});

							worker.on('error', err => {
								reject(err);
								return null;
							});

						})
					);
				}

				return Promise.all(phasesWithRelatedItemsPromises).then(phasesWithRelatedItems => {
					const data = [].concat(...phasesWithRelatedItems.map(phaseWithRelatedItems => {
						return phaseWithRelatedItems.items.map(item => {
							return {
								...item,
								phase: {
									title: phaseWithRelatedItems.phase.title,
									color: phaseWithRelatedItems.phase.color
								}
							};
						});
					}));

					const phases = phasesWithRelatedItems.map(phaseWithRelatedItems => {
						const { phase, count } = phaseWithRelatedItems;
						return { phase, count };
					}).reduce((acc, item) => {
						return {
							...acc,
							[item.phase.title]: item.count
						};
					}, {});

					res.json(
						{
							data,
							phases
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
	getHistoryTableData: async(req, res, next) => {
		UserEditHistory.findByUserId(req.user.id).then(async userEditHistories => {
			const data = [];
			for (const userEditHistory of userEditHistories) {
				const canView = await G.checkPermissions({ req, entity: userEditHistory.entity, level: 'read', entityID: userEditHistory.entityID });
				const canEdit = await G.checkPermissions({ req, entity: userEditHistory.entity, level: 'author', entityID: userEditHistory.entityID });
				const specificEntity = await req.app.get('models')[Object.keys(req.app.get('models')).find(modelName => modelName.toLowerCase() === userEditHistory.entity)].findByPk(userEditHistory.entityID);
				data.push(
					{
						id: userEditHistory.entityID,
						updatedAt: userEditHistory.updatedAt,
						entity: userEditHistory.entity,
						title: specificEntity.title,
						permissions: {
							canView,
							canEdit
						}
					}
				);
			}
			res.json({data});
			return null;
		}).catch(err => {
			next(err);
			return null;
		});
	},
	modalTable: async(req, res, next) => {
		let type, typePlural, avsan, ajaxSource;
		let data = {
			phases: await MetadataPhase.findAll()
		};
		switch (req.url.split('/')[2]) {
			case 'alias':
				type = 'alias';
				typePlural = 'aliases';
				avsan = ' an';
				ajaxSource = '/api/v1/console/alias/table-data/get';
				break;
			case 'audience':
				type = 'audience';
				typePlural = 'audiences';
				avsan = ' an';
				ajaxSource = '/api/v1/console/audience/table-data/get';
				break;
			case 'glossary':
				type = 'glossary';
				typePlural = 'glossary';
				avsan = ' a';
				ajaxSource = '/api/v1/console/glossary/table-data/get';
				break;
			case 'tag':
				type = 'tag';
				typePlural = 'tags';
				avsan = ' a';
				ajaxSource = '/api/v1/console/tag/table-data/get';
				break;
			case 'action':
				type = 'action';
				typePlural = 'actions';
				avsan = ' an';
				ajaxSource = '/api/v1/console/action/table-data/get';
				data.types = await ActionType.findAll();
				break;
			default:
				next(404);
				return null;
		}
		res.render('console/modal-table.ejs', {
			type,
			typePlural,
			avsan,
			data,
			ajaxSource
		});
		return null;
	},
	getAliasTableData: (req, res, next) => {
		const consolePromises = [];
		MetadataPhase.findAll().then(phases => {
			for (const phase of phases) {
				consolePromises.push(
					Alias.findAndCountAll(
						{
							where: {
								isArchived: false
							},
							include: [
								{
									model: MetadataPhase,
									where: {
										title: phase.title
									}
								}
							]
						}
					)
				);
			}
			return Promise.all(consolePromises).then(async itemsGroupedByPhase => {
				const data = {
					phasesWithRelatedItems: {},
					canEdit: await G.checkPermissions({req, entity: 'alias', level: 'publish'}),
					canDelete: await G.checkPermissions({req, entity: 'alias', level: 'delete'})
				};
				for (const phaseIndex in phases) {
					data.phasesWithRelatedItems[phases[phaseIndex].title] = {
						phase: phases[phaseIndex],
						items: itemsGroupedByPhase[phaseIndex].rows,
						count: itemsGroupedByPhase[phaseIndex].count
					};
				}
				res.json(data);
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
	getAudienceTableData: (req, res, next) => {
		const consolePromises = [];
		MetadataPhase.findAll().then(phases => {
			for (const phase of phases) {
				consolePromises.push(
					Audience.findAndCountAll(
						{
							where: {
								isArchived: false
							},
							include: [
								{
									model: MetadataPhase,
									where: {
										title: phase.title
									}
								}
							]
						}
					)
				);
			}
			return Promise.all(consolePromises).then(async itemsGroupedByPhase => {
				const data = {
					phasesWithRelatedItems: {},
					canEdit: await G.checkPermissions({req, entity: 'audience', level: 'publish'}),
					canDelete: await G.checkPermissions({req, entity: 'audience', level: 'delete'})
				};
				for (const phaseIndex in phases) {
					data.phasesWithRelatedItems[phases[phaseIndex].title] = {
						phase: phases[phaseIndex],
						items: itemsGroupedByPhase[phaseIndex].rows,
						count: itemsGroupedByPhase[phaseIndex].count
					};
				}
				res.json(data);
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
	getGlossaryTableData: (req, res, next) => {
		const consolePromises = [];
		MetadataPhase.findAll().then(phases => {
			for (const phase of phases) {
				consolePromises.push(
					Glossary.findAndCountAll(
						{
							where: {
								isArchived: false
							},
							include: [
								{
									model: MetadataPhase,
									where: {
										title: phase.title
									}
								}
							]
						}
					)
				);
			}
			return Promise.all(consolePromises).then(async itemsGroupedByPhase => {
				const data = {
					phasesWithRelatedItems: {},
					canEdit: await G.checkPermissions({req, entity: 'glossary', level: 'publish'}),
					canDelete: await G.checkPermissions({req, entity: 'glossary', level: 'delete'})
				};
				for (const phaseIndex in phases) {
					data.phasesWithRelatedItems[phases[phaseIndex].title] = {
						phase: phases[phaseIndex],
						items: itemsGroupedByPhase[phaseIndex].rows,
						count: itemsGroupedByPhase[phaseIndex].count
					};
				}
				res.json(data);
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
	getTagTableData: (req, res, next) => {
		const consolePromises = [];
		MetadataPhase.findAll().then(phases => {
			for (const phase of phases) {
				consolePromises.push(
					Tag.findAndCountAll(
						{
							where: {
								isArchived: false
							},
							include: [
								{
									model: MetadataPhase,
									where: {
										title: phase.title
									}
								}
							]
						}
					)
				);
			}
			return Promise.all(consolePromises).then(async itemsGroupedByPhase => {
				const data = {
					phasesWithRelatedItems: {},
					canEdit: await G.checkPermissions({req, entity: 'tag', level: 'publish'}),
					canDelete: await G.checkPermissions({req, entity: 'tag', level: 'delete'})
				};
				for (const phaseIndex in phases) {
					data.phasesWithRelatedItems[phases[phaseIndex].title] = {
						phase: phases[phaseIndex],
						items: itemsGroupedByPhase[phaseIndex].rows,
						count: itemsGroupedByPhase[phaseIndex].count
					};
				}
				res.json(data);
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
	getActionTableData: (req, res, next) => {
		const consolePromises = [];
		MetadataPhase.findAll().then(phases => {
			for (const phase of phases) {
				consolePromises.push(
					Action.findAndCountAll(
						{
							where: {
								isArchived: false
							},
							include: [
								{
									model: MetadataPhase,
									where: {
										title: phase.title
									}
								}
							]
						}
					)
				);
			}
			return Promise.all(consolePromises).then(async itemsGroupedByPhase => {
				const data = {
					phasesWithRelatedItems: {},
					canEdit: await G.checkPermissions({req, entity: 'action', level: 'publish'}),
					canDelete: await G.checkPermissions({req, entity: 'action', level: 'delete'})
				};
				for (const phaseIndex in phases) {
					data.phasesWithRelatedItems[phases[phaseIndex].title] = {
						phase: phases[phaseIndex],
						items: itemsGroupedByPhase[phaseIndex].rows,
						count: itemsGroupedByPhase[phaseIndex].count
					};
				}
				res.json(data);
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
	renderRequestLogs: (req, res, next) => {
		res.render('console/request-logs.ejs');
		return null;
	}
};