'use strict';
module.exports = class News extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				guid: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4
				},
				idNewsType: DataTypes.INTEGER,
				idNewsPhase: DataTypes.INTEGER,
				idNewsStatus: DataTypes.INTEGER,
				title: {
					type: DataTypes.STRING(200),
					allowNull: false
				},
				descriptionShort: DataTypes.STRING(500),
				why: DataTypes.STRING(500),
				impact: DataTypes.STRING(500),
				benefits: DataTypes.STRING(500),
				actionDescription: DataTypes.STRING(500),
				details: DataTypes.STRING(5000),
				dateStart: DataTypes.DATE,
				dateEnd: DataTypes.DATE,
				datePost: DataTypes.DATE,
				showAlert: DataTypes.BOOLEAN,
				isWPIToday: DataTypes.BOOLEAN,
				isPinned: DataTypes.BOOLEAN,
				isHome: DataTypes.BOOLEAN,
				createdBy: DataTypes.INTEGER,
				modifiedBy: DataTypes.INTEGER,
				idImage: DataTypes.INTEGER,
				isArchived: {
					type: DataTypes.BOOLEAN,
					defaultValue: false
				},
				accessRestricted: DataTypes.BOOLEAN
			},
			{
				sequelize,
				timestamps: true,
				freezeTableName: true,
				modelName: 'news',
				tableName: 'news',
				indexes: [
					{
						unique: true,
						fields: ['guid']
					}
				]
			}
		);
	}
	static associate(models) {
		this.belongsTo(models.NewsType, {foreignKey: 'idNewsType'});
		this.belongsTo(models.NewsPhase, {foreignKey: 'idNewsPhase'});
		this.belongsTo(models.NewsStatus, {foreignKey: 'idNewsStatus'});
		this.hasMany(models.NewsSub, {foreignKey: 'idNews'});
		this.belongsToMany(models.Action, {through: models.NewsHasAction, foreignKey: 'idNews'});
		this.belongsToMany(models.MyApp, { through: models.NewsHasMyApp, foreignKey: 'idNews' });
		this.belongsToMany(models.Audience, {through: models.NewsHasAudience, foreignKey: 'idNews'});
		this.belongsToMany(models.Tag, {through: models.NewsHasTag, foreignKey: 'idNews'});
		this.belongsToMany(models.Component, { through: models.ComponentHasNews, foreignKey: 'idNews' });
		this.belongsToMany(models.Service, { through: models.ServiceHasNews, foreignKey: 'idNews' });
		this.belongsToMany(models.Software, { through: models.SoftwareHasNews, foreignKey: 'idNews' });
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
		this.belongsTo(models.FileUpload, { as: 'image', foreignKey: 'idImage'});
		this.belongsToMany(models.Group, { through: models.NewsHasGroup, foreignKey: 'idNews' });
		this.belongsToMany(models.Article, { through: models.NewsHasArticle, foreignKey: 'idNews' });
	}

	getURL() {
		return `/news/${this.id}/${this.title.toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/ +/g, '-')}`;
	}

	/**
	 * @author Ryan LaMarche
	 * @param {Number} id the id.
	 * @param {Boolean} enforcePublished whether or not to enforce published phases for model.
	 * @param {Boolean} enforcePublishedAssociations whether or not to enforce published phases for model associations.
	 * @return {Promise} that should resolve with mdoel and all attributes / relations.
	 */
	static findById(id, enforcePublished = false, enforcePublishedAssociations) {
		const Article = require('./Article.js');
		const ArticlePhase = require('./ArticlePhase.js');
		const Action = require('./Action.js');
		const ActionType = require('./ActionType.js');
		const Audience = require('./Audience.js');
		const Tag = require('./Tag.js');
		const MetadataPhase = require('./MetadataPhase.js');
		const NewsPhase = require('./NewsPhase.js');
		const NewsStatus = require('./NewsStatus.js');
		const NewsType = require('./NewsType.js');
		const NewsSub = require('./NewsSub.js');
		const NewsSubType = require('./NewsSubType.js');
		const Component = require('./Component.js');
		const Service = require('./Service.js');
		const CatalogPhase = require('./CatalogPhase.js');
		const Software = require('./Software.js');
		const SoftwarePhase = require('./SoftwarePhase.js');
		const User = require('./User.js');
		const FileUpload = require('./FileUpload.js');

		enforcePublishedAssociations = typeof enforcePublishedAssociations !== 'undefined' ? enforcePublishedAssociations : enforcePublished;

		const enforcePublished_ = enforcePublished ? {title: 'publish'} : {};
		const enforcePublishedAssociations_ = enforcePublishedAssociations ? {title: 'publish'} : {};

		return News.findByPk(id,
			{
				include: [
					{
						model: NewsPhase,
						where: enforcePublished_
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
						model: Audience,
						include: [
							{
								model: MetadataPhase,
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
						model: NewsStatus
					},
					{
						model: NewsType
					},
					{
						model: NewsSub,
						include: [
							{
								model: NewsSubType
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
							}
						]
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
						model: Service,
						include: [
							{
								model: CatalogPhase,
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
						model: Article,
						include: [
							{
								model: ArticlePhase,
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
					},
					{
						model: FileUpload,
						as: 'image'
					}
				],
				order: [
					[ NewsSub, 'datePost', 'desc']
				]
			}
		);
	}

	getPhaseTitle() {
		return this.newsPhase.title;
	}

	isAccessRestricted() {
		return this.accessRestricted;
	}

};

