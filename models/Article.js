'use strict';
const G = require('../server/_global_logic.js');
module.exports = class Article extends require('sequelize').Model {
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
			idArticlePhase: DataTypes.INTEGER,
			requireAuth: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			isArchived: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			title: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			descriptionShort: DataTypes.STRING(500),
			content: DataTypes.TEXT,
			idCherwell: DataTypes.INTEGER,
			dateReviewBy: {
				type: DataTypes.DATE,
				defaultValue: G.defaultDateReviewByFunction
			},
			timing: DataTypes.STRING(30),
			difficulty: DataTypes.INTEGER,
			contentAlt: DataTypes.TEXT,
			contentInternal: DataTypes.TEXT,
			createdBy: DataTypes.INTEGER,
			modifiedBy: DataTypes.INTEGER,
			useLegacy: DataTypes.BOOLEAN,
			contentLegacy: DataTypes.TEXT,
			contentAltLegacy: DataTypes.TEXT,
			contentInternalLegacy: DataTypes.TEXT,
			idImage: DataTypes.INTEGER,
			accessRestricted: DataTypes.BOOLEAN,
			displayMode: {
				type: DataTypes.STRING(50),
				values: ['inline', 'collapse', 'slide']
			}
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'article',
			tableName: 'article',
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
		this.belongsToMany(models.Action, { through: models.ArticleHasAction, foreignKey: 'idArticle' });
		this.belongsToMany(models.MyApp, { through: models.ArticleHasMyApp, foreignKey: 'idArticle' });
		this.belongsTo(models.ArticlePhase, { foreignKey: 'idArticlePhase' });
		this.belongsToMany(models.Audience, { through: models.ArticleHasAudience, foreignKey: 'idArticle' });
		this.belongsToMany(models.Tag, { through: models.ArticleHasTag, foreignKey: 'idArticle' });
		this.belongsToMany(models.Component, { through: models.ComponentHasArticle, foreignKey: 'idArticle' });
		this.belongsToMany(models.Service, { through: models.ServiceHasArticle, foreignKey: 'idArticle' });
		this.belongsToMany(models.Software, { through: models.SoftwareHasArticle, foreignKey: 'idArticle' });
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
		this.belongsTo(models.FileUpload, { as: 'image', foreignKey: 'idImage'});
		this.belongsToMany(models.Group, { through: models.ArticleHasGroup, foreignKey: 'idArticle' });
		this.belongsToMany(models.Location, { through: models.LocationHasArticle, foreignKey: 'idArticle' });
		this.belongsToMany(models.Article, { through: models.ArticleHasArticle, as: 'siblingArticles', foreignKey: 'idArticleParent' });
		this.belongsToMany(models.Article, { through: models.ArticleHasArticle, as: 'parentArticles', foreignKey: 'idArticleSibling' });
		this.belongsToMany(models.News, { through: models.NewsHasArticle, foreignKey: 'idArticle' });
		this.hasMany(models.ArticleContent, { foreignKey: 'idArticle' });
	}

	/**
	 * @author Ryan LaMarche
	 * @param {Number} id the id.
	 * @param {Boolean} enforcePublished whether or not to enforce published phases for model.
	 * @param {Boolean} enforcePublishedAssociations whether or not to enforce published phases for model associations.
	 * @return {Promise} that should resolve with mdoel and all attributes / relations.
	 */
	static findById(id, enforcePublished = false, enforcePublishedAssociations) {
		const ArticlePhase = require('./ArticlePhase.js');
		const ArticleContent = require('./ArticleContent.js');
		const Action = require('./Action.js');
		const MetadataPhase = require('./MetadataPhase.js');
		const ActionType = require('./ActionType.js');
		const Audience = require('./Audience.js');
		const Tag = require('./Tag.js');
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

		return Article.findByPk(id,
			{
				include: [
					{
						model: ArticlePhase,
						where: enforcePublished_
					},
					{
						model: ArticleContent
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
						as: 'siblingArticles',
						required: false,
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
					[{ model: Action }, 'title'],
					[{ model: Tag }, 'title'],
					[{ model: Audience }, 'title'],
					[{ model: ArticleContent }, 'order'],
				]
			}
		);
	}

	getURL() {
		return `/article/${this.id}/${this.title.toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/ +/g, '-')}`;
	}

	isPublished() {
		return this.articlePhase && this.articlePhase.title && this.articlePhase.title.toLowerCase() === 'publish';
	}

	getPhaseTitle() {
		return this.articlePhase.title;
	}

	isAccessRestricted() {
		return this.accessRestricted;
	}
};