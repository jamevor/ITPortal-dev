'use strict';
const G = require('../server/_global_logic.js');
module.exports = class Service extends require('sequelize').Model {
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
			title: {
				type: DataTypes.STRING(200),
				primaryKey: true
			},
			icon: DataTypes.STRING(30),
			color: DataTypes.STRING(6),
			descriptionShort: DataTypes.STRING(500),
			descriptionLong: DataTypes.STRING(5000),
			idCatalogPhase: DataTypes.INTEGER,
			idCatalogStatus: DataTypes.INTEGER,
			availability: DataTypes.STRING(500),
			cost: DataTypes.STRING(500),
			support: DataTypes.STRING(500),
			requirements: DataTypes.STRING(500),
			requesting: DataTypes.STRING(500),
			maintenance: DataTypes.STRING(500),
			benefits: DataTypes.STRING(500),
			ownerService: DataTypes.STRING(60),
			ownerBusiness: DataTypes.STRING(60),
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
		},
		{
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'service',
			tableName: 'service',
			indexes: [
				{
					unique: true,
					fields: ['id', 'title']
				},
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
	static associate(models) {
		this.belongsTo(models.CatalogPhase, {foreignKey: 'idCatalogPhase'});
		this.belongsTo(models.CatalogStatus, {foreignKey: 'idCatalogStatus'});
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
		this.hasMany(models.Component, {foreignKey: 'idService'});
		this.belongsToMany(models.Action, {through: models.ServiceHasAction, foreignKey: 'idService'});
		this.belongsToMany(models.Alias, {through: models.ServiceHasAlias, foreignKey: 'idService'});
		this.belongsToMany(models.Article, {through: models.ServiceHasArticle, foreignKey: 'idService'});
		this.belongsToMany(models.Audience, {through: models.ServiceHasAudience, foreignKey: 'idService'});
		this.belongsToMany(models.News, {through: models.ServiceHasNews, foreignKey: 'idService'});
		this.belongsToMany(models.Software, {through: models.ServiceHasSoftware, foreignKey: 'idService'});
		this.belongsToMany(models.Tag, {through: models.ServiceHasTag, foreignKey: 'idService'});
		this.belongsToMany(models.Portfolio, {through: models.PortfolioHasService, foreignKey: 'idService'});
		this.belongsToMany(models.Group, { through: models.ServiceHasGroup, foreignKey: 'idService' });
	}

	getURL() {
		return `/service/${this.id}/${this.title.toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/ +/g, '-')}`;
	}

	getPhaseTitle() {
		return this.catalogPhase.title;
	}

	isAccessRestricted() {
		return this.accessRestricted;
	}

	/**
	 * @author Ryan LaMarche
	 * @param {Number} id the id.
	 * @param {Boolean} enforcePublished whether or not to enforce published phases for model.
	 * @param {Boolean} enforcePublishedAssociations whether or not to enforce published phases for model associations.
	 * @return {Promise} that should resolve with mdoel and all attributes / relations.
	 */
	static findById(id, enforcePublished = false, enforcePublishedAssociations) {
		const CatalogPhase = require('./CatalogPhase.js');
		const MetadataPhase = require('./MetadataPhase.js');
		const CatalogStatus = require('./CatalogStatus.js');
		const Component = require('./Component.js');
		const Action = require('./Action.js');
		const ActionType = require('./ActionType.js');
		const Alias = require('./Alias.js');
		const Article = require('./Article.js');
		const ArticlePhase = require('./ArticlePhase.js');
		const Audience = require('./Audience.js');
		const News = require('./News.js');
		const NewsPhase = require('./NewsPhase.js');
		const Software = require('./Software.js');
		const SoftwarePhase = require('./SoftwarePhase.js');
		const Tag = require('./Tag.js');
		const Portfolio = require('./Portfolio.js');
		const User = require('./User.js');

		enforcePublishedAssociations = typeof enforcePublishedAssociations !== 'undefined' ? enforcePublishedAssociations : enforcePublished;

		const enforcePublished_ = enforcePublished ? {title: 'publish'} : {};
		const enforcePublishedAssociations_ = enforcePublishedAssociations ? {title: 'publish'} : {};

		return Service.findByPk(id,
			{
				include: [
					{
						model: CatalogPhase,
						where: enforcePublished_
					},
					{
						model: CatalogStatus
					},
					{
						model: Component,
						include: [
							{
								model: CatalogPhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: Action,
						include: [
							{
								model: ActionType
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
						model: News,
						include: [
							{
								model: NewsPhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: Software,
						include: [
							{
								model: SoftwarePhase,
								where: enforcePublishedAssociations_
							}
						]
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
						model: Portfolio,
						include: [
							{
								model: CatalogPhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: User,
						as: 'userCreatedBy'
					},
					{
						model: User,
						as: 'userModifiedBy'
					}
				]
			}
		);
	}
};