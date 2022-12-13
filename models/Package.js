'use strict';
module.exports = class Package extends require('sequelize').Model {
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
			idPackagePhase: DataTypes.INTEGER,
			title: {
				type: DataTypes.STRING(200),
				allowNull: false
			},
			descriptionShort: DataTypes.STRING(500),
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
			modelName: 'package',
			tableName: 'package',
			indexes: [
				{
					unique: true,
					fields: ['guid']
				}
			]
		});
	}

	static associate(models) {
		this.belongsTo(models.PackagePhase, {foreignKey: 'idPackagePhase'});
		this.belongsToMany(models.Software, {through: models.PackageHasSoftware, foreignKey: 'idPackage'});
		this.belongsToMany(models.Location, {through: models.LocationHasPackage, foreignKey: 'idPackage'});
		this.belongsToMany(models.Server, {through: models.ServerHasPackage, foreignKey: 'idPackage'});
		this.belongsTo(models.User, { as: 'userCreatedBy', foreignKey: 'createdBy'});
		this.belongsTo(models.User, { as: 'userModifiedBy', foreignKey: 'modifiedBy'});
		this.belongsToMany(models.Group, { through: models.PackageHasGroup, foreignKey: 'idPackage' });
	}

	getURL() {
		return `/package/${this.id}/${this.title.toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/ +/g, '-')}`;
	}

	getPhaseTitle() {
		return this.packagePhase.title;
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
		const PackagePhase = require('./PackagePhase.js');
		const Software = require('./Software.js');
		const SoftwarePhase = require('./SoftwarePhase.js');
		const Location = require('./Location.js');
		const SpacePhase = require('./SpacePhase.js');
		const Server = require('./Server.js');
		const ServerPhase = require('./ServerPhase.js');
		const User = require('./User.js');

		enforcePublishedAssociations = typeof enforcePublishedAssociations !== 'undefined' ? enforcePublishedAssociations : enforcePublished;

		const enforcePublished_ = enforcePublished ? {title: 'publish'} : {};
		const enforcePublishedAssociations_ = enforcePublishedAssociations ? {title: 'publish'} : {};

		return Package.findByPk(id,
			{
				include: [
					{
						model: PackagePhase,
						where: enforcePublished_
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
						model: Location,
						include: [
							{
								model: SpacePhase,
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