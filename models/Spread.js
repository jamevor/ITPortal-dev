'use strict';
const G = require('../server/_global_logic.js');
module.exports = class Spread extends require('sequelize').Model {
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
			idSpreadPhase: DataTypes.INTEGER,
			idSpreadLayout: DataTypes.INTEGER,
			idImage: DataTypes.INTEGER,
			column1IsBox: DataTypes.BOOLEAN,
			column2IsBox: DataTypes.BOOLEAN,
			column3IsBox: DataTypes.BOOLEAN,
			column1: DataTypes.TEXT,
			column2: DataTypes.TEXT,
			column3: DataTypes.TEXT,
			isArchived: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			dateReviewBy: {
				type: DataTypes.DATE,
				defaultValue: G.defaultDateReviewByFunction
			},
			createdBy: DataTypes.INTEGER,
			modifiedBy: DataTypes.INTEGER,
			accessRestricted: DataTypes.BOOLEAN
		}, {
			sequelize,
			timestamps: true,
			freezeTableName: false,
			modelName: 'spread',
			tableName: 'spread',
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
		this.belongsTo(models.SpreadPhase, { foreignKey: 'idSpreadPhase' });
		this.belongsTo(models.SpreadLayout, { foreignKey: 'idSpreadLayout' });
		this.belongsToMany(models.Tag, { through: models.SpreadHasTag, foreignKey: 'idSpread' });
		this.belongsToMany(models.Audience, { through: models.SpreadHasAudience, foreignKey: 'idSpread' });
		this.belongsToMany(models.Alias, { through: models.SpreadHasAlias, foreignKey: 'idSpread' });
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
		this.belongsTo(models.FileUpload, { as: 'image', foreignKey: 'idImage'});
		this.belongsToMany(models.Group, { through: models.SpreadHasGroup, foreignKey: 'idSpread' });
	}

	/**
	 * @author Ryan LaMarche
	 * @param {Number} id the id.
	 * @param {Boolean} enforcePublished whether or not to enforce published phases for model.
	 * @param {Boolean} enforcePublishedAssociations whether or not to enforce published phases for model associations.
	 * @return {Promise} that should resolve with mdoel and all attributes / relations.
	 */
	static findById(id, enforcePublished = false, enforcePublishedAssociations) {
		const SpreadPhase = require('./SpreadPhase.js');
		const SpreadLayout = require('./SpreadLayout.js');
		const Audience = require('./Audience.js');
		const Alias = require('./Alias.js');
		const Tag = require('./Tag.js');
		const MetadataPhase = require('./MetadataPhase.js');
		const User = require('./User.js');
		const FileUpload = require('./FileUpload.js');

		enforcePublishedAssociations = typeof enforcePublishedAssociations !== 'undefined' ? enforcePublishedAssociations : enforcePublished;

		const enforcePublished_ = enforcePublished ? {title: 'publish'} : {};
		const enforcePublishedAssociations_ = enforcePublishedAssociations ? {title: 'publish'} : {};

		return Spread.findByPk(id,
			{
				include: [
					{
						model: SpreadPhase,
						where: enforcePublished_
					},
					{
						model: SpreadLayout
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
						model: Alias,
						include: [
							{
								model: MetadataPhase,
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
				]
			}
		);
	}

	getURL() {
		return `/spread/${this.id}/${this.title.toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/ +/g, '-')}`;
	}

	isPublished() {
		return this.spreadPhase && this.spreadPhase.title && this.spreadPhase.title.toLowerCase() === 'publish';
	}

	getPhaseTitle() {
		return this.spreadPhase.title;
	}

	isAccessRestricted() {
		return this.accessRestricted;
	}
};