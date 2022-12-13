'use strict';
const G = require('../server/_global_logic.js');
module.exports = class Portfolio extends require('sequelize').Model {
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
				allowNull: false
			},
			icon: DataTypes.STRING(30),
			color: DataTypes.STRING(6),
			descriptionShort: DataTypes.STRING(500),
			descriptionLong: DataTypes.STRING(5000),
			idCatalogPhase: DataTypes.INTEGER,
			idCatalogStatus: DataTypes.INTEGER,
			dateReviewBy: {
				type: DataTypes.DATE,
				defaultValie: G.defaultDateReviewByFunction
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
			freezeTableName: false,
			timestamps: true,
			modelName: 'portfolio',
			tableName: 'portfolio',
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
		this.belongsToMany(models.Action, {through: models.PortfolioHasAction, foreignKey: 'idPortfolio'});
		this.belongsToMany(models.Alias, {through: models.PortfolioHasAlias, foreignKey: 'idPortfolio'});
		this.belongsToMany(models.Service, {through: models.PortfolioHasService, foreignKey: 'idPortfolio'});
		this.belongsToMany(models.Tag, {through: models.PortfolioHasTag, foreignKey: 'idPortfolio'});
		this.belongsTo(models.CatalogPhase, {foreignKey: 'idCatalogPhase'});
		this.belongsTo(models.CatalogStatus, {foreignKey: 'idCatalogStatus'});
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
		this.belongsToMany(models.Group, { through: models.PortfolioHasGroup, foreignKey: 'idPortfolio' });
	}

	getURL() {
		return `/portfolio/${this.id}/${this.title.toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/ +/g, '-')}`;
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
		const Action = require('./Action.js');
		const ActionType = require('./ActionType.js');
		const Alias = require('./Alias.js');
		const Service = require('./Service.js');
		const Tag = require('./Tag.js');
		const CatalogPhase = require('./CatalogPhase.js');
		const MetadataPhase = require('./MetadataPhase.js');
		const CatalogStatus = require('./CatalogStatus.js');
		const User = require('./User.js');

		enforcePublishedAssociations = typeof enforcePublishedAssociations !== 'undefined' ? enforcePublishedAssociations : enforcePublished;

		const enforcePublished_ = enforcePublished ? {title: 'publish'} : {};
		const enforcePublishedAssociations_ = enforcePublishedAssociations ? {title: 'publish'} : {};

		return Portfolio.findByPk(id,
			{
				include: [
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
						model: Service,
						include: [
							{
								model: CatalogPhase,
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
						model: CatalogPhase,
						where: enforcePublished_
					},
					{
						model: CatalogStatus
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