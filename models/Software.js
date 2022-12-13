'use strict';
const G = require('../server/_global_logic.js');
module.exports = class Software extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
			idSoftwarePhase: DataTypes.INTEGER,
			isAvailable: DataTypes.BOOLEAN,
			title: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			version: DataTypes.STRING(200),
			supported: DataTypes.BOOLEAN,
			releaseYear: DataTypes.INTEGER,
			publisher: DataTypes.STRING(60),
			publisherShort: DataTypes.STRING(200), // TODO
			ownerSoftware: DataTypes.STRING(60),
			ownerBusiness: DataTypes.STRING(60),
			isLicensed: DataTypes.BOOLEAN,
			isCLA: DataTypes.BOOLEAN,
			isSCCM: DataTypes.BOOLEAN,
			useWPI: DataTypes.BOOLEAN,
			usePersonal: DataTypes.BOOLEAN,
			researchLicense: DataTypes.BOOLEAN,
			availablePublicLabs: DataTypes.BOOLEAN,
			availableTerminalServer: DataTypes.BOOLEAN,
			availableVDI: DataTypes.BOOLEAN,
			availableSplashtop: DataTypes.BOOLEAN,
			usaOnly: DataTypes.BOOLEAN,
			installWho: DataTypes.STRING(500),
			requirements: DataTypes.STRING(500),
			dependencies: DataTypes.STRING(500),
			requesting: DataTypes.STRING(500),
			installPointAdmin: DataTypes.STRING(200),
			installPointPublic: DataTypes.STRING(200),
			descriptionShort: DataTypes.STRING(500),
			descriptionLong: DataTypes.STRING(5000),
			dateReviewBy: {
				type: DataTypes.DATE,
				defaultValue: G.defaultDateReviewByFunction
			},
			createdBy: DataTypes.INTEGER,
			modifiedBy: DataTypes.INTEGER,
			isArchived: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			accessRestricted: DataTypes.BOOLEAN
		}, {
			sequelize,
			freezeTableName: true,
			timestamps: true,
			modelName: 'software',
			tableName: 'software',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
	static associate(models) {
		this.belongsTo(models.SoftwarePhase, {foreignKey: 'idSoftwarePhase'});
		this.belongsToMany(models.Action, {through: models.SoftwareHasAction, foreignKey: 'idSoftware'});
		this.belongsToMany(models.Alias, {through: models.SoftwareHasAlias, foreignKey: 'idSoftware'});
		this.belongsToMany(models.Article, {through: models.SoftwareHasArticle, foreignKey: 'idSoftware'});
		this.belongsToMany(models.Audience, {through: models.SoftwareHasAudience, foreignKey: 'idSoftware'});
		this.belongsToMany(models.License, {through: models.SoftwareHasLicense, foreignKey: 'idSoftware'});
		this.belongsToMany(models.Location, {through: models.SoftwareHasLocation, foreignKey: 'idSoftware'});
		this.belongsToMany(models.News, {through: models.SoftwareHasNews, foreignKey: 'idSoftware'});
		this.belongsToMany(models.Server, {through: models.SoftwareHasServer, foreignKey: 'idSoftware'});
		this.belongsToMany(models.SoftwareOS, {through: models.SoftwareHasSoftwareOS, foreignKey: 'idSoftware'});
		this.belongsToMany(models.Tag, {through: models.SoftwareHasTag, foreignKey: 'idSoftware'});
		this.belongsToMany(models.SoftwareType, {through: models.SoftwareHasType, foreignKey: 'idSoftware'});
		this.belongsToMany(models.Component, { through: models.ComponentHasSoftware, foreignKey: 'idSoftware' });
		this.belongsToMany(models.Package, {through: models.PackageHasSoftware, foreignKey: 'idSoftware'});
		this.belongsToMany(models.Service, {through: models.ServiceHasSoftware, foreignKey: 'idSoftware'});
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
		this.belongsToMany(models.Group, { through: models.SoftwareHasGroup, foreignKey: 'idSoftware' });
	}

	/**
	 * @author Ryan LaMarche
	 * @param {Number} id the id.
	 * @param {Boolean} enforcePublished whether or not to enforce published phases for model.
	 * @param {Boolean} enforcePublishedAssociations whether or not to enforce published phases for model associations.
	 * @return {Promise<Software>} that should resolve with mdoel and all attributes / relations.
	 */
	static findById(id, enforcePublished = false, enforcePublishedAssociations) {
		const SoftwarePhase = require('../models/SoftwarePhase.js');
		const Action = require('../models/Action.js');
		const ActionType = require('../models/ActionType.js');
		const Alias = require('../models/Alias.js');
		const Article = require('../models/Article.js');
		const ArticlePhase = require('../models/ArticlePhase.js');
		const Audience = require('../models/Audience.js');
		const License = require('../models/License.js');
		const Location = require('../models/Location.js');
		const LocationType = require('../models/LocationType.js');
		const News = require('../models/News.js');
		const NewsPhase = require('../models/NewsPhase.js');
		const Server = require('../models/Server.js');
		const ServerPhase = require('../models/ServerPhase.js');
		const SoftwareOS = require('../models/SoftwareOS.js');
		const Tag = require('../models/Tag.js');
		const SoftwareType = require('../models/SoftwareType.js');
		const Building = require('../models/Building.js');
		const Package = require('../models/Package.js');
		const PackagePhase = require('../models/PackagePhase.js');
		const MetadataPhase = require('../models/MetadataPhase.js');
		const LicensePhase = require('../models/LicensePhase.js');
		const SpacePhase = require('../models/SpacePhase.js');
		const User = require('./User.js');

		enforcePublishedAssociations = typeof enforcePublishedAssociations !== 'undefined' ? enforcePublishedAssociations : enforcePublished;

		const enforcePublished_ = enforcePublished ? {title: 'publish'} : {};
		const enforcePublishedAssociations_ = enforcePublishedAssociations ? {title: 'publish'} : {};


		return Software.findByPk(id,
			{
				include: [
					{
						model: SoftwarePhase,
						where: enforcePublished_
					},
					{
						model: Action,
						include: [
							{
								model: ActionType,
							},
							{
								model: MetadataPhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: Alias,
						include: [
							{
								model: MetadataPhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: Article,
						required: false,
						include: [
							{
								model: ArticlePhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: Audience,
						include: [
							{
								model: MetadataPhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: License,
						include: [
							{
								model: LicensePhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: Location,
						include: [
							{
								model: SpacePhase,
								where: enforcePublishedAssociations_
							},
							{
								model: Building,
								include: [
									{
										model: SpacePhase,
										where: enforcePublishedAssociations_
									}
								]
							},
							{
								model: LocationType
							}
						]
					},
					{
						model: News,
						include: [
							{
								model: NewsPhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: Server,
						include: [
							{
								model: ServerPhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: SoftwareOS,
					},
					{
						model: Tag,
						include: [
							{
								model: MetadataPhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: SoftwareType,
					},
					{
						model: Package,
						include: [
							{
								model: PackagePhase,
								where: enforcePublishedAssociations_
							},
							{
								model: Location,
								include: [
									{
										model: SpacePhase,
										where: enforcePublishedAssociations_
									},
									{
										model: Building,
										include: [
											{
												model: SpacePhase,
												required: true,
												where: enforcePublishedAssociations_
											}
										]
									},
									{
										model: LocationType
									}
								]
							},
							{
								model: Server,
								include: [
									{
										model: ServerPhase,
										where: enforcePublishedAssociations_
									}
								]
							}
						],
					},
					{
						model: User,
						as: 'userCreatedBy'
					},
					{
						model: User,
						as: 'userModifiedBy'
					},
				]
			}
		);
		
	}
	static findByIdFast(id, enforcePublished = false, enforcePublishedAssociations) {
		const SoftwarePhase = require('../models/SoftwarePhase.js');
		const Action = require('../models/Action.js');
		const ActionType = require('../models/ActionType.js');
		const Alias = require('../models/Alias.js');
		const Audience = require('../models/Audience.js');
		const License = require('../models/License.js');
		const SoftwareOS = require('../models/SoftwareOS.js');
		const Tag = require('../models/Tag.js');
		const SoftwareType = require('../models/SoftwareType.js');
		const MetadataPhase = require('../models/MetadataPhase.js');
		const LicensePhase = require('../models/LicensePhase.js');
		const User = require('./User.js');

		enforcePublishedAssociations = typeof enforcePublishedAssociations !== 'undefined' ? enforcePublishedAssociations : enforcePublished;

		const enforcePublished_ = enforcePublished ? {title: 'publish'} : {};
		const enforcePublishedAssociations_ = enforcePublishedAssociations ? {title: 'publish'} : {};


		return Software.findByPk(id,
			{
				include: [
					{
						model: SoftwarePhase,
						where: enforcePublished_
					},
					{
						model: Action,
						include: [
							{
								model: ActionType,
							},
							{
								model: MetadataPhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: Alias,
						include: [
							{
								model: MetadataPhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: Audience,
						include: [
							{
								model: MetadataPhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: License,
						include: [
							{
								model: LicensePhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: SoftwareOS,
					},
					{
						model: Tag,
						include: [
							{
								model: MetadataPhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: SoftwareType,
					},
					{
						model: User,
						as: 'userCreatedBy'
					},
					{
						model: User,
						as: 'userModifiedBy'
					},
				]
			}
		);
		
	}
	static findByIdRelatedArticles(id, enforcePublished = false, enforcePublishedAssociations) {
		const Article = require('../models/Article.js');
		const ArticlePhase = require('../models/ArticlePhase.js');
		enforcePublishedAssociations = typeof enforcePublishedAssociations !== 'undefined' ? enforcePublishedAssociations : enforcePublished;

		const enforcePublished_ = enforcePublished ? {title: 'publish'} : {};
		const enforcePublishedAssociations_ = enforcePublishedAssociations ? {title: 'publish'} : {};
		return Software.findByPk(id,
			{
				include: [
					{
						model: Article,
						required: false,
						include: [
							{
								model: ArticlePhase,
								where: enforcePublishedAssociations_
							}
						]
					}
				]
			}
		)
	}

	static findByIdRelatedLocations(id, enforcePublished = false, enforcePublishedAssociations) {
		const Location = require('../models/Location.js');
		const LocationType = require('../models/LocationType.js');
		const Building = require('../models/Building.js');
		const SpacePhase = require('../models/SpacePhase.js');
		enforcePublishedAssociations = typeof enforcePublishedAssociations !== 'undefined' ? enforcePublishedAssociations : enforcePublished;

		const enforcePublished_ = enforcePublished ? {title: 'publish'} : {};
		const enforcePublishedAssociations_ = enforcePublishedAssociations ? {title: 'publish'} : {};
		return Software.findByPk(id,
			{
				include: [
					{
						model: Location,
						include: [
							{
								model: SpacePhase,
								where: enforcePublishedAssociations_
							},
							{
								model: Building,
								include: [
									{
										model: SpacePhase,
										where: enforcePublishedAssociations_
									}
								]
							},
							{
								model: LocationType
							}
						]
					}
				]
			}
		)
	}

	static findByIdRelatedNews(id, enforcePublished = false, enforcePublishedAssociations) {
		const News = require('../models/News.js');
		const NewsPhase = require('../models/NewsPhase.js');
		enforcePublishedAssociations = typeof enforcePublishedAssociations !== 'undefined' ? enforcePublishedAssociations : enforcePublished;

		const enforcePublished_ = enforcePublished ? {title: 'publish'} : {};
		const enforcePublishedAssociations_ = enforcePublishedAssociations ? {title: 'publish'} : {};
		return Software.findByPk(id,
			{
				include: [
					{
						model: News,
						include: [
							{
								model: NewsPhase,
								where: enforcePublishedAssociations_
							}
						]
					}
				]
			}
		)
	}
	static findByIdRelatedServers(id, enforcePublished = false, enforcePublishedAssociations) {
		const Server = require('../models/Server.js');
		const ServerPhase = require('../models/ServerPhase.js');

		enforcePublishedAssociations = typeof enforcePublishedAssociations !== 'undefined' ? enforcePublishedAssociations : enforcePublished;

		const enforcePublished_ = enforcePublished ? {title: 'publish'} : {};
		const enforcePublishedAssociations_ = enforcePublishedAssociations ? {title: 'publish'} : {};
		return Software.findByPk(id,
			{
				include: [
					{
						model: Server,
						include: [
							{
								model: ServerPhase,
								where: enforcePublishedAssociations_
							}
						]
					}
				]
			}
		)
	}

	static findByIdRelatedPackage(id, enforcePublished = false, enforcePublishedAssociations) {
		const PackagePhase = require('../models/PackagePhase.js');
		const SpacePhase = require('../models/SpacePhase.js');
		const Building = require('../models/Building.js');
		const Location = require('../models/Location.js');
		const LocationType = require('../models/LocationType.js');
		const Server = require('../models/Server.js');
		const ServerPhase = require('../models/ServerPhase.js');
		const Package = require('../models/Package.js');
		enforcePublishedAssociations = typeof enforcePublishedAssociations !== 'undefined' ? enforcePublishedAssociations : enforcePublished;

		const enforcePublished_ = enforcePublished ? {title: 'publish'} : {};
		const enforcePublishedAssociations_ = enforcePublishedAssociations ? {title: 'publish'} : {};
		return Software.findByPk(id,
			{
				include: [
					{
						model: Package,
						include: [
							{
								model: PackagePhase,
								where: enforcePublishedAssociations_
							},
							{
								model: Location,
								include: [
									{
										model: SpacePhase,
										where: enforcePublishedAssociations_
									},
									{
										model: Building,
										include: [
											{
												model: SpacePhase,
												required: true,
												where: enforcePublishedAssociations_
											}
										]
									},
									{
										model: LocationType
									}
								]
							},
							{
								model: Server,
								include: [
									{
										model: ServerPhase,
										where: enforcePublishedAssociations_
									}
								]
							}
						],
					}
				]
			}
		)
	}


	getURL() {
		return `/software/${this.id}/${this.title.toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/ +/g, '-')}`;
	}

	getPhaseTitle() {
		return this.softwarePhase.title;
	}

	isAccessRestricted() {
		return this.accessRestricted;
	}

};