'use strict';
const G = require('../server/_global_logic.js');
module.exports = class Building extends require('sequelize').Model {
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
			idSpacePhase: DataTypes.INTEGER,
			title: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			address: DataTypes.STRING(200),
			geo: DataTypes.STRING(100),
			abbr: DataTypes.STRING(10),
			common: DataTypes.STRING(200),
			descriptionShort: DataTypes.STRING(500),
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
			modelName: 'building',
			tableName: 'building',
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
		this.belongsTo(models.SpacePhase, {foreignKey: 'idSpacePhase'});
		this.hasMany(models.Location, {foreignKey: 'idBuilding'});
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
		this.belongsToMany(models.Group, { through: models.BuildingHasGroup, foreignKey: 'idBuilding' });
	}

	getURL() {
		return `/building/${this.id}/${this.title.toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/ +/g, '-')}`;
	}

	getPhaseTitle() {
		return this.spacePhase.title;
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
		const Location = require('./Location.js');
		const LocationType = require('./LocationType.js');
		const SpacePhase = require('./SpacePhase.js');
		const User = require('./User.js');

		enforcePublishedAssociations = typeof enforcePublishedAssociations !== 'undefined' ? enforcePublishedAssociations : enforcePublished;

		const enforcePublished_ = enforcePublished ? {title: 'publish'} : {};
		const enforcePublishedAssociations_ = enforcePublishedAssociations ? {title: 'publish'} : {};

		return Building.findByPk(id,
			{
				include: [
					{
						model: SpacePhase,
						where: enforcePublished_
					},
					{
						model: Location,
						include: [
							{
								model: LocationType
							},
							{
								model: SpacePhase,
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