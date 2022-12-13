'use strict';
module.exports = class Server extends require('sequelize').Model {
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
			idServerPhase: DataTypes.INTEGER,
			host: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			descriptionShort: DataTypes.STRING(500),
			requirements: DataTypes.STRING(200),
			ownerIT: DataTypes.STRING(60),
			ownerBusiness: DataTypes.STRING(60),
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
			modelName: 'server',
			tableName: 'server',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}
	static associate(models) {
		this.belongsToMany(models.Alias, {through: models.ServerHasAlias, foreignKey: 'idServer'});
		this.belongsToMany(models.Audience, {through: models.ServerHasAudience, foreignKey: 'idServer'});
		this.belongsToMany(models.Package, {through: models.ServerHasPackage, foreignKey: 'idServer'});
		this.belongsToMany(models.Tag, {through: models.ServerHasTag, foreignKey: 'idServer'});
		this.belongsToMany(models.Software, {through: models.SoftwareHasServer, foreignKey: 'idServer'});
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
		this.belongsTo(models.ServerPhase, {foreignKey: 'idServerPhase'});
		this.belongsToMany(models.Group, { through: models.ServerHasGroup, foreignKey: 'idServer' });
	}

	getURL() {
		return `/server/${this.id}/${this.title.toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/ +/g, '-')}`;
	}

	getPhaseTitle() {
		return this.serverPhase.title;
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
		const ServerPhase = require('./ServerPhase.js');
		const Alias = require('./Alias.js');
		const Audience = require('./Audience.js');
		const Tag = require('./Tag.js');
		const MetadataPhase = require('../models/MetadataPhase.js');
		const Software = require('./Software.js');
		const SoftwarePhase = require('./SoftwarePhase.js');
		const Package = require('./Package.js');
		const PackagePhase = require('./PackagePhase.js');
		const User = require('./User.js');

		enforcePublishedAssociations = typeof enforcePublishedAssociations !== 'undefined' ? enforcePublishedAssociations : enforcePublished;

		const enforcePublished_ = enforcePublished ? {title: 'publish'} : {};
		const enforcePublishedAssociations_ = enforcePublishedAssociations ? {title: 'publish'} : {};

		return Server.findByPk(id,
			{
				where: {
					isArchived: false
				},
				include: [
					{
						model: ServerPhase,
						where: enforcePublished_
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
						model: Tag,
						include: [
							{
								model: MetadataPhase,
								where: enforcePublishedAssociations_
							}
						]
					},
					{
						model: Package,
						include: [
							{
								model: PackagePhase,
								where: enforcePublishedAssociations_
							},
							{
								model: Software,
								include: [
									{
										model: SoftwarePhase,
										where: enforcePublishedAssociations_
									}
								]
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


};