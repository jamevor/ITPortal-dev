'use strict';
module.exports = class MyApp extends require('sequelize').Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			guid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
			title: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			link: DataTypes.STRING(500),
			descriptionShort: DataTypes.STRING(500),
			target: {
				type: DataTypes.STRING(30),
				defaultValue: '_blank'
			},
			URIscheme: DataTypes.STRING(30),
			idImage: DataTypes.INTEGER,
			color: DataTypes.STRING(6),
			createdBy: DataTypes.INTEGER,
			modifiedBy: DataTypes.INTEGER,
			isArchived: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			idMyAppPhase: DataTypes.INTEGER,
			idMyAppStatus: DataTypes.INTEGER,
			isQuick: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
		{
			sequelize,
			freezeTableName: false,
			timestamps: true,
			modelName: 'myApps',
			tableName: 'myApps',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
	static associate(models) {
		this.belongsTo(models.MyAppPhase, {foreignKey: 'idMyAppPhase'});
		this.belongsTo(models.MyAppStatus, {foreignKey: 'idMyAppStatus'});
		this.belongsToMany(models.Article, { through: models.ArticleHasMyApp, foreignKey: 'idMyApp' });
		this.belongsToMany(models.News, { through: models.NewsHasMyApp, foreignKey: 'idMyApp' });
		this.belongsToMany(models.MyAppGroup, { through: models.MyAppHasMyAppGroup, foreignKey: 'idMyApp' });
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
		this.belongsTo(models.FileUpload, { as: 'image', foreignKey: 'idImage'});
		this.belongsToMany(models.User, { through: models.UserHasMyApp, foreignKey: 'idMyApp' });
	}

	/**
	 * @author Ryan LaMarche
	 * @param {Number} id the id.
	 * @param {Boolean} enforcePublished whether or not to enforce published phases for model.
	 * @param {Boolean} enforcePublishedAssociations whether or not to enforce published phases for model associations.
	 * @return {Promise} that should resolve with mdoel and all attributes / relations.
	 */
	static findById(id, enforcePublished = false, enforcePublishedAssociations) {
		const MyAppPhase = require('../models/MyAppPhase.js');
		const FileUpload = require('../models/FileUpload.js');
		const MyAppStatus = require('../models/MyAppStatus.js');
		const Article = require('../models/Article.js');
		const ArticlePhase = require('../models/ArticlePhase.js');

		enforcePublishedAssociations = typeof enforcePublishedAssociations !== 'undefined' ? enforcePublishedAssociations : enforcePublished;

		const enforcePublished_ = enforcePublished ? {title: 'publish'} : {};
		const enforcePublishedAssociations_ = enforcePublishedAssociations ? {title: 'publish'} : {};


		return MyApp.findByPk(id,
			{
				include: [
					{
						model: MyAppPhase,
						where: enforcePublished_
					},
					{
						model: MyAppStatus
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
						model: FileUpload,
						as: 'image'
					}
				]
			}
		);
	}


	getURL() {
		return `/app/${this.id}/${this.title.toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/ +/g, '-')}`;
	}

	getPhaseTitle() {
		return this.myAppPhase.title;
	}

	isAccessRestricted() {
		return false;
	}

};